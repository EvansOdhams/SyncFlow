# Shopify Token Help - Quick Fix

## ❌ Current Issue
You're using the **API Secret Key** (`shpss_...`) instead of the **Admin API Access Token** (`shpat_...`)

## ✅ Solution

### Use the Correct Token

In the SyncFlow "Connect Shopify" form:

1. **Shop Domain:** `silkorc`
2. **Access Token:** `shpat_your_token_here` 
   - ⚠️ Make sure you copy the ENTIRE token from your Shopify admin
   - ⚠️ It should start with `shpat_` (not `shpss_`)
   - ⚠️ Replace `your_token_here` with your actual token
3. **Platform Name:** (optional) Leave empty or enter a name

### How to Get the Admin API Access Token

If you need to get it again:

1. Go to: https://admin.shopify.com/store/silkorc
2. Settings → Apps and sales channels
3. Click "Develop apps"
4. Find your app (or create a new one)
5. Click on the app
6. Click "Install app" (if not already installed)
7. After installation, find **"Admin API access token"**
8. Click "Reveal token once"
9. Copy the token (it starts with `shpat_`)

### Token Types Explained

- **API Key** (`your_api_key_here`) - Used for OAuth
- **API Secret Key** (`shpss_...`) - Used for OAuth signature verification
- **Admin API Access Token** (`shpat_...`) - ✅ **This is what you need!**

The Admin API Access Token is what allows direct API access to your store.

---

**Try again with the `shpat_` token and it should work!**

