# Render Quick Start - Backend Directory Setup

## ⚠️ Setting Root Directory on Render

On the Render deployment page you're currently on:

### Find the Root Directory Field

**Option 1: In the form**
- Look for a field labeled **"Root Directory"** or **"Working Directory"**
- It might be below the "Name" field or in advanced settings

**Option 2: Click Edit on Source Code**
1. Click the **"Edit"** button (pencil icon) next to "Source Code"
2. You should see more options including **"Root Directory"**
3. Enter: **`backend`**

**Option 3: After Creating Service**
- If you don't see it now, create the service first
- Then go to Settings → you'll find "Root Directory" there
- Set it to: **`backend`**

### What to Enter

In the **Root Directory** field, enter exactly:
```
backend
```

This tells Render to:
- Look in the `backend` folder for `package.json`
- Run commands from the `backend` directory
- Deploy only the backend code

---

## 📋 Complete Render Configuration

### Current Page Settings

1. **Source Code**: ✅ `EvansOdhams / SyncFlow` (correct)
2. **Name**: ✅ `SyncFlow` (you can keep this)
3. **Root Directory**: ⚠️ **Set to: `backend`** (IMPORTANT!)
4. **Language**: ✅ `Node` (correct)

### Build & Start Commands

After setting root directory, configure:

**Build Command:**
```
npm install
```

**Start Command:**
```
npm start
```

### Environment Variables (Add These)

Before clicking "Create", add environment variables:

1. Click **"Advanced"** or look for **"Environment Variables"** section
2. Add these:

```env
NODE_ENV=production
PORT=10000
```

**Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Then add:
```env
JWT_SECRET=paste_generated_secret_here
```

**Database variables** (add after creating PostgreSQL):
```env
DB_HOST=your_db_host_from_render
DB_PORT=5432
DB_NAME=syncflow
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_SSL=true
```

**Frontend URL** (update after deploying frontend):
```env
FRONTEND_URL=https://your-frontend-url.com
```

---

## 🗄️ Add PostgreSQL Database First

**Before deploying the web service:**

1. Go back to Render dashboard (click "My Workspace" or Render logo)
2. Click **"+ New"** → **"PostgreSQL"**
3. Configure:
   - Name: `syncflow-db`
   - Database: `syncflow`
   - Plan: Free (if available)
4. Click **"Create Database"**
5. **Copy the connection details** from the database settings
6. Use them in your web service environment variables

---

## ✅ Quick Checklist

Before clicking "Create Web Service":

- [ ] Root Directory set to: `backend`
- [ ] Build Command: `npm install`
- [ ] Start Command: `npm start`
- [ ] PostgreSQL database created (get connection details)
- [ ] Environment variables ready to add:
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=10000`
  - [ ] Database variables (from PostgreSQL service)
  - [ ] `JWT_SECRET` (generated)
  - [ ] `FRONTEND_URL` (placeholder for now)

---

## 🚀 After Deployment

1. **Get your backend URL** (e.g., `https://syncflow.onrender.com`)
2. **Run migrations** via Render Shell:
   - Service → Shell tab → `npm run migrate`
3. **Test**: Visit `https://your-service.onrender.com/health`
4. **Deploy frontend** (Vercel recommended)
5. **Update CORS** with frontend URL

---

**Need help finding the Root Directory field?** 
- It might be in "Advanced" settings
- Or appear after you click "Edit" on Source Code
- Or be in Settings after creating the service

The key is: **Set Root Directory to `backend`** so Render knows which folder to deploy!

