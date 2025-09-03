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