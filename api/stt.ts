import type { VercelRequest, VercelResponse } from '@vercel/node'

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
    const { audioBase64, mimeType = 'audio/webm' } = req.body

    if (!audioBase64) {
      return res.status(400).json({ error: 'Audio data is required' })
    }

    // Convert base64 to buffer
    const audioBuffer = Buffer.from(audioBase64, 'base64')
    
    // For now, we'll use a mock transcription
    // In production, you would integrate with a real STT service like OpenAI Whisper
    const mockTranscriptions = [
      "Hello, how are you today?",
      "I need help with my account",
      "Can you tell me about your services?",
      "What are your business hours?",
      "I want to speak to a human agent",
      "Thank you for your help",
      "Goodbye",
      "I don't understand",
      "Can you repeat that?",
      "Yes, that's correct"
    ]

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Return a random mock transcription
    const randomTranscription = mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)]

    return res.status(200).json({
      text: randomTranscription,
      confidence: 0.95,
      language: 'en',
      duration: audioBuffer.length / 1000 // Mock duration
    })

  } catch (error) {
    console.error('STT Handler Error:', error)
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}