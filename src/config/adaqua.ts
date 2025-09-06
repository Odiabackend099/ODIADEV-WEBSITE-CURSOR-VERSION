// Adaqua AI Configuration
export const ADAQUA_CONFIG = {
  // ODIADEV TTS Configuration
  TTS_URL: 'http://13.247.221.39',
  DEFAULT_VOICE_ID: 'naija_female_warm',
  
  // N8N Webhook
  N8N_WEBHOOK_URL: 'https://austyneguale.app.n8n.cloud/webhook/your-webhook-id',
  
  // UI Configuration
  ASSISTANT_NAME: 'Agent ODIADEV',
  WELCOME_MESSAGE: "Hello! I'm Agent ODIADEV, your AI assistant. How can I help you today?",
  
  // Voice Configuration
  VOICE_ENABLED: true,
  AUTO_PLAY: true,
  
  // Mobile Optimization
  MOBILE_OPTIMIZED: true,
  NIGERIAN_NETWORKS: true,
  
  // CORS Origins
  ALLOWED_ORIGINS: [
    'https://odia.dev',
    'http://localhost:5173',
    'http://localhost:3000'
  ]
}

export default ADAQUA_CONFIG
