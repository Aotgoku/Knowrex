# 🔒 Security Checklist for Knowrex

## ✅ Security Issues RESOLVED

### Fixed in Latest Commit
- ✅ **Removed 14 escalation files** containing user conversation data from git tracking
- ✅ **Updated .gitignore** to exclude all runtime data folders
- ✅ **Added .gitkeep files** to preserve folder structure without tracking content
- ✅ **.env file is NOT tracked** (already protected by .gitignore)

---

## 🔍 Current Security Status

### Protected Files & Folders (NOT in Git)
- ✅ `.env` - Your Gemini API key
- ✅ `.env.local` - Local environment overrides
- ✅ `data/escalations/*.json` - User questions and conversations
- ✅ `data/faq/*.json` - FAQ entries
- ✅ `data/documents/*.json` - Uploaded document metadata
- ✅ `data/chroma/*` - Vector embeddings
- ✅ `public/uploads/*` - User uploaded files

### Files IN Git (Safe)
- ✅ Source code files (.tsx, .ts, .css)
- ✅ Configuration files (package.json, tsconfig.json, next.config.ts)
- ✅ Empty folder markers (.gitkeep files)
- ✅ Documentation (README.md, etc.)

---

## ⚠️ Before Pushing to GitHub

Run this command to verify nothing sensitive is staged:
```powershell
git status
```

Expected output should show:
- ✅ No `.env` files
- ✅ No `data/escalations/*.json` files
- ✅ No `data/faq/*.json` files
- ✅ No `public/uploads/*` files (except .gitkeep)

---

## 🚀 Before Deploying to Vercel

### Step 1: Verify .gitignore
```powershell
# Check that sensitive patterns are ignored
Get-Content .gitignore | Select-String "env|data/escalations|data/faq"
```

### Step 2: Check What Will Be Pushed
```powershell
# See what files are tracked
git ls-files | Select-String "data/"
```

You should ONLY see:
- `data/chroma/.gitkeep`
- `data/documents/.gitkeep`
- `data/escalations/.gitkeep`
- `data/faq/.gitkeep`

### Step 3: Environment Variables for Vercel
In Vercel dashboard, manually add:
```
GEMINI_API_KEY=AIzaSyBO6wlIgkdtkrHIuNd0UxRbCzCowpLmFvs
```
**⚠️ NEVER commit this to git!**

---

## 🔐 Additional Security Recommendations

### Immediate (Before Deployment)
1. ✅ **DONE** - Remove sensitive data from git
2. ⚠️ **TODO** - Consider rotating your Gemini API key (if it was ever committed)
3. ⚠️ **TODO** - Add authentication to admin panel (`/admin/*` routes)
4. ⚠️ **TODO** - Add rate limiting to prevent API abuse

### Short-term (After Deployment)
1. Add input sanitization for user queries
2. Implement CSRF protection
3. Add API request logging (without storing PII)
4. Set up monitoring for unusual activity

### Long-term (Production Ready)
1. Move to proper database (PostgreSQL/Supabase)
2. Implement user authentication (NextAuth.js)
3. Add role-based access control (RBAC)
4. Regular security audits
5. Set up automated vulnerability scanning

---

## 🔍 How to Check Your GitHub Repository

After pushing, go to your GitHub repo and verify:

1. **Check Files Tab**
   - ✅ No `.env` file visible
   - ✅ No files in `data/escalations/` (except .gitkeep)
   - ✅ No files in `data/faq/` (except .gitkeep)

2. **Check Commits**
   - Go to commit history
   - Look for commit: "Security: Remove sensitive user data..."
   - Verify escalation files are deleted (red minus signs)

3. **Check .gitignore**
   - Should contain: `.env*`, `data/escalations/*`, `data/faq/*`

---

## 🆘 If You Accidentally Committed Sensitive Data

If you pushed `.env` or user data to GitHub:

### Step 1: Remove from History
```powershell
# Install BFG Repo Cleaner
# Download from: https://rtyley.github.io/bfg-repo-cleaner/

# Remove .env from all history
java -jar bfg.jar --delete-files .env

# Clean up
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

### Step 2: Force Push
```powershell
git push origin main --force
```

### Step 3: Rotate API Keys
1. Go to https://aistudio.google.com/app/apikey
2. Delete old API key
3. Create new API key
4. Update `.env` locally and in Vercel

---

## ✅ Final Pre-Deployment Checklist

Before running `git push`:

- [ ] Verified `.env` is not in `git status`
- [ ] Verified no escalation files in `git ls-files`
- [ ] Reviewed latest commit with `git show HEAD`
- [ ] Checked `.gitignore` includes all sensitive patterns
- [ ] Prepared to add `GEMINI_API_KEY` manually in Vercel dashboard

---

## 📝 Quick Reference Commands

```powershell
# Check what's tracked by git
git ls-files | Select-String "data/"

# Check what's ignored
git status --ignored

# View latest commit details
git show HEAD --stat

# Check for .env in history
git log --all --full-history -- .env

# Preview what will be pushed
git log origin/main..HEAD --oneline
```

---

**Your repository is now secure and ready for deployment! 🎉**

Remember: The `.env` file stays on your local machine and Vercel dashboard only. Never commit it!
