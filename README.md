# HassanJamal

Personal portfolio of **Hassan Jamal** — Full Stack Engineer (Laravel · React · Next.js · Node.js · AI).

## Structure

```
index.html            Main portfolio (served at /)
asset/                CSS, JS, fonts, icons, images, video
projects/             Project index (served at /projects)
api/contact.js        Vercel serverless function for the contact form (POST /api/contact)
vercel.json           Caching & security headers, clean URLs
GitHub-Profile-README/  GitHub profile README (not deployed)
```

## Deploy on Vercel

1. Import this repo at <https://vercel.com/new> — Framework Preset: **Other**, no build command, leave Output Directory empty.
2. In **Settings → Environment Variables**, add the values from `.env.example`
   (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`, `MAIL_FROM_NAME`, `MAIL_TO`).
3. Deploy. Every push to `main` redeploys automatically.

## Local development

```bash
npm install
npx vercel dev
```
