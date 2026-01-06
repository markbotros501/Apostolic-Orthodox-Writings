# Deployment Guide - Patristic Library

This is a static website, which makes it very easy and free to deploy on many platforms.

## Option 1: GitHub Pages (Recommended)

1.  **Push to GitHub**: Initialize a git repository and push your code to GitHub.
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    git branch -M main
    git remote add origin https://github.com/your-username/patristic-library.git
    git push -u origin main
    ```
2.  **Enable Pages**:
    - Go to your repository **Settings**.
    - Click on **Pages** in the sidebar.
    - Under **Source**, select `main` branch and `/ (root)` folder.
    - Click **Save**.
3.  **Done**: Your site will be live at `https://your-username.github.io/patristic-library/`.

## Option 2: Netlify / Vercel

1.  **Connect to Git**: Log in to Netlify or Vercel and import your GitHub repository.
2.  **Configure**:
    - **Build Command**: (Leave empty, this is a static site)
    - **Publish Directory**: `.` (Current directory) or `/`
3.  **Deploy**: Click deploy. These platforms offer automatic HTTPS and fast CDNs.

## Option 3: Traditional Hosting (Apache/Nginx)

If you are uploading to a standard web server:

1.  **Upload**: Upload all files and folders (`index.html`, `assets/`, `pages/`, etc.) to your `public_html` or `www` directory.
2.  **Server Config**:
    - Ensure your server is configured to serve `index.html` as the default document.
    - No special `.htaccess` or `nginx.conf` is strictly required unless you want to set up caching headers or custom 404 pages.

## Important Notes

-   **CORS & Local Testing**: Because the site uses `fetch()` to load content dynamically, it **will not work** if you just double-click `index.html` on your computer (`file://` protocol). You must use a local server (e.g., `python3 -m http.server`) or VS Code's "Live Server" extension to test locally.
-   **Adding Content**:
    1.  Place your HTML work files in `pages/fathers/[father-name]/`.
    2.  Update `assets/js/data.js` to include the new work with the correct path.
