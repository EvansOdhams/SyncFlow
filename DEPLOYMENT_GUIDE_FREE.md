# Deployment Guide - Free Platforms Only

## 🆓 Completely Free Deployment Options

This guide uses **100% free** platforms with generous free tiers perfect for development and small projects.

---

## Recommended Free Stack

### Option 1: Railway + Vercel (Recommended - Easiest)
- **Backend**: Railway (free tier: $5 credit/month)
- **Frontend**: Vercel (free forever)
- **Database**: Railway PostgreSQL (included)

### Option 2: Render + Netlify
- **Backend**: Render (free tier available)
- **Frontend**: Netlify (free forever)
- **Database**: Render PostgreSQL (free tier)

### Option 3: Fly.io + Vercel
- **Backend**: Fly.io (free tier: 3 shared VMs)
- **Frontend**: Vercel (free forever)
- **Database**: Supabase PostgreSQL (free tier)

---

## 🚀 Option 1: Railway + Vercel (Recommended)

### Why This Stack?
- ✅ **Railway**: $5 free credit/month, easy deployment, includes PostgreSQL
- ✅ **Vercel**: Free forever, excellent for React apps, automatic deployments
- ✅ **Simple**: Both have GitHub integration, deploy on push

### Step 1: Deploy Backend to Railway

#### 1.1 Create Railway Account
1. Go to: https://railway.app
2. Sign up with GitHub (free)
3. You get $5 credit/month (enough for small projects)

#### 1.2 Deploy Backend
1. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your SyncFlow repository
   - Select the `backend` folder

2. **Configure Environment Variables**
   - Go to your service → Variables tab
   - Add these variables:
     ```
     NODE_ENV=production
     PORT=3001
     
     # Database (Railway will provide PostgreSQL)
     DB_HOST=${{Postgres.PGHOST}}
     DB_PORT=${{Postgres.PGPORT}}
     DB_NAME=${{Postgres.PGDATABASE}}
     DB_USER=${{Postgres.PGUSER}}
     DB_PASSWORD=${{Postgres.PGPASSWORD}}
     DB_SSL=true
     
     # JWT Secret (generate a new one)
     JWT_SECRET=your_production_jwt_secret_here
     
     # Frontend URL (will be your Vercel URL)
     FRONTEND_URL=https://your-app.vercel.app
     
     # Third-party API keys (add as needed)
     SHOPIFY_WEBHOOK_SECRET=your_webhook_secret
     ```

3. **Add PostgreSQL Database**
   - Click "+ New" → "Database" → "Add PostgreSQL"
   - Railway automatically provides connection variables

4. **Run Migrations**
   - Go to service → Settings → Deploy
   - Add build command: `npm install`
   - Add start command: `npm run migrate && npm start`
   - Or run migrations manually via Railway CLI

5. **Get Your Backend URL**
   - Railway provides a URL like: `https://your-app.up.railway.app`
   - Note this URL for frontend configuration

### Step 2: Deploy Frontend to Vercel

#### 2.1 Create Vercel Account
1. Go to: https://vercel.com
2. Sign up with GitHub (free forever)

#### 2.2 Deploy Frontend
1. **Import Project**
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Select the `frontend` folder

2. **Configure Build Settings**
   - Framework Preset: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Environment Variables**
   - Add: `VITE_API_URL=https://your-backend.up.railway.app/api/v1`
   - Replace with your actual Railway backend URL

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy automatically
   - You'll get a URL like: `https://syncflow.vercel.app`

5. **Update Backend CORS**
   - Go back to Railway
   - Update `FRONTEND_URL` to your Vercel URL
   - Redeploy backend

---

## 🚀 Option 2: Render + Netlify

### Deploy Backend to Render

1. **Sign up**: https://render.com (free tier available)

2. **Create Web Service**
   - New → Web Service
   - Connect GitHub repo
   - Select `backend` folder
   - Build: `npm install`
   - Start: `npm start`

3. **Add PostgreSQL Database**
   - New → PostgreSQL
   - Free tier available (limited hours/month)
   - Copy connection string

