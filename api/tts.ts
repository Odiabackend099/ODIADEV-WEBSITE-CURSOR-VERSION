import type { VercelRequest, VercelResponse } from '@vercel/node'

// ODIADEV TTS API Configuration
const TTS_API_URL = 'http://13.247.221.39/v1/tts'
const TTS_API_KEY = process.env.ODIADEV_TTS_KEY || ''
const DEFAULT_VOICE_ID = 'naija_female_warm'
const FORMAT = 'mp3'

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 3 // 3 requests per minute per IP
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

// CORS origins allowed
const ALLOWED_ORIGINS = [
  'https://odia.dev',
  'https://*.odia.dev',
  'http://localhost:5173',
  'http://localhost:3000'
]

function isAllowedOrigin(origin: string): boolean {
  return ALLOWED_ORIGINS.some(allowed => {
    if (allowed.includes('*')) {
      const pattern = allowed.replace('*', '.*')
      return new RegExp(pattern).test(origin)
    }
    return allowed === origin
  })
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const clientData = rateLimitMap.get(ip)
  
  if (!clientData || now > clientData.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }
  
  if (clientData.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false
  }
  
  clientData.count++
  return true
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Get client IP for rate limiting
  const clientIP = req.headers['x-forwarded-for'] as string || 
                   req.headers['x-real-ip'] as string || 
                   req.connection?.remoteAddress || 
                   'unknown'

  // Set CORS headers
  const origin = req.headers.origin || ''
  if (isAllowedOrigin(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  } else {
    res.setHeader('Access-Control-Allow-Origin', 'https://odia.dev')
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Access-Control-Max-Age', '86400')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Rate limiting check
  if (!checkRateLimit(clientIP)) {
    return res.status(429).json({ 
      error: 'Rate limit exceeded',
      message: 'Too many requests. Please try again later.',
      retryAfter: RATE_LIMIT_WINDOW / 1000
    })
  }

  try {
    const { text, voice_id = DEFAULT_VOICE_ID, format = FORMAT } = req.body

    // Input validation
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required and must be a string' })
    }

    if (text.length > 1000) {
      return res.status(400).json({ error: 'Text too long. Maximum 1000 characters allowed.' })
    }

    if (!TTS_API_KEY) {
      console.error('ODIADEV_TTS_KEY environment variable not set')
      return res.status(500).json({ error: 'TTS service configuration error' })
    }

    // Validate voice_id
    const validVoices = ['naija_female_warm', 'naija_male_strong']
    const selectedVoice = validVoices.includes(voice_id) ? voice_id : DEFAULT_VOICE_ID

    // Call ODIADEV TTS API with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    try {
      const ttsResponse = await fetch(TTS_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': TTS_API_KEY,
        },
        body: JSON.stringify({
          text: text.trim(),
          voice_id: selectedVoice,
          format: format.toLowerCase()
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!ttsResponse.ok) {
        const errorText = await ttsResponse.text()
        console.error('ODIADEV TTS API Error:', ttsResponse.status, errorText)
        
        if (ttsResponse.status === 401) {
          return res.status(500).json({ 
            error: 'TTS service authentication failed',
            message: 'Service configuration error'
          })
        }
        
        if (ttsResponse.status === 429) {
          return res.status(429).json({ 
            error: 'TTS service rate limited',
            message: 'TTS service is temporarily unavailable. Please try again later.'
          })
        }
        
        return res.status(502).json({ 
          error: 'TTS service unavailable',
          message: 'The text-to-speech service is temporarily down. Please try again later.'
        })
      }

      // Get the audio data
      const audioBuffer = await ttsResponse.arrayBuffer()
      
      if (audioBuffer.byteLength === 0) {
        return res.status(502).json({ 
          error: 'Empty audio response',
          message: 'The TTS service returned empty audio data'
        })
      }

      const base64Audio = Buffer.from(audioBuffer).toString('base64')
      
      // Return as data URL for immediate playback
      const audioUrl = `data:audio/${format};base64,${base64Audio}`

      return res.status(200).json({
        audioUrl,
        format: format.toLowerCase(),
        voice_id: selectedVoice,
        text: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
        size: audioBuffer.byteLength,
        timestamp: new Date().toISOString()
      })

    } catch (fetchError) {
      clearTimeout(timeoutId)
      
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        return res.status(504).json({ 
          error: 'TTS service timeout',
          message: 'The TTS service took too long to respond. Please try again.'
        })
      }
      
      throw fetchError
    }

  } catch (error) {
    console.error('TTS Handler Error:', error)
    return res.status(500).json({ 
      error: 'Internal server error',
      message: 'An unexpected error occurred. Please try again later.'
    })
  }
}