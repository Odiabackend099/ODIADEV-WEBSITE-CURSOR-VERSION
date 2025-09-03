import { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { message, sessionId, voiceId } = req.body as { message: string; sessionId?: string; voiceId?: string }
    if (!message) return res.status(400).json({ error: 'Missing required field: message' })

    // TODO: replace with real LLM call to your Brain on Render if desired.
    const canned = [
      "Hello! I'm ODIADEV's assistant. Ask me about WhatsApp, Telegram, or Web voice agents.",
      "We build low-latency voice AI with Nigerian and global voice options.",
      "Want pricing or a quick demo? I can help you start an intake.",
      "We use Vercel + Render + Supabase + n8n for reliability."
    ]
    const text = canned[Math.floor(Math.random() * canned.length)]

    // If a voiceId is provided, synthesize speech via ODIADEV TTS and return base64 (client can play via <audio src='data:audio/mpeg;base64,...'>)
    let audioBase64: string | null = null
    if (voiceId) {
      const ttsUrl = process.env.ODIADEV_TTS_URL
      const apiKey = process.env.ODIADEV_TTS_API_KEY
      if (!ttsUrl || !apiKey) {
        console.warn('TTS env missing, skipping audio')
      } else {
        const ttsResp = await fetch(`${ttsUrl}/v1/tts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({ text, voice_id: voiceId, format: 'mp3' })
        })
        if (ttsResp.ok) {
          const buf = Buffer.from(await ttsResp.arrayBuffer())
          audioBase64 = buf.toString('base64')
        } else {
          console.error('TTS API failed', await ttsResp.text())
        }
      }
    }

    res.status(200).json({ message: text, audioUrl: audioBase64 ? `data:audio/mpeg;base64,${audioBase64}` : null, sessionId: sessionId || null })
  } catch (err) {
    console.error('Chat Error:', err)
    res.status(500).json({ error: 'Failed to process chat message' })
  }
}
