# Deploy Frontend to Vercel (Step-by-Step)

## Prerequisites
- GitHub account
- Vercel account (free)
- Backend already deployed (for API URL)

## Step 1: Prepare Frontend

1. **Ensure frontend is ready:**
   ```bash
   cd frontend
   npm install
   npm run build  # Test build locally
   ```

2. **Create `.env.production` (optional, for local testing):**
   ```env
   VITE_API_URL=https://your-backend.up.railway.app/api/v1
   ```

## Step 2: Deploy to Vercel

### 2.1 Create Vercel Account
1. Go to https://vercel.com
2. Click "Sign Up"
3. Sign up with GitHub (recommended)

### 2.2 Import Project
1. Click "Add New" → "Project"
2. Click "Import Git Repository"
3. Select your `SyncFlow` repository
4. Click "Import"

### 2.3 Configure Project
Vercel should auto-detect Vite, but verify:

- **Framework Preset**: Vite
- **Root Directory**: `frontend` (important!)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 2.4 Set Environment Variables
1. Before deploying, click "Environment Variables"
2. Add:
   ```
   VITE_API_URL = https://your-backend.up.railway.app/api/v1
   ```
   (Replace with your actual Railway backend URL)

3. Click "Add" for each environment:
   - Production
   - Preview
   - Development

### 2.5 Deploy
1. Click "Deploy"
2. Vercel will:
   - Install dependencies
   - Build your app
   - Deploy to production
3. Wait for deployment to complete (1-2 minutes)

### 2.6 Get Your Frontend URL
1. After deployment, you'll see:
   - Production URL: `https://syncflow.vercel.app` (or custom)
   - Deployment status: Ready

2. **Copy this URL** - you'll need it for:
   - Backend CORS configuration
   - Testing

### 2.7 Test Frontend
1. Visit your Vercel URL
2. Try logging in/registering
3. Check browser console for errors

## Step 3: Update Backend CORS

After frontend is deployed:

1. Go to Railway → Your Backend Service → Variables
2. Update `FRONTEND_URL`:
   ```
   FRONTEND_URL=https://your-app.vercel.app
   ```
3. Railway will auto-redeploy

## Step 4: Custom Domain (Optional)

1. Go to Vercel → Your Project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Vercel provides free SSL automatically

## Vercel Features

### Automatic Deployments
- Every push to `main` → Production
- Pull requests → Preview deployments
- Automatic HTTPS/SSL

### Environment Variables
- Set per environment (production/preview/development)
- Secure and encrypted

### Analytics (Optional)
- Free analytics available
- Enable in project settings

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Verify `package.json` scripts
- Ensure all dependencies are in `package.json`

### API Connection Issues
- Verify `VITE_API_URL` is correct
- Check backend CORS settings
- Test backend health endpoint

### Routing Issues
- Vercel auto-configures SPA routing
- If issues, check `vercel.json` configuration

## Vercel Free Tier
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Custom domains
- ✅ Preview deployments for PRs

---

**Your app is now live!** 🎉

Frontend: `https://your-app.vercel.app`  
Backend: `https://your-backend.up.railway.app`

