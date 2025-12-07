# Quick Shopify Setup - Step by Step

## 🎯 Fastest Way to Get Your Access Token

### Option 1: Direct Store Method (5 minutes) ⭐ RECOMMENDED

1. **Go to your store admin:**
   ```
   https://admin.shopify.com/store/YOUR_STORE_NAME
   ```

2. **Navigate to Apps:**
   - Click **Settings** (bottom left)
   - Click **"Apps and sales channels"**
   - Scroll to bottom
   - Click **"Develop apps"**

3. **Create App:**
   - Click **"Create an app"**
   - Name: `SyncFlow` (or any name)
   - Click **"Create app"**

4. **Set Permissions:**
   - Click **"Configure Admin API scopes"**
   - Check these boxes:
     - ✅ `read_products`
     - ✅ `write_products`
     - ✅ `read_inventory`
     - ✅ `write_inventory`
     - ✅ `read_orders`
     - ✅ `read_locations`
   - Click **"Save"**

5. **Install & Get Token:**
   - Click **"Install app"** button
   - Click **"Install"** to confirm
   - Find **"Admin API access token"** section
   - Click **"Reveal token once"**
   - **COPY THE TOKEN** (you won't see it again!)

6. **Get Shop Domain:**
   - Your shop domain is your store name
   - Example: If URL is `https://my-store.myshopify.com`
   - Shop domain is: `my-store`

7. **Connect in SyncFlow:**
   - Shop Domain: `my-store`
   - Access Token: (paste the token you copied)
   - Click Connect!

---

## Option 2: If You're Using Partner Dashboard

If you're in the Partner Dashboard (dev dashboard) with Client ID/Secret:

### You Need the Access Token, Not Client ID/Secret!

The Client ID and Secret are for OAuth (more complex). For SyncFlow MVP, you need the Admin API access token.

**To get the token:**

1. **Install your app on your store:**
   - In Partner Dashboard → Your App → Overview
   - Click "Install app" or "Test on development store"
   - Select your store

2. **Get token from store admin:**
   - Go to: `https://admin.shopify.com/store/YOUR_STORE`
   - Settings → Apps and sales channels
   - Find your app → Click on it
   - Look for "Admin API access token"
   - Reveal and copy it

---

## 🆘 Troubleshooting

### "I don't see 'Develop apps' button"
- Make sure you're in **Settings → Apps and sales channels**
- Scroll all the way down
- If still not there, you might need to enable it first

### "I created the app but can't find the token"
- **Did you install the app?** The token only appears AFTER installation
- Click "Install app" button after creating it
- Then the token will appear

### "I see Client ID/Secret but not Access Token"
- Client ID/Secret are for OAuth (different method)
- For SyncFlow, you need the **Admin API access token**
- Get it from your **store admin** after installing the app
- Or use Option 1 (Direct Store Method) instead

### "The token doesn't work"
- Make sure you copied the ENTIRE token (they're long!)
- No extra spaces before/after
- Make sure you installed the app with correct permissions
- Try creating a new app if token was revoked

---

## ✅ Quick Checklist

- [ ] Created custom app in store admin
- [ ] Set all required permissions (read/write products, inventory, orders)
- [ ] **Installed the app** (important!)
- [ ] Copied the Admin API access token
- [ ] Got shop domain (store name without .myshopify.com)
- [ ] Connected in SyncFlow successfully

---

**Still having issues?** Try the Direct Store Method (Option 1) - it's the simplest and most reliable!

