# Hosting Instructions for Historical Events Calendar

This document provides instructions for hosting your Historical Events Calendar website on various free hosting platforms.

## Option 1: GitHub Pages (Recommended)

1. **Create a GitHub account** if you don't have one at [github.com](https://github.com)

2. **Create a new repository**:
   - Go to GitHub and click the '+' icon in the top right corner
   - Select 'New repository'
   - Name your repository (e.g., "historical-events-calendar")
   - Make it public
   - Click 'Create repository'

3. **Upload your files**:
   - Clone the repository to your local machine or use GitHub's web interface
   - Copy all your files (HTML, CSS, JS, sounds folder, etc.) to the repository
   - Commit and push the changes

4. **Enable GitHub Pages**:
   - Go to your repository settings
   - Scroll down to the 'GitHub Pages' section
   - Under 'Source', select 'main' branch
   - Click 'Save'
   - Your site will be published at `https://yourusername.github.io/historical-events-calendar/`

## Option 2: Netlify

1. **Create a Netlify account** at [netlify.com](https://netlify.com)

2. **Deploy your site**:
   - Click 'New site from Git' or drag and drop your project folder to the Netlify dashboard
   - If using Git, connect to your GitHub/GitLab/Bitbucket account and select your repository
   - Configure build settings (not needed for this static site)
   - Click 'Deploy site'

3. **Custom domain** (optional):
   - Netlify provides a free subdomain (e.g., `your-site-name.netlify.app`)
   - You can add a custom domain in the site settings

## Option 3: Vercel

1. **Create a Vercel account** at [vercel.com](https://vercel.com)

2. **Deploy your site**:
   - Click 'New Project'
   - Import your repository from GitHub/GitLab/Bitbucket or upload your files
   - Configure project settings (not needed for this static site)
   - Click 'Deploy'

3. **Custom domain** (optional):
   - Vercel provides a free subdomain (e.g., `your-site-name.vercel.app`)
   - You can add a custom domain in the project settings

## Option 4: Cloudflare Pages

1. **Create a Cloudflare account** at [cloudflare.com](https://cloudflare.com)

2. **Deploy your site**:
   - Go to the Pages section
   - Click 'Create a project'
   - Connect to your GitHub/GitLab account and select your repository
   - Configure build settings (not needed for this static site)
   - Click 'Save and Deploy'

3. **Custom domain** (optional):
   - Cloudflare provides a free subdomain (e.g., `your-site-name.pages.dev`)
   - You can add a custom domain in the project settings

## Option 5: Static.app

1. **Go to [static.app](https://static.app)**

2. **Deploy your site**:
   - Create an account or use the free option
   - Drag and drop your project folder or upload a ZIP file
   - Choose a subdomain for your site
   - Your site will be live immediately

## Important Notes

1. **Ensure all file paths are relative** in your HTML, CSS, and JavaScript files

2. **Update the OpenCalendar.bat file** if you want to keep it:
   ```batch
   @echo off
   start "" "https://your-deployed-website-url"
   ```

3. **Test your site** after deployment to ensure all features work correctly

4. **Keep your repository private** if you have sensitive information in your code

Your Historical Events Calendar is a static website (HTML, CSS, and JavaScript only), making it perfect for these free hosting options. No server-side code or database is required, so deployment is straightforward.