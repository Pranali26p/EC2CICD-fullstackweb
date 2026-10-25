# CI/CD Setup (GitHub Actions)

The pipeline at `.github/workflows/deploy.yml` runs automatically on every push
to `main`. It has two jobs:

1. **build-and-test** — installs deps, runs backend tests, builds the frontend.
   If anything fails here, deployment is skipped.
2. **deploy** — SSHes into your EC2 box, pulls the latest code, reinstalls
   backend deps, rebuilds the frontend, and restarts the app via PM2 + Nginx.

## Required GitHub secrets

Add these under **Repo → Settings → Secrets and variables → Actions**:

| Secret | Value |
|---|---|
| `EC2_HOST` | Public DNS or IP of your EC2 instance |
| `EC2_USER` | `ec2-user` (Amazon Linux) |
| `EC2_SSH_KEY` | Contents of your `.pem` private key file |

> To get the key contents on your machine: open the `.pem` file in a text editor
> and paste the entire contents (including the `-----BEGIN`/`-----END` lines)
> into the `EC2_SSH_KEY` secret.

## How the flow works

```
git push origin main
        │
        ▼
GitHub Actions runner
        │  build + test + frontend build
        ▼
   SSH into EC2  ──►  git pull ──► npm ci ──► pm2 restart ──► nginx reload
```

## Testing the pipeline

1. Push a small change to `main` (e.g. edit a task title in the seed data).
2. Open the **Actions** tab in GitHub and watch the run.
3. Once green, refresh your EC2 URL to confirm the change is live.

## Tips for learning

- Break it on purpose: push failing code and watch `build-and-test` block the
  deploy. This is the whole point of CI.
- Add a manual approval: wrap the `deploy` job in a GitHub
  [Environment](https://docs.github.com/en/actions/deployment/targeting-different-environments)
  with required reviewers.
- Swap SSH deploy for AWS CodeDeploy once you're comfortable — same idea,
  managed by AWS.
