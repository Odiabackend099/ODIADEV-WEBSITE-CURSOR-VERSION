import { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const eventData = req.body

    if (!eventData.type) {
      return res.status(400).json({ error: 'Missing required field: type' })
    }

    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL

    if (!n8nWebhookUrl) {
      console.warn('N8N_WEBHOOK_URL not configured, skipping event forwarding')
      return res.json({ ok: true, message: 'Event logged locally (n8n not configured)' })
    }

    // Forward event to n8n webhook
    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    })

    if (!n8nResponse.ok) {
      throw new Error(`N8N webhook error: ${n8nResponse.status}`)
    }

    res.json({ ok: true })

  } catch (error) {
    console.error('Events Error:', error)
    res.status(500).json({ error: 'Failed to process event' })
  }
}
