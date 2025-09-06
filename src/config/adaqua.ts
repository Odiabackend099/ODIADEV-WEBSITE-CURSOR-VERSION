// ODIADEV Conversational Assistant Configuration
// Following Universal Build Prompt Template

export const ODIADEV_CONFIG = {
  // ODIADEV TTS API Configuration
  TTS_API_URL: 'http://13.247.221.39/v1/tts',
  TTS_API_KEY: 'ODIADEV_TTS_KEY', // Store securely as environment variable
  DEFAULT_VOICE_ID: 'naija_female_warm',
  FORMAT: 'mp3',
  
  // Available Voice Options
  VOICE_OPTIONS: [
    { id: 'naija_female_warm', name: 'Naija Female (Warm)', gender: 'female' },
    { id: 'naija_male_strong', name: 'Naija Male (Strong)', gender: 'male' }
  ],
  
  // AI Chat Configuration
  N8N_WEBHOOK_URL: 'https://austyneguale.app.n8n.cloud/webhook/your-webhook-id',
  
  // UI Configuration
  ASSISTANT_NAME: 'Agent ODIADEV',
  WELCOME_MESSAGE: "Hello! I'm Agent ODIADEV, your AI assistant. How can I help you today?",
  
  // Voice Features
  VOICE_ENABLED: true,
  AUTO_PLAY: true,
  VOICE_CONSENT_REQUIRED: true,
  
  // Mobile-First Configuration
  MOBILE_OPTIMIZED: true,
  NIGERIAN_NETWORKS: true,
  RESPONSIVE_BREAKPOINTS: {
    sm: '640px',
    md: '768px',
    lg: '1024px'
  },
  
  // Offline Support
  OFFLINE_QUEUE_ENABLED: true,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAYS: [250, 500, 1000], // Exponential backoff in ms
  
  // Security & CORS
  ALLOWED_ORIGINS: [
    'https://odia.dev',
    'https://*.odia.dev',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  
  // Rate Limiting
  RATE_LIMIT: {
    REQUESTS_PER_MINUTE: 3,
    WINDOW_MS: 60000
  },
  
  // Performance
  AUDIO_CACHE_ENABLED: true,
  MESSAGE_HISTORY_LIMIT: 50,
  
  // Nigerian Network Optimization
  CONNECTION_TIMEOUT: 10000, // 10 seconds
  RETRY_ON_TIMEOUT: true,
  FALLBACK_RESPONSES: [
    "I'm experiencing some network issues. Please try again.",
    "Connection seems slow. Let me try that again.",
    "Network hiccup detected. Retrying..."
  ]
}

export default ODIADEV_CONFIG

