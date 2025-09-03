# ODIADEV Deploy Guide (Vercel + Render + n8n + Supabase)

## 1) Prepare repository
- Ensure `.gitignore` excludes `node_modules` and `dist`.
- Commit source only.

## 2) Vercel (Frontend + API)
- Framework: Vite (React + TS)
- Build Command: `npm run build`
- Output Directory: `dist`
- Functions: `/api/**/*.ts` (Node.js 18)

### Environment Variables
- N8N_WEBHOOK_URL
- ODIADEV_TTS_URL
- ODIADEV_TTS_API_KEY
- BRAIN_BASE_URL
- BRAIN_API_KEY
- SUPABASE_URL
- SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY

## 3) Render (Brain)
- Root: `render-brain/`
- Start Command: `npm start`
- Instance type: free or starter
- Health Check: `/`

## 4) Supabase
- Run SQL in `supabase/migrations/001_init.sql`.

## 5) n8n
- Import the provided workflow.
- Set env vars to match Supabase and Render.

## 6) Local Dev
- `npm i`
- `npm run dev` (frontend only). For API routes locally, use `vercel dev`.
