import type { VercelRequest, VercelResponse } from '@vercel/node'

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'https://austyneguale.app.n8n.cloud/webhook/your-webhook-id'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { message, sessionId } = req.body

    if (!message) {
      return res.status(400).json({ error: 'Message is required' })
    }

    // Prepare payload for n8n webhook
    const payload = {
      message,
      sessionId: sessionId || `adaqua-${Date.now()}`,
      timestamp: new Date().toISOString(),
      source: 'adaqua-chat-widget',
      userAgent: req.headers['user-agent'] || 'Unknown'
    }

    // Call n8n webhook
    const webhookResponse = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    })

    if (!webhookResponse.ok) {
      console.error('N8N Webhook Error:', webhookResponse.status, await webhookResponse.text())
      
      // Fallback response if webhook fails
      const fallbackResponses = [
        "I'm Agent ODIADEV, your AI assistant. How can I help you today?",
        "Hello! I'm here to assist you. What would you like to know?",
        "Thanks for reaching out! I'm ready to help with any questions you have.",
        "Welcome! I'm your AI assistant. How may I be of service?",
        "Hi there! I'm here to provide you with information and assistance."
      ]
      
      const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]
      
      return res.status(200).json({
        reply: randomResponse,
        source: 'fallback',
        timestamp: new Date().toISOString()
      })
    }

    const webhookData = await webhookResponse.json()
    
    // Extract response from webhook
    const reply = webhookData.reply || 
                  webhookData.message || 
                  webhookData.response || 
                  webhookData.text ||
                  "I received your message and I'm processing it. Please give me a moment."

    return res.status(200).json({
      reply,
      source: 'n8n-webhook',
      timestamp: new Date().toISOString(),
      sessionId: payload.sessionId
    })

  } catch (error) {
    console.error('Chat Handler Error:', error)
    
    // Fallback response on error
    return res.status(200).json({
      reply: "I'm experiencing some technical difficulties right now. Please try again in a moment, or contact support if the issue persists.",
      source: 'error-fallback',
      timestamp: new Date().toISOString()
    })
  }
}