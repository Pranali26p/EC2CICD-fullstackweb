# Tasks CRUD — Full-Stack Learning Project

A simple but complete full-stack CRUD app built to learn **EC2 deployment** and
**CI/CD** end to end. Create, read, update, and delete tasks.

- **Frontend**: React (Create React App style)
- **Backend**: Node.js + Express REST API
- **Database**: MySQL (designed for AWS RDS)
- **Deploy**: EC2 + Nginx + PM2
- **CI/CD**: GitHub Actions

```
.
├── backend/          Express API (CRUD for /api/tasks)
├── frontend/         React single-page app
├── database/         schema.sql (run against RDS)
├── docs/
│   ├── EC2_DEPLOYMENT.md   step-by-step manual deploy
│   └── CICD_SETUP.md       GitHub Actions pipeline guide
└── .github/workflows/deploy.yml   the CI/CD pipeline
```

---

## Run it locally

You need **Node.js 20+** and a **MySQL** server (local or RDS).

### 1. Database

Create the schema (local MySQL example):

```bash
mysql -u root -p < database/schema.sql
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env        # edit DB_* values to match your MySQL
npm run dev                 # starts on http://localhost:5000
```

Check it: `curl http://localhost:5000/health`

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env        # REACT_APP_API_URL=http://localhost:5000/api
npm start                   # opens http://localhost:3000
```

---

## API reference

Base URL: `/api`

| Method | Path | Description |
|---|---|---|
| GET | `/tasks` | List all tasks |
| GET | `/tasks/:id` | Get one task |
| POST | `/tasks` | Create a task `{ title, description?, completed? }` |
| PUT | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |

Example:

```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn CI/CD","description":"Set up GitHub Actions"}'
```

---

## Deploy to AWS

Follow the guides in order:

1. **[docs/EC2_DEPLOYMENT.md](docs/EC2_DEPLOYMENT.md)** — provision RDS + EC2 and
   deploy manually once.
2. **[docs/CICD_SETUP.md](docs/CICD_SETUP.md)** — wire up GitHub Actions so every
   push to `main` deploys automatically.

---

## Suggested learning path

1. Get it running locally (above).
2. Provision RDS and connect the local backend to it — now your DB is in the cloud.
3. Deploy to EC2 manually following `EC2_DEPLOYMENT.md`.
4. Add the GitHub secrets and let the pipeline deploy for you.
5. Experiment: break a test, add a field to `tasks`, add an approval gate.
