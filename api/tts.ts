import type { VercelRequest, VercelResponse } from '@vercel/node'

const ODIADEV_TTS_URL = 'http://13.247.221.39'
const ODIADEV_TTS_KEY = process.env.ODIADEV_TTS_KEY || ''

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
    const { text, voice_id = 'naija_female_warm', format = 'mp3' } = req.body

    if (!text) {
      return res.status(400).json({ error: 'Text is required' })
    }

    if (!ODIADEV_TTS_KEY) {
      return res.status(500).json({ error: 'TTS API key not configured' })
    }

    // Call ODIADEV TTS API
    const ttsResponse = await fetch(`${ODIADEV_TTS_URL}/v1/tts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ODIADEV_TTS_KEY,
      },
      body: JSON.stringify({
        text,
        voice_id,
        format
      })
    })

    if (!ttsResponse.ok) {
      const errorText = await ttsResponse.text()
      console.error('ODIADEV TTS Error:', errorText)
      return res.status(502).json({ 
        error: 'TTS service unavailable',
        details: errorText
      })
    }

    // Get the audio data
    const audioBuffer = await ttsResponse.arrayBuffer()
    const base64Audio = Buffer.from(audioBuffer).toString('base64')
    
    // Return as data URL
    const audioUrl = `data:audio/${format};base64,${base64Audio}`

    return res.status(200).json({
      audioUrl,
      format,
      voice_id,
      text: text.substring(0, 100) + (text.length > 100 ? '...' : '')
    })

  } catch (error) {
    console.error('TTS Handler Error:', error)
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}