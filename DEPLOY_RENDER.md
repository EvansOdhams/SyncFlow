# Deploy to Render (Step-by-Step Guide)

## 🚀 Deploy Backend to Render

### Step 1: Configure Service Settings

On the Render deployment page you're looking at:

#### Source Code
- ✅ Already connected: `EvansOdhams / SyncFlow`
- The repository is linked correctly

#### Name
- ✅ Pre-filled: `SyncFlow`
- You can keep this or change it

#### Root Directory (IMPORTANT!)
**This is what you need to set:**

1. Look for a field called **"Root Directory"** or **"Working Directory"**
2. If you don't see it, click **"Edit"** next to Source Code
3. Set the Root Directory to: **`backend`**
   - This tells Render to deploy only the `backend` folder, not the entire repo

#### Language
- ✅ Already set to: `Node`
- This is correct

### Step 2: Build & Start Commands

After setting the root directory, configure these:

**Build Command:**
```
npm install
```

**Start Command:**
```
npm start
```

### Step 3: Environment Variables

Before deploying, add environment variables:

1. Scroll down to **"Environment Variables"** section
2. Click **"Add Environment Variable"**
3. Add these one by one:

```env
NODE_ENV=production
PORT=10000
```

**Note:** Render uses port 10000 by default, or you can use `$PORT` environment variable.

```env
# Database (you'll add PostgreSQL service first)
DB_HOST=your_db_host
DB_PORT=5432
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_SSL=true
```

```env
# JWT Secret (generate one)
JWT_SECRET=your_secure_random_string_here
```

```env
# Frontend URL (update after deploying frontend)
FRONTEND_URL=https://your-frontend.onrender.com
```

**To generate JWT secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 4: Add PostgreSQL Database

**Before deploying the web service:**

1. Go back to Render dashboard
2. Click **"+ New"** → **"PostgreSQL"**
3. Configure:
   - **Name**: `syncflow-db` (or any name)
   - **Database**: `syncflow`
   - **User**: (auto-generated)
   - **Region**: Choose closest to you
   - **Plan**: Free (if available) or Starter
4. Click **"Create Database"**
5. **Copy the connection details:**
   - Internal Database URL (use this for DB_HOST, etc.)
   - Or use individual fields

### Step 5: Link Database to Service

1. Go back to your web service settings
2. In Environment Variables, you can:
   - Use the database's **Internal Database URL**, OR
   - Add individual variables from the database settings

**Option A: Use Database URL**
```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
```

Then update your connection code to use `DATABASE_URL` if provided.

**Option B: Use Individual Variables**
Add these from your PostgreSQL service:
```env
DB_HOST=dpg-xxxxx-a.oregon-postgres.render.com
DB_PORT=5432
DB_NAME=syncflow
DB_USER=syncflow_user
DB_PASSWORD=your_password
DB_SSL=true
```

### Step 6: Deploy

1. Review all settings
2. Click **"Create Web Service"** or **"Save"**
3. Render will:
   - Clone your repo
   - Install dependencies
   - Build your app
   - Start the service

### Step 7: Run Database Migrations

After first deployment:

**Option A: Via Render Shell**
1. Go to your service → **"Shell"** tab
2. Run:
   ```bash
   npm run migrate
   ```

**Option B: Add to Start Command (Temporary)**
1. Go to Settings → Start Command
2. Change to:
   ```bash
   npm run migrate && npm start
   ```
3. Save and redeploy
4. **After first run, change it back to:** `npm start`

### Step 8: Get Your Backend URL

1. After deployment, Render provides a URL like:
   ```
   https://syncflow.onrender.com
   ```
2. Test it: `https://syncflow.onrender.com/health`
3. Should return: `{"status":"ok",...}`

---

## 🎨 Deploy Frontend to Render (or Vercel)

### Option A: Render (Free Tier)

1. **Create New Web Service**
   - Source: Same GitHub repo
   - **Root Directory**: `frontend`
   - Build Command: `cd frontend && npm install && npm run build`
   - Start Command: `cd frontend && npm run preview` (or use a static server)

2. **Environment Variables:**
   ```
   VITE_API_URL=https://your-backend.onrender.com/api/v1
   ```

### Option B: Vercel (Recommended - Easier for Frontend)

1. Go to https://vercel.com
2. Import your GitHub repo
3. **Root Directory**: `frontend`
4. Framework: Vite
5. Environment Variable: `VITE_API_URL=https://your-backend.onrender.com/api/v1`
6. Deploy

---

## 📋 Complete Render Configuration Checklist

### Backend Service
- [ ] Source: GitHub repo connected
- [ ] **Root Directory: `backend`** ⚠️ IMPORTANT!
- [ ] Name: `SyncFlow` (or your choice)
- [ ] Language: Node
- [ ] Build Command: `npm install`
- [ ] Start Command: `npm start`
- [ ] Environment Variables added:
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=10000` (or use `$PORT`)
  - [ ] Database variables
  - [ ] `JWT_SECRET`
  - [ ] `FRONTEND_URL` (update after frontend deploy)

### PostgreSQL Database
- [ ] Database created
- [ ] Connection details copied
- [ ] Environment variables set in web service

### Post-Deployment
- [ ] Database migrations run
- [ ] Health endpoint tested
- [ ] Backend URL obtained
- [ ] Frontend deployed
- [ ] CORS updated with frontend URL

---

## 🔧 Render-Specific Notes

### Port Configuration
Render provides `$PORT` environment variable. Update your server if needed:

```javascript
const PORT = process.env.PORT || 3001;
```

This will work with Render's `$PORT`.

### Free Tier Limitations
- **Web Services**: Sleep after 15 minutes of inactivity
- **PostgreSQL**: 90 days free trial, then paid
- **Bandwidth**: Limited on free tier

### Auto-Deploy
- Render auto-deploys on git push to main branch
- You can disable this in settings

---

## 🆘 Troubleshooting

### "Root Directory not found"
- Make sure you typed `backend` (lowercase)
- Check that the `backend` folder exists in your repo
- Verify the folder name matches exactly

### "Build failed"
- Check build logs in Render dashboard
- Verify `package.json` exists in `backend` folder
- Check Node.js version (Render uses Node 18 by default)

### "Database connection failed"
- Verify database is created and running
- Check environment variables are correct
- Ensure `DB_SSL=true` for Render PostgreSQL

### "Service keeps restarting"
- Check logs for errors
- Verify start command is correct
- Check port configuration

---

## 📝 Next Steps After Deployment

1. **Test Backend:**
   ```
   https://your-service.onrender.com/health
   ```

2. **Deploy Frontend:**
   - Use Vercel (easiest) or Render
   - Set `VITE_API_URL` to your Render backend URL

3. **Update CORS:**
   - Go to backend settings
   - Update `FRONTEND_URL` with frontend URL
   - Redeploy

4. **Run Migrations:**
   - Use Render Shell or add to start command temporarily

---

**Your app will be live on Render!** 🚀

