# Environment Variables Setup

## What are Environment Variables?

Environment variables are configuration values stored outside your code. They're used for:
- **Security**: Keep secrets (API keys, passwords) out of your code
- **Configuration**: Different settings for development vs production
- **Flexibility**: Change settings without editing code

## NEXT_PUBLIC_SITE_URL Explained

`NEXT_PUBLIC_SITE_URL` is the full URL of your website (e.g., `https://www.nestfinder.co.uk`).

### Why It's Needed

This variable is used in several places for SEO:

1. **Structured Data (JSON-LD)**: Tells search engines your website URL
2. **Canonical URLs**: Prevents duplicate content issues
3. **Open Graph Tags**: For social media sharing
4. **Sitemap**: Generates correct URLs in your sitemap

### Current Status

Your code already has a **fallback value** (`https://www.nestfinder.co.uk`), so it will work even without setting the variable. However, setting it explicitly is better because:

- ✅ You can easily change it for different environments (dev/staging/production)
- ✅ It's clearer what your actual domain is
- ✅ Follows best practices

---

## How to Set It Up

### Option 1: Local Development (Create `.env.local`)

1. **Create a file** called `.env.local` in your project root (same folder as `package.json`)

2. **Add this line**:
   ```
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```
   (For local development, use `http://localhost:3000`)

3. **Restart your dev server**:
   ```bash
   npm run dev
   ```

### Option 2: Production (Vercel/Other Hosting)

#### If using Vercel:

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add a new variable:
   - **Name**: `NEXT_PUBLIC_SITE_URL`
   - **Value**: `https://your-actual-domain.com` (your real domain)
   - **Environment**: Production (and Preview if you want)
4. **Redeploy** your site

#### If using other hosting:

Check your hosting provider's documentation for how to set environment variables.

---

## File Structure

Your project should have:

```
NestFinderWebApp/
├── .env.local          # Local development (gitignored - don't commit this)
├── .env.example        # Template (safe to commit)
├── package.json
└── ...
```

**Important**: 
- `.env.local` is in `.gitignore` (don't commit secrets!)
- `.env.example` is safe to commit (shows what variables are needed)

---

## What Value Should I Use?

### Local Development:
```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Production:
```
NEXT_PUBLIC_SITE_URL=https://www.nestfinder.co.uk
```
(Use www. version to match your Vercel redirects)

---

## Quick Start

**For now, you don't need to do anything!** 

Your code already works with the fallback value. But when you're ready to deploy:

1. Create `.env.local` for local development
2. Set the variable in your hosting platform (Vercel, etc.) for production
3. Use your actual domain URL

---

## Need Help?

- **Next.js Docs**: https://nextjs.org/docs/basic-features/environment-variables
- **Vercel Docs**: https://vercel.com/docs/concepts/projects/environment-variables

