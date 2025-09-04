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
  
  const { messages } = req.body;
  const lastMessage = messages && messages.length > 0 ? messages[messages.length - 1] : null;
  
  // Simple response based on last message
  let reply = "Hello! I'm ODIADEV's voice assistant. How can I help you today?";
  
  if (lastMessage && lastMessage.content) {
    const content = lastMessage.content.toLowerCase();
    if (content.includes('hello') || content.includes('hi')) {
      reply = "Hello! Welcome to ODIADEV. I'm here to help you with voice AI solutions.";
    } else if (content.includes('voice') || content.includes('ai')) {
      reply = "Great! ODIADEV specializes in voice AI agents for WhatsApp, Telegram, and web platforms.";
    } else if (content.includes('demo') || content.includes('test')) {
      reply = "I'd be happy to help you test our voice capabilities. Try speaking into the microphone!";
    } else {
      reply = `I understand you're asking about "${lastMessage.content}". Let me help you with that.`;
    }
  }
  
  res.json({
    reply: reply
  });
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

// Mock STT API
app.post('/api/stt', (req, res) => {
  console.log('STT API called:', req.body)
  
  const { audioBase64, mimeType } = req.body
  
  // Mock transcription response
  const mockTranscription = "Hello, this is a mock transcription from the development server"
  
  res.json({
    text: mockTranscription
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
