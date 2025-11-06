# Arctan — Gmail Triage (Next.js + NextAuth + Tailwind v3)

Frictionless "Your turn / Their turn" inbox for leads. Sign in with Google; no user-side API keys.

## Local Dev (quick)
```bash
cp .env.example .env.local
# fill GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET / NEXTAUTH_SECRET
npm install
npm run dev
# http://localhost:3000
```

## Environment Variables
- `GOOGLE_CLIENT_ID` — from Google Cloud (Web app)
- `GOOGLE_CLIENT_SECRET` — from Google Cloud (Web app)
- `NEXTAUTH_SECRET` — random string (e.g. `openssl rand -base64 32`)
- `NEXTAUTH_URL` — e.g. `http://localhost:3000` (dev) or your live domain
- `THREAD_LIMIT` — optional (default 50)
- `VIP_DOMAINS` — optional comma list

## Deploy via GitHub → Hostinger (Node.js app)
1. **Make the repo private** and push this folder.
2. In Hostinger, create a **Node.js app** (not static site). Set:
   - **Build command:** `npm run build`
   - **Start command:** `npm run start`
   - **Node version:** 18+
3. Add **Environment Variables** in Hostinger:
   - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
   - `NEXTAUTH_SECRET` (random string)
   - `NEXTAUTH_URL=https://yourdomain.com`
4. In **Google Cloud Console → OAuth client** set:
   - **Authorized origin:** `https://yourdomain.com`
   - **Redirect URI:** `https://yourdomain.com/api/auth/callback/google`
   Enable **Gmail API** in the same project.
5. Deploy. Visit your domain and click **Sign in**.

## Security Notes
- Tokens are **server-side only** (not exposed to the browser).
- Keep minimal scopes (`gmail.readonly`, `gmail.send`).
- Do **not** commit `.env*` or `config/oauth.json` (already in `.gitignore`).

## Roadmap
- Snooze/Archive with Gmail labels
- "Deck view" triage
- Team queue & assignments
- AI summaries / suggested replies

# Arctan.io
