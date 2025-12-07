# Removing Secrets from Git History

GitHub detected Shopify tokens in commit history. Here are the options:

## Option 1: Use GitHub's Allow Feature (Quickest)

GitHub provided this URL to allow the secret:
https://github.com/EvansOdhams/SyncFlow/security/secret-scanning/unblock-secret/36VVNvGmoa54qQLYi5zudsJObVg

**Steps:**
1. Click the URL above
2. Review the secret
3. Click "Allow secret" (if it's a test/example token)
4. Push again

**Note:** Only do this if the token is already invalidated/revoked.

## Option 2: Rewrite Git History (Recommended)

Since the tokens are in old commits, we need to rewrite history:

### Using git filter-repo (Recommended)

```bash
# Install git-filter-repo first (if not installed)
pip install git-filter-repo

# Remove secrets from history
git filter-repo --path SHOPIFY_TOKEN_HELP.md --path TROUBLESHOOTING_SHOPIFY.md --invert-paths
git filter-repo --path SHOPIFY_TOKEN_HELP.md --path TROUBLESHOOTING_SHOPIFY.md

# Force push (WARNING: This rewrites history)
git push origin --force --all
```

### Manual Method

1. Delete the files from history
2. Recreate them without tokens
3. Force push

## Option 3: Create New Branch (Safest)

1. Create a new branch without the problematic commits
2. Cherry-pick clean commits
3. Replace main branch

---

**For now, the files have been updated with placeholders. The tokens are only in git history.**

**Recommendation:** Use Option 1 (GitHub allow) if the token is already revoked, or Option 2 to clean history properly.

