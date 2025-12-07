# Deployment Checklist

## Pre-Deployment

### Code Preparation
- [ ] All code committed to GitHub
- [ ] No sensitive data in code (use environment variables)
- [ ] `.env` files in `.gitignore`
- [ ] `README.md` updated with deployment info
- [ ] All features tested locally

### Environment Variables
- [ ] JWT secret generated for production
- [ ] All third-party API keys ready
- [ ] Database credentials documented
- [ ] Frontend API URL determined

### Database
- [ ] Migration scripts ready
- [ ] Seed data prepared (if needed)
- [ ] Backup strategy considered

---

## Backend Deployment (Railway)

### Setup
- [ ] Railway account created
- [ ] GitHub repository connected
- [ ] Service created from `backend` folder
- [ ] PostgreSQL database added

### Configuration
- [ ] Root directory set to `backend`
- [ ] Start command: `npm start`
- [ ] Environment variables added:
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=3001`
  - [ ] Database variables (from Railway)
  - [ ] `JWT_SECRET` (secure random string)
  - [ ] `FRONTEND_URL` (placeholder, update later)

### Database
- [ ] Database migrations run
- [ ] Database connection tested
- [ ] Tables created successfully

### Testing
- [ ] Backend URL obtained
- [ ] Health endpoint tested: `/health`
- [ ] API endpoints accessible
- [ ] CORS configured (temporary frontend URL)

---

## Frontend Deployment (Vercel)

### Setup
- [ ] Vercel account created
- [ ] GitHub repository connected
- [ ] Project created from `frontend` folder

### Configuration
- [ ] Framework: Vite
- [ ] Root directory: `frontend`
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Environment variable added:
  - [ ] `VITE_API_URL` (backend URL)

### Testing
- [ ] Frontend deployed successfully
- [ ] Frontend URL obtained
- [ ] App loads without errors
- [ ] API calls working
- [ ] Login/registration tested

---

## Post-Deployment

### Backend Updates
- [ ] Update `FRONTEND_URL` in Railway with actual Vercel URL
- [ ] Backend redeployed with correct CORS
- [ ] Test API from frontend

### Third-Party Services
- [ ] Shopify webhook URLs updated (if using)
- [ ] WooCommerce webhook URLs updated (if using)
- [ ] Test webhook endpoints

### Monitoring
- [ ] Check Railway logs for errors
- [ ] Check Vercel logs for errors
- [ ] Test all major features:
  - [ ] User registration
  - [ ] User login
  - [ ] Platform connection
  - [ ] Inventory sync
  - [ ] Order viewing

### Documentation
- [ ] Production URLs documented
- [ ] Environment variables documented
- [ ] Deployment process documented
- [ ] Troubleshooting guide updated

---

## Production URLs

After deployment, document your URLs:

**Frontend:**
```
https://your-app.vercel.app
```

**Backend API:**
```
https://your-backend.up.railway.app
```

**Health Check:**
```
https://your-backend.up.railway.app/health
```

**API Base:**
```
https://your-backend.up.railway.app/api/v1
```

---

## Security Checklist

- [ ] All secrets in environment variables (not in code)
- [ ] JWT secret is strong and unique
- [ ] Database credentials secure
- [ ] CORS configured correctly
- [ ] HTTPS enabled (automatic on Vercel/Railway)
- [ ] No sensitive data in logs

---

## Rollback Plan

If something goes wrong:

1. **Railway**: Go to Deployments → Select previous deployment → Redeploy
2. **Vercel**: Go to Deployments → Select previous deployment → Promote to Production

---

## Maintenance

### Regular Tasks
- [ ] Monitor error logs weekly
- [ ] Check database size (free tier limits)
- [ ] Review usage (Railway credits)
- [ ] Update dependencies monthly
- [ ] Backup database regularly

### Scaling (When Needed)
- Upgrade Railway plan if needed
- Consider database optimization
- Add caching if needed
- Monitor performance

---

**Deployment Complete!** 🚀

Your SyncFlow app is now live and accessible worldwide!

