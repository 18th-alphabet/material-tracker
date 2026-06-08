# GitHub Setup Guide for Material Tracker

This guide walks you through pushing your Material Tracker project to GitHub and enabling GitHub Pages.

## Step 1: Create a GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **+** icon in the top right → **New repository**
3. Enter repository name: `material-tracker` (or your preferred name)
4. Add description: "A responsive web app for tracking income, expenses, and handovers"
5. Choose **Public** (required for GitHub Pages)
6. **DO NOT** initialize with README, .gitignore, or license (we already have them)
7. Click **Create repository**

## Step 2: Push Your Project to GitHub

After creating the repository, GitHub will show you commands. Run these in your terminal:

```bash
# Navigate to your project
cd d:\Others\material_tracker

# Add GitHub as remote origin
git remote add origin https://github.com/YOUR_USERNAME/material-tracker.git

# Rename branch to main (if needed)
git branch -M main

# Push the code
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username.**

## Step 3: Set Up GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (top right of repo)
3. Scroll down to **Pages** section (on the left sidebar)
4. Under **Source**, select:
   - Branch: **main**
   - Folder: **/ (root)**
5. Click **Save**

GitHub will show you: "Your site is ready to be published at: `https://YOUR_USERNAME.github.io/material-tracker`"

Wait 1-2 minutes for the site to build and deploy.

## Step 4: Verify Your Live Site

Visit: `https://YOUR_USERNAME.github.io/material-tracker`

Your Material Tracker should be live! 🎉

## Troubleshooting

### "Repository not found" error
- Verify you used the correct GitHub URL
- Check your username is correct
- Ensure the repository is public

### Pages not deploying
- Check that `index.html` is in the root directory
- Visit the **Actions** tab to see deployment status
- Wait a few minutes and refresh

### 404 on GitHub Pages
- Verify the repository name matches your URL
- Check that the branch is set to `main` in Pages settings
- Ensure `index.html` is in the root folder

## Updating Your Site

After making changes locally:

```bash
# Add changes
git add .

# Commit with a message
git commit -m "Update: describe your changes"

# Push to GitHub
git push origin main
```

Your GitHub Pages site updates automatically!

## Optional: Configure Custom Domain

If you have a custom domain:

1. Go to **Settings** → **Pages**
2. Under **Custom domain**, enter your domain
3. Add DNS records as instructed
4. GitHub will verify and set up HTTPS

## Environment Setup Complete ✅

Your Material Tracker is now:
- ✅ Version controlled with Git
- ✅ Hosted on GitHub
- ✅ Available via GitHub Pages
- ✅ Ready for collaboration

**Next Steps:**
- Share your GitHub Pages URL with others
- Continue developing and pushing updates
- Consider adding GitHub Actions for CI/CD

## Git Commands Reference

```bash
# Check status
git status

# View commit history
git log --oneline

# Create a new branch
git checkout -b feature-name

# Switch branches
git checkout branch-name

# Merge branches
git merge branch-name

# View all remotes
git remote -v
```

## Additional Resources

- [GitHub Pages Docs](https://pages.github.com/)
- [Git Guide](https://git-scm.com/guide)
- [GitHub Docs](https://docs.github.com/)
- [Markdown Guide](https://guides.github.com/features/mastering-markdown/)

---

For help, visit GitHub Support: https://support.github.com/
