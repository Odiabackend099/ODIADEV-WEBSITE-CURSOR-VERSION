import { withCors } from './_lib/cors'
import { VercelRequest, VercelResponse } from '@vercel/node'

async function _handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const { transcript } = req.body || {}
    if (!transcript) return res.status(400).json({ error: 'Missing required field: transcript' })

    const brainUrl = process.env.BRAIN_BASE_URL
    const brainKey = process.env.BRAIN_API_KEY

    if (!brainUrl) {
      // Fallback: return first 50 words as "summary"
      const words = String(transcript).split(/\s+/).slice(0, 50).join(' ')
      return res.json({ summary: words + (String(transcript).split(/\s+/).length > 50 ? 'â€¦' : ''), topics: [] })
    }

    const r = await fetch(`${brainUrl}/api/summarize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(brainKey ? { 'Authorization': `Bearer ${brainKey}` } : {})
      },
      body: JSON.stringify({ transcript })
    })
    if (!r.ok) {
      const t = await r.text()
      throw new Error(`Brain summarize failed: ${r.status} ${t}`)
    }
    const data = await r.json()
    res.json(data)
  } catch (e) {
    console.error('Summarize error:', e)
    res.status(500).json({ error: 'Failed to summarize' })
  }
}

export default withCors(_handler as any)
