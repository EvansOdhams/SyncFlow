# Shopify Setup Guide - Getting Your Access Token

## 🎯 Two Methods to Get Your Access Token

**Method 1: Custom App (Easiest - Recommended for MVP)** ⭐  
**Method 2: Partner Dashboard App (For Development)**

---

## Method 1: Custom App (EASIEST - Start Here!)

This is the simplest method and works perfectly for connecting your existing store.

### Step 1: Access Your Shopify Admin

1. Go to: https://admin.shopify.com
2. Log in and select your store

### Step 2: Create a Custom App

1. **Go to Settings**
   - Click on **Settings** (bottom left of admin panel)
   - Or go directly to: `https://admin.shopify.com/store/YOUR_STORE_NAME/settings`

2. **Navigate to Apps and sales channels**
   - In Settings, click on **"Apps and sales channels"**
   - Or go to: `https://admin.shopify.com/store/YOUR_STORE_NAME/settings/apps`

3. **Develop apps**
   - Click on **"Develop apps"** (at the bottom of the page)
   - If you see a message about enabling custom app development, click **"Allow custom app development"**

4. **Create an app**
   - Click the **"Create an app"** button
   - Enter an app name (e.g., "SyncFlow Integration")
   - Enter your email (optional)
   - Click **"Create app"**

### Step 3: Configure API Scopes (Permissions)

1. **Click on "Configure Admin API scopes"**

2. **Select the required scopes:**
   - ✅ `read_products` - Read products
   - ✅ `write_products` - Write products
   - ✅ `read_inventory` - Read inventory levels
   - ✅ `write_inventory` - Update inventory levels
   - ✅ `read_orders` - Read orders
   - ✅ `read_locations` - Read locations (for inventory)

3. **Click "Save"**

### Step 4: Install the App and Get Access Token

1. **Install the app**
   - Click **"Install app"** button
   - Review the permissions and click **"Install"**

2. **Get your access token**
   - After installation, you'll see **"Admin API access token"**
   - Click **"Reveal token once"** or **"Show token"**
   - **IMPORTANT**: Copy this token immediately - you won't be able to see it again!
   - Save it securely (you'll need it for SyncFlow)

### Step 5: Get Your Shop Domain

Your shop domain is simply your store name:
- If your store URL is: `https://your-store.myshopify.com`
- Your shop domain is: `your-store` (without `.myshopify.com`)

### Step 6: Connect to SyncFlow

Now you have everything you need:

1. **Shop Domain**: `your-store` (the part before `.myshopify.com`)
2. **Access Token**: The token you copied in Step 4

Go to SyncFlow dashboard and:
1. Click **"Connect Shopify"**
2. Enter your shop domain (e.g., `your-store`)
3. Paste your access token
4. Optionally add a platform name (e.g., "My Shopify Store")
5. Click **"Connect"**

## Method 2: Using Shopify Partner Dashboard (What You're Looking At)

If you're already in the Partner Dashboard (dev dashboard), here's how to use it:

### Step 1: Create/Select Your App

1. **Go to Partner Dashboard**: https://partners.shopify.com
2. **Click on "Apps"** in the left sidebar
3. **Click "Create app"** or select an existing app
4. **Select "Custom app"** (not "Public app" for now)

### Step 2: Get Your Credentials

From the Settings page you're looking at:

1. **Client ID**: Copy the "Client ID" (you can see it: `ec30e05dd7e7e590ea68603fac999125`)
2. **Client Secret**: 
   - Click the **eye icon** to reveal the secret
   - Copy the secret value
   - Or click **"Copy"** button

### Step 3: Install App on Your Store

1. **Go to "Overview"** tab in your app
2. Click **"Install app"** or **"Test on development store"**
3. Select your store from the list
4. Click **"Install"**

### Step 4: Get Admin API Access Token

**Option A: From Store Admin (After Installation)**
1. Go to your store admin: https://admin.shopify.com/store/YOUR_STORE
2. Go to **Settings → Apps and sales channels**
3. Find your app and click on it
4. Look for **"Admin API access token"**
5. Click **"Reveal token once"** and copy it

**Option B: Generate Token via API (Advanced)**
If you have Client ID and Secret, you can generate a token, but this requires OAuth flow implementation.

### ⚠️ Important Note for Partner Dashboard Method:

The **Client ID** and **Client Secret** you see are for OAuth authentication, not direct access tokens. For SyncFlow MVP, you need the **Admin API access token** which you get after installing the app on your store.

**For MVP, I recommend Method 1 (Custom App) as it's simpler!**

---

## 🚨 Can't Find Access Token? Try This:

### If you're in Partner Dashboard:
1. Make sure you've **installed the app** on your store first
2. Go to your **store admin** (not partner dashboard)
3. Settings → Apps → Find your app → Get access token

### If you're in Store Admin:
1. Make sure you clicked **"Develop apps"** (not just "Apps")
2. Make sure you **installed** the app after creating it
3. The token appears only after installation

### Still Stuck? Use This Alternative:

**Create a new custom app directly in your store:**
1. Go to: `https://admin.shopify.com/store/YOUR_STORE/settings/apps`
2. Scroll down and click **"Develop apps"**
3. Click **"Create an app"**
4. Follow Method 1 steps above

This bypasses the Partner Dashboard entirely and works directly with your store.

## Troubleshooting

### "Failed to connect to Shopify store"
- ✅ Check that your shop domain is correct (no `.myshopify.com`)
- ✅ Verify your access token is correct (no extra spaces)
- ✅ Ensure you've installed the app after creating it
- ✅ Check that you've granted the required permissions

### "Invalid token"
- The token might have been revoked
- Create a new app and get a new token
- Make sure you copied the entire token

### "Permission denied"
- Go back to your app settings
- Ensure all required scopes are selected
- Reinstall the app if needed

## Security Notes

⚠️ **Important Security Tips:**
- Never share your access token publicly
- Store it securely in your `.env` file (backend)
- If you suspect the token is compromised, revoke it and create a new app
- Access tokens have full access to your store based on the scopes you granted

## What SyncFlow Can Do With These Permissions

With the scopes you've granted, SyncFlow can:
- ✅ Read your products and inventory
- ✅ Update inventory levels across platforms
- ✅ Read orders from your store
- ✅ Sync inventory in real-time via webhooks

---

**Need Help?** If you encounter any issues, check:
- Shopify Admin: https://admin.shopify.com
- Shopify API Documentation: https://shopify.dev/docs/api/admin-rest

