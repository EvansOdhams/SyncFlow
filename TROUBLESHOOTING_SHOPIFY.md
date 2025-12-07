# Troubleshooting Shopify Connection

## Current Issue: "Invalid access token" (401 Error)

You're using the correct token format (`shpat_...`), but Shopify is rejecting it. Here are the most common causes:

### 1. Token Doesn't Have Required Permissions

The token needs these specific scopes:
- ✅ `read_products`
- ✅ `write_products` (optional, but recommended)
- ✅ `read_inventory`
- ✅ `write_inventory`
- ✅ `read_orders`
- ✅ `read_locations`

**To fix:**
1. Go to your Shopify admin: https://admin.shopify.com/store/silkorc
2. Settings → Apps and sales channels
3. Click "Develop apps"
4. Find your app and click on it
5. Click "Configure Admin API scopes"
6. Make sure ALL the scopes above are checked
7. Click "Save"
8. **Reinstall the app** (important!)
9. Get a new access token after reinstalling

### 2. Token Was Revoked or Expired

If you've revoked the app or the token was regenerated, you need a new one.

**To fix:**
1. Create a new app or use an existing one
2. Make sure it's installed
3. Get a fresh access token

### 3. Token is Incomplete

Make sure you copied the ENTIRE token. Shopify tokens are usually 32-40 characters long (after the `shpat_` prefix).

**Check:**
- Your token should be: `shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- That's 38 characters total
- Make sure there are no spaces before or after

### 4. App Not Installed

The access token only works after the app is installed on your store.

**To fix:**
1. Go to your app settings
2. Click "Install app" button
3. Confirm installation
4. Then get the access token

### 5. Wrong Store

Make sure the shop domain matches the store where the app is installed.

**Check:**
- Shop domain: `silkorc`
- Token is from the same store

## Step-by-Step: Get a Fresh Token

1. **Go to Shopify Admin:**
   ```
   https://admin.shopify.com/store/silkorc
   ```

2. **Navigate to Apps:**
   - Settings → Apps and sales channels
   - Scroll down → Click "Develop apps"

3. **Create or Select App:**
   - If you have an app, click on it
   - If not, click "Create an app" → Name it "SyncFlow" → Create

4. **Set Permissions:**
   - Click "Configure Admin API scopes"
   - Check these boxes:
     - ✅ read_products
     - ✅ write_products
     - ✅ read_inventory
     - ✅ write_inventory
     - ✅ read_orders
     - ✅ read_locations
   - Click "Save"

5. **Install the App:**
   - Click "Install app" button
   - Click "Install" to confirm
   - **This step is critical!**

6. **Get the Token:**
   - After installation, find "Admin API access token"
   - Click "Reveal token once"
   - **Copy the ENTIRE token** (it's long!)
   - It should start with `shpat_`

7. **Test the Token:**
   - Use it in SyncFlow
   - Shop Domain: `silkorc`
   - Access Token: (paste the full token)

## Verify Token Works

You can test the token manually using curl:

```bash
curl -H "X-Shopify-Access-Token: YOUR_TOKEN_HERE" \
  "https://silkorc.myshopify.com/admin/api/2024-01/products.json?limit=1"
```

If this works, the token is valid. If not, check the error message.

## Common Error Messages

- **401 Unauthorized**: Token is invalid or missing permissions
- **403 Forbidden**: Token doesn't have required scopes
- **404 Not Found**: Shop domain is incorrect

## Still Not Working?

1. Check backend terminal logs for detailed error
2. Verify token in Shopify admin (make sure it's the Admin API token, not OAuth token)
3. Try creating a completely new app
4. Make sure the app is installed before getting the token

