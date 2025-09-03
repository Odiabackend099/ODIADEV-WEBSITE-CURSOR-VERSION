param(
  [string]$Root = "."
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# Resolve project root
$Root = (Resolve-Path -LiteralPath $Root).Path

Write-Host "==> Project root: $Root"

function Write-File($Path, $Content) {
  $dir = Split-Path -Parent $Path
  if (!(Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
  $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($Path, $Content, $utf8NoBom)
  Write-Host "   wrote $Path"
}

# 1) .gitignore
$gitignore = @"
# Dependencies and build
node_modules/
dist/
.vscode/
.vercel/
.DS_Store

# Env
.env*
!.env.example

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
"@
Write-File (Join-Path $Root ".gitignore") $gitignore

# 2) tsconfig.json (baseline)
$tsconfig = @"
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "strict": true,
    "baseUrl": ".",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "types": ["vite/client"]
  },
  "include": ["src", "api"],
  "exclude": ["node_modules", "dist"]
}
"@
if (!(Test-Path (Join-Path $Root "tsconfig.json"))) {
  Write-File (Join-Path $Root "tsconfig.json") $tsconfig
}

# 3) vercel.json with security headers + CORS defaults for /api
$vercel = @"
{
  "version": 2,
  "framework": "vite",
  "functions": {
    "api/**/*.ts": {
      "runtime": "nodejs20.x",
      "memory": 512
    }
  },
  "routes": [
    { "src": "^/api/(.*)$", "dest": "/api/`$1.ts" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "Permissions-Policy", "value": "microphone=(), geolocation=()" }
      ]
    }
  ]
}
"@
Write-File (Join-Path $Root "vercel.json") $vercel

# 4) .env.example
$envExample = @"
# === Public-facing brand ===
PUBLIC_BRAND_NAME=Adaqua AI
PUBLIC_SITE_URL=https://adaquaai.odia.dev

# === Server-side only ===
ODIADEV_TTS_URL=https://tts-api.odia.dev
ODIADEV_TTS_API_KEY=__set_in_vercel_env__
DEFAULT_VOICE_ID=naija_female_warm

BRAIN_BASE_URL=https://brain.api.example
BRAIN_API_KEY=__set_in_vercel_env__

N8N_WEBHOOK_URL=https://austyneguale.app.n8n.cloud/webhook/7640502f-2bfe-4c60-8a10-1a16149b3942

# Allowed origins for browser requests (comma-separated)
ODIADEV_ALLOWED_ORIGINS=https://adaquaai.odia.dev,https://odia.dev,http://localhost:5173
EVENT_SIGNING_SECRET=__rotate_me__
"@
if (!(Test-Path (Join-Path $Root ".env.example"))) {
  Write-File (Join-Path $Root ".env.example") $envExample
}

# 5) Create CORS helper for API
$corsTs = @"
import type { VercelRequest, VercelResponse } from '@vercel/node'

const readAllowed = (): string[] => {
  const raw = process.env.ODIADEV_ALLOWED_ORIGINS || ''
  return raw.split(',').map(s => s.trim()).filter(Boolean)
}

export function setCors(res: VercelResponse, origin: string | undefined) {
  const allowed = readAllowed()
  const allow = origin && allowed.includes(origin) ? origin : allowed[0] || '*'
  res.setHeader('Access-Control-Allow-Origin', allow)
  res.setHeader('Vary', 'Origin')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,x-odiadev-key,x-odiadev-ts,x-odiadev-signature')
  res.setHeader('Access-Control-Max-Age', '86400')
}

export function withCors(handler: (req: VercelRequest, res: VercelResponse) => Promise<any>) {
  return async (req: VercelRequest, res: VercelResponse) => {
    const origin = (req.headers['origin'] as string|undefined) || undefined
    setCors(res, origin)
    if (req.method === 'OPTIONS') { return res.status(204).end() }
    return handler(req, res)
  }
}
"@
Write-File (Join-Path $Root "api/_lib/cors.ts") $corsTs

# 6) Helper to sign events server-side (replace client-side dev signatures)
$signTs = @"
import crypto from 'crypto'

export function signPayload(payload: string) {
  const secret = process.env.EVENT_SIGNING_SECRET || ''
  const ts = Math.floor(Date.now() / 1000).toString()
  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(ts + '.' + payload)
  const sig = hmac.digest('hex')
  return { ts, sig }
}

export function verifyWindow(ts: string, windowSec = 300) {
  const now = Math.floor(Date.now()/1000)
  return Math.abs(now - parseInt(ts,10)) <= windowSec
}
"@
Write-File (Join-Path $Root "api/_lib/sign.ts") $signTs

# 7) Patch API handlers to wrap with CORS automatically
$apiToPatch = @(
  "api/chat.ts",
  "api/tts.ts",
  "api/events.ts",
  "api/brain/qualify.ts",
  "api/brain/summarize.ts"
)

foreach ($rel in $apiToPatch) {
  $full = Join-Path $Root $rel
  if (!(Test-Path $full)) { continue }

  $code = Get-Content -Raw -LiteralPath $full

  if ($code -notmatch "withCors") {
    # add import
    if ($code -notmatch "from './_lib/cors'") {
      $code = "import { withCors } from './_lib/cors'" + [Environment]::NewLine + $code
    }
    # wrap default export
    if ($code -match "export default async function handler\(") {
      $code = $code -replace "export default async function handler\(", "async function _handler("
      $code = $code + [Environment]::NewLine + "export default withCors(_handler as any)" + [Environment]::NewLine
    } elseif ($code -match "export default function handler\(") {
      $code = $code -replace "export default function handler\(", "function _handler("
      $code = $code + [Environment]::NewLine + "export default withCors(_handler as any)" + [Environment]::NewLine
    } elseif ($code -match "export default async \(req, res\) =>") {
      $code = $code -replace "export default async \(req, res\) =>", "const _handler = async (req, res) =>"
      $code = $code + [Environment]::NewLine + "export default withCors(_handler as any)" + [Environment]::NewLine
    }
  }

  Set-Content -LiteralPath $full -Value $code -NoNewline -Encoding utf8
  Write-Host "   patched $rel"
}

# 8) Sanitize src/config/development.ts (remove hard-coded dev secrets)
$devCfg = Join-Path $Root "src/config/development.ts"
if (Test-Path $devCfg) {
  $txt = Get-Content -Raw -LiteralPath $devCfg
  $txt = $txt -replace "EVENT_INGEST_KEY:\s*'.*?'", "EVENT_INGEST_KEY: ''"
  $txt = $txt -replace "EVENT_INGEST_SECRET:\s*'.*?'", "EVENT_INGEST_SECRET: ''"
  $txt = $txt -replace "ENABLE_MIC:\s*true", "ENABLE_MIC: true"
  Set-Content -LiteralPath $devCfg -Value $txt -NoNewline -Encoding utf8
  Write-Host "   sanitized src/config/development.ts"
}

Write-Host "==> Done. Next steps:"
Write-Host "1) Copy .env.example to .env and fill real secrets."
Write-Host "2) Commit and deploy to Vercel."
