# Deploy Backend to Railway (Step-by-Step)

## Prerequisites
- GitHub account
- Railway account (free signup)

## Step 1: Prepare Backend

1. **Ensure backend is ready:**
   ```bash
   cd backend
   npm install
   ```

2. **Test locally:**
   ```bash
   npm run dev
   ```

## Step 2: Deploy to Railway

### 2.1 Create Railway Account
1. Go to https://railway.app
2. Click "Start a New Project"
3. Sign up with GitHub

### 2.2 Deploy from GitHub
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Authorize Railway to access your GitHub
4. Select your `SyncFlow` repository
5. Railway will detect it's a Node.js project

### 2.3 Configure Service
1. Railway will create a service
2. Click on the service
3. Go to "Settings" tab
4. Set:
   - **Root Directory**: `backend`
   - **Start Command**: `npm start`

### 2.4 Add PostgreSQL Database
1. Click "+ New" button
2. Select "Database" → "Add PostgreSQL"
3. Railway will automatically:
   - Create the database
   - Provide connection variables
   - Link it to your service

### 2.5 Set Environment Variables
1. Go to "Variables" tab
2. Add these variables:

```env
NODE_ENV=production
PORT=3001

# Database (Railway auto-provides these, use the reference variables)
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_NAME=${{Postgres.PGDATABASE}}
DB_USER=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
DB_SSL=true

# Generate a secure JWT secret
JWT_SECRET=your_secure_random_string_here

# Frontend URL (update after deploying frontend)
FRONTEND_URL=https://your-app.vercel.app
```

**To generate JWT secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2.6 Run Database Migrations

**Option A: Via Railway CLI**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Run migrations
railway run npm run migrate
```

**Option B: Via Railway Dashboard**
1. Go to your service
2. Click "Deployments"
3. Click on latest deployment
4. Open "View Logs"
5. Or use Railway's console feature

**Option C: Add to start command (temporary)**
In Settings → Deploy, change start command to:
```bash
npm run migrate && npm start
```
(Remove after first deployment)

### 2.7 Get Your Backend URL
1. Go to "Settings" → "Networking"
2. Railway provides a URL like: `https://syncflow-production.up.railway.app`
3. Copy this URL - you'll need it for frontend

### 2.8 Test Backend
Visit: `https://your-backend-url/health`

Should return:
```json
{
  "status": "ok",
  "timestamp": "...",
  "service": "SyncFlow Backend API"
}
```

## Step 3: Update CORS After Frontend Deployment

Once frontend is deployed:
1. Go to Railway → Your Service → Variables
2. Update `FRONTEND_URL` with your Vercel/Netlify URL
3. Redeploy (Railway auto-redeploys on variable change)

## Troubleshooting

### Database Connection Issues
- Check that PostgreSQL service is linked
- Verify environment variables are correct
- Check Railway logs for connection errors

### Build Fails
- Check that `package.json` has correct scripts
- Verify Node.js version (Railway uses Node 18 by default)
- Check build logs in Railway dashboard

### Migrations Not Running
- Run manually via Railway CLI
- Or add to start command temporarily

## Railway Free Tier
- $5 credit/month
- Enough for small projects
- PostgreSQL included
- Auto-deploys on git push

---

**Next**: Deploy frontend to Vercel (see DEPLOY_VERCEL.md)

