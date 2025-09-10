# Deployment Guide for Nexen-Next-Basics

This guide provides a step-by-step process to deploy the Nexen-Next-Basics project to production. It's tailored for beginners, explaining concepts like hosting, environment variables, and CI/CD, while offering tips for experienced users. Deploying makes your app accessible online.

Before deploying, ensure local setup is complete (see [SETUP.md](SETUP.md)). The project is optimized for Vercel (creators of Next.js), but alternatives are covered.

## Table of Contents
- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Step 1: Prepare for Deployment](#step-1-prepare-for-deployment)
- [Step 2: Deploy to Vercel](#step-2-deploy-to-vercel)
- [Alternative Deployment Options](#alternative-deployment-options)
- [Setting Up Environment Variables in Production](#setting-up-environment-variables-in-production)
- [Testing the Deployed App](#testing-the-deployed-app)
- [Code Changes for Production](#code-changes-for-production)
- [Troubleshooting](#troubleshooting)
- [Tips for Beginners](#tips-for-beginners)
- [Advanced Notes](#advanced-notes)
- [Next Steps](#next-steps)

## Overview
Deployment uploads your code to a hosting platform, where it runs on servers. For Next.js:
- **Build Process:** `npm run build` creates optimized files.
- **Hosting:** Platforms like Vercel handle serverless functions (API routes), static files, and database connections.
- **Database:** MongoDB Atlas works in production (cloud-based).
- **Domain:** Get a custom URL (e.g., yourapp.vercel.app).

**For Beginners:** Local dev is on your computer (localhost:3000); deployment is online (public URL). Always use HTTPS in prod.

**Key Concepts:** Environment variables (secrets like DB URI) differ between dev and prod. GitHub integration automates deploys.

## Prerequisites
- **GitHub Account:** For repo hosting.
- **MongoDB Atlas:** Already set up (free tier sufficient).
- **Vercel Account:** Free for basics (sign up at vercel.com).
- **Project Ready:** Code committed to Git (e.g., `git add . && git commit -m "Ready for deploy"`).
- **Push to GitHub:** Create repo, push code: `git remote add origin <github-url> && git push -u origin main`.

**Note:** Ensure `.env.local` is not committed (gitignored). Secrets go to platform dashboard.

## Step 1: Prepare for Deployment
1. **Install Production Dependencies:** Ensure `package.json` has correct scripts.
   - Run `npm install --production` locally to test (skips dev deps).
2. **Build Locally:** 
   ```
   npm run build
   ```
   - Checks for errors. Output: `.next/` folder with built app.
   - Start prod server: `npm start` and test at localhost:3000.
3. **Environment Vars:** Copy from `.env.local` (e.g., MONGODB_URI). You'll set them on the platform.
4. **Optimize Code:** 
   - In `next.config.ts`, enable image optimization if using images.
   - Ensure API routes handle errors gracefully.
5. **Commit Changes:** `git push` to GitHub.

**Tip:** Use `npm run lint` to fix any code issues before build.

## Step 2: Deploy to Vercel
Vercel is recommended—seamless for Next.js, free tier, auto-deploys on Git push.

1. **Sign Up/Login:** Go to [vercel.com](https://vercel.com), use GitHub to log in.
2. **Import Project:**
   - Click "New Project" > Import GitHub repo (Nexen-Next-Basics).
   - Authorize Vercel to access your repo.
3. **Configure Project:**
   - Framework: Next.js (auto-detected).
   - Root Directory: `./` (default).
   - Build Command: `npm run build` (default).
   - Output Directory: `.next` (default).
   - Install Command: `npm install` (default).
4. **Environment Variables:**
   - Add `MONGODB_URI` (value from Atlas).
   - Click "Add" > Name: MONGODB_URI, Value: your connection string.
   - Environment: All (Production, Preview, Development).
5. **Deploy:**
   - Click "Deploy". Takes 1-2 minutes.
   - Get URL: e.g., nexen-next-basics-abc123.vercel.app.
6. **Auto-Deploys:** Future `git push` triggers rebuilds.

**Success:** Visit the URL, test login/todos.

**Code Reference:** No changes needed; Vercel handles App Router, API routes as serverless functions. See comments in `next.config.ts` for custom config.

## Alternative Deployment Options
If not using Vercel:

### 1. Netlify
- **Steps:** Connect GitHub repo at netlify.com > New site from Git.
- **Config:** Build command: `npm run build`, Publish dir: `.next`.
- **Env Vars:** Add in site settings.
- **Limitation:** API routes as functions; works but Vercel better for Next.js.
- **Free Tier:** Yes, with limits.

### 2. Railway
- **Steps:** Sign up at railway.app, connect GitHub, deploy repo.
- **Env Vars:** Add in project variables.
- **Database:** Can host MongoDB too, but use Atlas.
- **Cost:** Free credits, then pay-as-you-go.

### 3. Self-Hosting (Advanced)
- Use Docker: Create `Dockerfile` for containerization.
- Host on AWS EC2, DigitalOcean, etc.
- Run `npm run build && npm start` on server.
- **Not for Beginners:** Requires server management.

**Pro Tip:** Start with Vercel for simplicity.

## Setting Up Environment Variables in Production
- **Why:** Secrets like DB URI shouldn't be in code.
- **In Vercel/Netlify:** Dashboard > Settings > Environment Variables.
- **Example:**
  - Name: `MONGODB_URI`
  - Value: `mongodb+srv://user:pass@cluster.mongodb.net/db?retryWrites=true&w=majority`
- **Redeploy:** After adding, trigger redeploy (auto on Vercel).
- **Security:** Use Atlas Network Access to whitelist platform IPs if possible.

**For Beginners:** Dev uses `.env.local`; prod uses platform secrets. Access via `process.env.MONGODB_URI` in code.

## Testing the Deployed App
1. Visit deployed URL.
2. Test routes: `/`, `/register`, `/login`, `/todos` (after login).
3. Create/view ToDo—check MongoDB Atlas for data.
4. Check logs: In Vercel dashboard > Functions > Logs for API errors.
5. Performance: Use Lighthouse (Chrome DevTools) for audits.
6. Custom Domain: In Vercel > Domains > Add (e.g., yourdomain.com).

**Verify:** No localhost references in code; all fetches relative (e.g., `/api/todos`).

## Code Changes for Production
- **Security:** In `middleware.ts`, enforce HTTPS redirects if needed.
- **Caching:** In API routes, add `export const dynamic = 'force-dynamic';` for real-time.
- **Error Pages:** Customize `not-found.tsx`.
- **Analytics:** Add Vercel Analytics in `next.config.ts`.
- **Build Optimization:** See comments in `globals.css` for purging unused Tailwind.

**Example Update in API Route:**
```typescript
// In route.ts, for prod
if (process.env.NODE_ENV === 'production') {
  // Add rate limiting or logging
}
```

No major changes needed; project is deploy-ready.

## Troubleshooting
- **Build Fails:** Check logs—missing deps? Run `npm install` locally.
- **DB Connection Error:** Verify env var spelling, Atlas whitelist (add 0.0.0.0/0 temporarily).
- **API 404:** Ensure routes in `app/api/`; Vercel detects them.
- **Slow Load:** Optimize images; use Next.js Image component.
- **CORS Issues:** Not needed for same-origin; if API called externally, add headers.
- **Free Tier Limits:** Vercel: 100GB bandwidth/month; monitor usage.
- **Rollback:** In Vercel, deploy previous commit.

Search "Vercel [error]" or check docs.

## Tips for Beginners
- **Git Workflow:** Branch for features: `git checkout -b deploy-fix`, merge to main.
- **Domains:** Free subdomain first, then buy custom (e.g., Namecheap).
- **Monitoring:** Use Vercel Speed Insights for perf.
- **Costs:** Start free; scale as needed (Atlas free for <512MB).
- **CI/CD:** Git push = auto-deploy; no manual uploads.
- **Backup:** Export MongoDB data regularly via Atlas.
- **Extensions:** VS Code "Vercel" extension for CLI deploys.

**Pro Tip:** Use preview deploys (Vercel branches) to test changes before main.

## Advanced Notes
- **Serverless Limits:** API routes have 10s timeout; for long tasks, use queues.
- **Scaling:** Vercel auto-scales; add Redis for sessions if multi-region.
- **Custom Server:** For WebSockets, use a VPS (not serverless).
- **SEO:** Next.js handles; add metadata in layouts.
- **Security:** Scan deps with `npm audit`; use Vercel Firewall.
- **Limitations:** Basic auth; upgrade to NextAuth for prod.

## Next Steps
- Customize domain and add analytics.
- Extend app: Add more features like user profiles.
- Learn: Read [Next.js Deployment Docs](https://nextjs.org/docs/app/building-your-application/deploying).
- Share: Invite friends to test your deployed ToDo app!

Refer to [Resources in README.md](../README.md#resources) for more.

Your app is now live! 🌐