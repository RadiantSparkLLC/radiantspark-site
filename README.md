# Radiant Spark LLC — Official Web & Mobile Apps Production Package

This repository contains the complete production-ready build for Radiant Spark LLC, SparkSync OS, and SparkDeals Hub.

## GitHub Pages Deployment in 3 Simple Steps

1. Unzip this package (`radiantspark-final.zip`).
2. Upload all files and folders (including `assets/`, `app.html`, `index.html`, `CNAME`, `.nojekyll`) into your GitHub repository root (`main` branch).
   - *Tip:* If using Git CLI:
     ```bash
     git add .
     git commit -m "Deploy Radiant Spark & SparkSync Mobile OS"
     git push origin main
     ```
3. In GitHub, go to **Settings** ➔ **Pages**:
   - **Source:** Deploy from a branch
   - **Branch:** `main` ➔ `/ (root)`
   - Click **Save**.
4. Your site will be live immediately at **https://radiantsparkllc.com**!

## Can I Make My GitHub Repository Private?
- **GitHub Free Account:** GitHub Pages is ONLY available on **Public** repositories. If you change a free repository to Private, GitHub Pages turns off and `radiantsparkllc.com` will stop working.
- **GitHub Pro ($4/mo) or GitHub Enterprise:** YES! GitHub Pages supports **Private** repositories. Your code remains private to you, while your website and mobile apps stay publicly live at `radiantsparkllc.com`.
- **Free Private Alternative:** You can also deploy this exact repository to **Cloudflare Pages**, **Vercel**, or **Netlify** (all have free tiers with 100% private GitHub repositories and custom domain support).

## Key Pages Included
- `index.html`: Corporate Global Portal with instant pre-rendered layout & Mobile App Download Center
- `app.html`: Standalone 1,221-Line SparkSync Mobile Super-App (Dynamic Island, 3D Biometric Plexus, Apple Watch ECG telemetry, Smart Photo Cleaner, Market Pulse, 8 tabs, Deals)
- `sparkdeals.html`: Standalone Dedicated SparkDeals Live Hub
- `spardeals.html`: Instant redirect for typo safety
- `manifest.json` & `sw.js`: PWA Mobile app install capabilities
- `CNAME`: Configured for `radiantsparkllc.com`
- `.nojekyll`: Disables Jekyll so all folders and scripts are served correctly
