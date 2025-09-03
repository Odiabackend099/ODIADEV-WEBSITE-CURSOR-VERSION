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