4. **Environment Variables**
   - Add all required variables
   - Use Render's PostgreSQL connection string

### Deploy Frontend to Netlify

1. **Sign up**: https://netlify.com (free forever)

2. **Deploy**
   - Add site → Import from Git
   - Select repository
   - Build: `cd frontend && npm install && npm run build`
   - Publish: `frontend/dist`

3. **Environment Variables**
   - Site settings → Environment variables
   - Add: `VITE_API_URL=https://your-backend.onrender.com/api/v1`

---

## 🚀 Option 3: Fly.io + Supabase

### Deploy Backend to Fly.io

1. **Install Fly CLI**
   ```bash
   # Windows (PowerShell)
   powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
   ```

2. **Sign up**: https://fly.io (free tier: 3 shared VMs)

3. **Create Fly App**
   ```bash
   cd backend
   fly launch
   ```

4. **Configure**
   - Follow prompts
   - Add environment variables via `fly secrets set`

### Use Supabase for Database

1. **Sign up**: https://supabase.com (free tier: 500MB database)

2. **Create Project**
   - Get connection string
   - Use in backend environment variables

### Deploy Frontend to Vercel
- Same as Option 1, Step 2

---

## 📋 Quick Deployment Checklist

### Before Deployment

- [ ] All code committed to GitHub
- [ ] Environment variables documented
- [ ] Database migrations ready
- [ ] Production JWT secret generated
- [ ] Third-party API keys ready

### Backend Deployment

- [ ] Backend deployed to Railway/Render/Fly.io
- [ ] PostgreSQL database created
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Backend URL obtained
- [ ] Health endpoint tested: `https://your-backend.com/health`

### Frontend Deployment

- [ ] Frontend deployed to Vercel/Netlify
- [ ] Environment variable `VITE_API_URL` set
- [ ] Frontend URL obtained
- [ ] Backend CORS updated with frontend URL
- [ ] Test login/registration

### Post-Deployment

- [ ] Test all features
- [ ] Update webhook URLs in Shopify/WooCommerce
- [ ] Monitor logs for errors
- [ ] Set up error tracking (optional)

---

## 🔧 Environment Variables Reference

### Backend (.env in production)

```env
NODE_ENV=production
PORT=3001

# Database (provided by hosting platform)
DB_HOST=your_db_host
DB_PORT=5432
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_SSL=true

# JWT
JWT_SECRET=generate_a_secure_random_string_here
JWT_EXPIRES_IN=7d

# Frontend URL
FRONTEND_URL=https://your-frontend.vercel.app

# Third-party (add as needed)
SHOPIFY_WEBHOOK_SECRET=your_secret
TWILIO_ACCOUNT_SID=your_sid
SENDGRID_API_KEY=your_key
```

### Frontend (Vercel/Netlify environment variables)

```env
VITE_API_URL=https://your-backend.up.railway.app/api/v1
```

---

## 🆓 Free Tier Limits

### Railway
- $5 credit/month
- Enough for small projects
- PostgreSQL included

### Vercel
- Unlimited deployments
- 100GB bandwidth/month
- Perfect for frontend

### Render
- Free tier: 750 hours/month
- Sleeps after 15 min inactivity
- PostgreSQL: 90 days free trial

### Netlify
- 100GB bandwidth/month
- Unlimited sites
- Great for static sites

### Supabase
- 500MB database
- 2GB bandwidth
- Perfect for PostgreSQL

---

## 🚨 Important Notes

1. **Database Migrations**: Run migrations after first deployment
2. **Environment Variables**: Never commit `.env` files
3. **CORS**: Update backend CORS with frontend URL
4. **Webhooks**: Update webhook URLs in Shopify/WooCommerce to point to production
5. **SSL**: All platforms provide free SSL certificates

---

## 📝 Next Steps

1. Choose your preferred stack (I recommend Railway + Vercel)
2. Follow the deployment steps
3. Test thoroughly
4. Update documentation with production URLs

**Need help?** Each platform has excellent documentation and support!

