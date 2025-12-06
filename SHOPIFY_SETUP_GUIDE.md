# Shopify Setup Guide - Getting Your Access Token

## Quick Steps to Connect Your Shopify Store

### Step 1: Access Your Shopify Admin

1. Log in to your Shopify admin panel: https://admin.shopify.com
2. Select your store

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

## Alternative: Using Shopify Partner Account (For Development)

If you want to create a more permanent integration:

1. **Create a Shopify Partner account**: https://partners.shopify.com
2. **Create a new app** in your partner dashboard
3. **Set up OAuth 2.0** (more complex, but better for production)

For the MVP, the custom app method above is simpler and works perfectly!

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

