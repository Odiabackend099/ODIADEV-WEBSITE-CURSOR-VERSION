// Development configuration for ODIADEV
// This file provides fallback values for development environment

export const DEV_CONFIG = {
  // Webhook Security (Development)
  EVENT_INGEST_KEY: 'dev-key-12345',
  EVENT_INGEST_SECRET: 'dev-secret-67890',
  
  // API Endpoints (Development)
  TTS_API_URL: '/api/tts',
  CHAT_API_URL: '/api/chat',
  EVENTS_API_URL: '/api/events',
  
  // Feature Flags
  ENABLE_VOICE: true,
  ENABLE_MIC: true,
  DEBUG_MODE: true,
  
  // Fallback responses for development
  FALLBACK_RESPONSES: [
    "Hello! I'm ODIADEV's assistant. Ask me about WhatsApp, Telegram, or Web voice agents.",
    "We build low-latency voice AI with Nigerian and global voice options.",
    "Want pricing or a quick demo? I can help you start an intake.",
    "We use Vercel + Render + Supabase + n8n for reliability."
  ]
}

// Utility function to get environment variables with fallbacks
export const getEnvVar = (key: string, fallback?: string): string => {
  return process.env[`REACT_APP_${key}`] || fallback || ''
}

// Utility function to generate security headers for development
export const generateDevSecurityHeaders = (body: any) => {
  const timestamp = Math.floor(Date.now() / 1000).toString()
  const key = DEV_CONFIG.EVENT_INGEST_KEY
  const secret = DEV_CONFIG.EVENT_INGEST_SECRET
  
  // Simple hash for development (not cryptographically secure)
  const payload = `${timestamp}.${JSON.stringify(body)}`
  const signature = `sha256=${btoa(payload + secret).slice(0, 64)}`
  
  return {
    'x-odiadev-key': key,
    'x-odiadev-ts': timestamp,
    'x-odiadev-signature': signature
  }
}

// Utility function to get random fallback response
export const getRandomFallbackResponse = (): string => {
  const responses = DEV_CONFIG.FALLBACK_RESPONSES
  return responses[Math.floor(Math.random() * responses.length)]
}
