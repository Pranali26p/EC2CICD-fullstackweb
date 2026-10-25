# EC2 Deployment Guide (Manual)

This walks through deploying the app manually the first time. Doing it by hand
once will make the automated CI/CD pipeline (see `.github/workflows/deploy.yml`)
make much more sense.

Architecture:

```
[ Users ] --> [ EC2 instance ]
                 ├── Nginx        (serves React build + proxies /api to Node)
                 └── Node/Express (PM2) --> [ RDS MySQL ]
```

---

## 1. Create the RDS MySQL database

1. AWS Console → **RDS** → **Create database**.
2. Engine: **MySQL**. Template: **Free tier**.
3. DB instance identifier: `crud-app-db`. Set a master username (`admin`) and password.
4. Instance class: `db.t3.micro`. Storage: 20 GB (default).
5. **Connectivity**: do NOT make it publicly accessible for production, but for
   learning you may. Place it in the same VPC as your EC2 instance.
6. Create a **security group** for the DB that allows inbound **port 3306**
   from your EC2 instance's security group (not from `0.0.0.0/0`).
7. Once available, copy the **endpoint** — you'll need it for `DB_HOST`.

Load the schema (run from your local machine or the EC2 box):

```bash
mysql -h <RDS_ENDPOINT> -P 3306 -u admin -p < database/schema.sql
```

---

## 2. Launch the EC2 instance

1. AWS Console → **EC2** → **Launch instance**.
2. Name: `crud-app-server`. AMI: **Amazon Linux 2023**. Type: `t2.micro`.
3. Create/choose a **key pair** (`.pem`) so you can SSH in.
4. **Security group** inbound rules:
   - SSH (22) from **your IP only**
   - HTTP (80) from `0.0.0.0/0`
5. Launch, then connect:

```bash
ssh -i your-key.pem ec2-user@<EC2_PUBLIC_DNS>
```

---

## 3. Install runtime dependencies on EC2

```bash
# Node.js 20 LTS
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs git nginx

# PM2 keeps the Node process alive and restarts it on reboot/crash
sudo npm install -g pm2
```

---

## 4. Deploy the code

```bash
# Clone your repo
git clone https://github.com/<you>/<repo>.git app
cd app

# --- Backend ---
cd backend
npm ci --omit=dev
cp .env.example .env
nano .env        # fill in RDS endpoint, user, password, DB name
pm2 start src/server.js --name crud-api
pm2 save
pm2 startup      # run the command it prints so PM2 survives reboots

# --- Frontend ---
cd ../frontend
npm ci
# Point the build at the API path served through Nginx
echo "REACT_APP_API_URL=/api" > .env
npm run build
```

---

## 5. Configure Nginx

Serve the React build and proxy `/api` to the Node server:

```bash
sudo nano /etc/nginx/conf.d/crud-app.conf
```

```nginx
server {
    listen 80;
    server_name _;

    root /home/ec2-user/app/frontend/build;
    index index.html;

    # React Router / SPA fallback
    location / {
        try_files $uri /index.html;
    }

    # Forward API calls to the Node process
    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
sudo nginx -t          # test config
sudo systemctl enable nginx
sudo systemctl restart nginx
```

Visit `http://<EC2_PUBLIC_DNS>` — the app should load and talk to RDS.

---

## 6. Common troubleshooting

| Symptom | Likely cause |
|---|---|
| API returns 500 | Wrong RDS creds in `.env`, or DB security group blocks EC2 |
| `pm2 list` shows errored | Check `pm2 logs crud-api` |
| Frontend loads but no data | `REACT_APP_API_URL` wrong, or Nginx `/api` proxy misconfigured |
| Can't SSH | Security group port 22 not open to your IP |

Useful commands:

```bash
pm2 logs crud-api          # backend logs
pm2 restart crud-api       # restart after code change
sudo tail -f /var/log/nginx/error.log
```
