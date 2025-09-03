import { withCors } from './_lib/cors'
import { VercelRequest, VercelResponse } from '@vercel/node'

async function _handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const { name, email, phone, message, source, session_id } = req.body || {}
    if (!name || !email) return res.status(400).json({ error: 'Missing required fields: name, email' })

    const brainUrl = process.env.BRAIN_BASE_URL
    const brainKey = process.env.BRAIN_API_KEY

    if (!brainUrl) {
      // Safe default scoring
      const score = Math.min(100, (message?.length || 10) + (source === 'website' ? 20 : 0))
      return res.json({ qualified: score >= 40, score, notes: 'Default heuristic (no Brain URL configured)' })
    }

    const r = await fetch(`${brainUrl}/api/qualify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(brainKey ? { 'Authorization': `Bearer ${brainKey}` } : {})
      },
      body: JSON.stringify({ name, email, phone, message, source, session_id })
    })
    if (!r.ok) {
      const t = await r.text()
      throw new Error(`Brain qualify failed: ${r.status} ${t}`)
    }
    const data = await r.json()
    res.json(data)
  } catch (e) {
    console.error('Qualify error:', e)
    res.status(500).json({ error: 'Failed to qualify lead' })
  }
}

export default withCors(_handler as any)
