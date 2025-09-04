import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = 3001

// Middleware
app.use(cors())
app.use(express.json())

// Mock API endpoints for development
app.post('/api/chat', (req, res) => {
  console.log('Chat API called:', req.body)
  
  // Mock response
  const responses = [
    "Hello! I'm ODIADEV's voice assistant. How can I help you today?",
    "Welcome to ODIADEV! I can help you with WhatsApp, Telegram, or Web voice agents.",
    "Great to meet you! What kind of voice AI solution are you looking for?",
    "I'm here to help you build amazing voice experiences. What's your use case?"
  ]
  
  const randomResponse = responses[Math.floor(Math.random() * responses.length)]
  
  res.json({
    message: randomResponse,
    audioUrl: `data:audio/mpeg;base64,${Buffer.from('mock-audio-data').toString('base64')}`
  })
})

app.post('/api/events', (req, res) => {
  console.log('Events API called:', req.body)
  
  // Mock successful response
  res.json({
    ok: true,
    message: 'Event processed successfully'
  })
})

app.post('/api/tts', (req, res) => {
  console.log('TTS API called:', req.body)
  
  const { text, voice_id } = req.body
  
  // Mock audio response - simulate real TTS
  const mockAudio = Buffer.from(`Mock audio for: ${text} with voice: ${voice_id}`).toString('base64')
  
  res.json({
    audioUrl: `data:audio/mpeg;base64,${mockAudio}`
  })
})

app.get('/healthz', (req, res) => {
  res.json({ ok: true, service: 'odiadev-dev-server' })
})

app.get('/api/voices', (req, res) => {
  res.json({
    voices: [
      { id: 'naija_female_warm', name: 'Amina', accent: 'nigerian', gender: 'female' },
      { id: 'naija_male_clear', name: 'Chinedu', accent: 'nigerian', gender: 'male' },
      { id: 'us_female_crisp', name: 'Sarah', accent: 'us', gender: 'female' },
      { id: 'us_male_calm', name: 'David', accent: 'us', gender: 'male' }
    ]
  })
})

app.listen(PORT, () => {
  console.log(`🚀 Development API server running on http://localhost:${PORT}`)
  console.log(`📡 API endpoints available:`)
  console.log(`   POST /api/chat`)
  console.log(`   POST /api/events`)
  console.log(`   POST /api/tts`)
  console.log(`   GET /healthz`)
  console.log(`   GET /api/voices`)
})
