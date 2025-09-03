import { withCors } from './_lib/cors'
import { VercelRequest, VercelResponse } from '@vercel/node'

async function _handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { text, voice_id } = req.body

    if (!text || !voice_id) {
      return res.status(400).json({ error: 'Missing required fields: text, voice_id' })
    }

    const ttsUrl = process.env.ODIADEV_TTS_URL
    const ttsApiKey = process.env.ODIADEV_TTS_API_KEY

    if (!ttsUrl || !ttsApiKey) {
      return res.status(500).json({ error: 'TTS service not configured' })
    }

    // Call ODIADEV TTS API
    const ttsResponse = await fetch(`${ttsUrl}/v1/tts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ttsApiKey}`,
      },
      body: JSON.stringify({
        text,
        voice_id,
        format: 'mp3',
      }),
    })

    if (!ttsResponse.ok) {
      throw new Error(`TTS API error: ${ttsResponse.status}`)
    }

    const audioBuffer = await ttsResponse.arrayBuffer()

    // Return audio as base64 or stream
    res.setHeader('Content-Type', 'audio/mpeg')
    res.setHeader('Content-Length', audioBuffer.byteLength)
    res.send(Buffer.from(audioBuffer))

  } catch (error) {
    console.error('TTS Error:', error)
    res.status(500).json({ error: 'Failed to generate speech' })
  }
}

export default withCors(_handler as any)
