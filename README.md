# 🎤 ODIADEV - Premium Voice AI Platform

> **Production-Ready Voice AI Website with Floating Chat Widget, CRM Dashboard, and Automated Lead Management**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/odiadev-website)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)

A premium website for ODIADEV featuring a floating voice chat widget, CRM dashboard, and automated lead management. Built with React, TypeScript, and deployed on Vercel with backend services on Render and Supabase.

## ✨ Features

### 🎨 Premium Design
- **IEQ-style aesthetic** with deep navy, gold accents, and elegant typography
- **Smooth animations** using GSAP, Framer Motion, and Lenis
- **Responsive design** optimized for all devices
- **Premium typography** with Cormorant Garamond and Inter fonts

### 🎤 Voice Chat Widget
- **Persistent floating widget** that stays across page navigation
- **Multiple voice modes**: Text chat, Mic→STT→Text, Voice-only
- **Avatar selection** with Nigerian and US voice options (Amina, Chinedu, Sarah, David)
- **Auto-play TTS** when voice mode is enabled
- **Session persistence** using localStorage
- **Real-time conversation** with AI responses

### 🔧 Backend Integration
- **Vercel API routes** for TTS, brain services, and events
- **n8n automation** for lead management and alerts
- **Supabase storage** for leads, intake, and conversations
- **Render backend** for AI processing and qualification
- **Security headers** with HMAC signature verification

### 📊 CRM Dashboard
- **Leads management** with qualification scoring
- **Conversation tracking** with transcripts and summaries
- **Analytics dashboard** with conversion rates and metrics
- **Real-time data** with loading states and error handling

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom design tokens
- **Animations**: GSAP + Framer Motion + Lenis smooth scroll
- **State Management**: Zustand with persistence
- **Routing**: React Router v6
- **Backend**: Vercel API routes + Render services
- **Database**: Supabase (PostgreSQL)
- **Automation**: n8n Cloud workflows
- **Deployment**: Vercel (frontend) + Render (backend)

## 📁 Project Structure

```
odiadev/
├── src/
│   ├── components/
│   │   ├── ui/                 # Premium UI components
│   │   ├── layout/             # Navbar, Footer
│   │   └── chat/               # Chat widget components
│   ├── pages/                  # Route pages
│   ├── store/                  # Zustand stores
│   ├── lib/                    # Utilities and API clients
│   └── types/                  # TypeScript definitions
├── api/                        # Vercel API routes
│   ├── tts.ts                  # Text-to-speech proxy
│   ├── brain/                  # Brain service proxies
│   └── events.ts               # n8n event forwarding
└── public/                     # Static assets
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Vercel account (for deployment)
- Supabase project
- n8n Cloud account

### Installation

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd odiadev
   npm install
   ```

2. **Set up environment variables**
   Create `.env.local` file:
   ```env
   # Vercel Environment Variables
   N8N_WEBHOOK_URL=https://your-n8n-instance.app.n8n.cloud/webhook/agent-events
   ODIADEV_TTS_URL=https://tts-api.odia.dev
   ODIADEV_TTS_API_KEY=your_tts_api_key
   BRAIN_BASE_URL=https://your-render-app.onrender.com
   BRAIN_API_KEY=your_brain_api_key
   
   # Supabase
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

3. **Set up Supabase database**
   Run the SQL migrations in `supabase/migrations/`:
   ```sql
   -- Create tables for leads, client_intake, conversations
   -- (See supabase/migrations/ for full schema)
   ```

4. **Configure n8n workflow**
   Import the workflow JSON from the PRD into your n8n instance and configure:
   - SMTP credentials for email alerts
   - Telegram bot token for instant notifications
   - Supabase connection for data storage

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Deploy to Vercel**
   ```bash
   npm run build
   vercel --prod
   ```

## 🎨 Design System

### Color Palette
- **Navy**: `#0C1C3A` (primary)
- **Gold**: `#C8A862` (accent)
- **Mist**: `#E9EEF5` (light)
- **Stone**: `#93A4BE` (muted)

### Typography
- **Headings**: Cormorant Garamond (serif)
- **Body**: Inter (sans-serif)
- **Weights**: 400, 500, 600

### Components
- **Buttons**: Primary (gold), Secondary (outline), Ghost (text)
- **Cards**: Hover effects with subtle shadows
- **Forms**: Focus states with gold accent
- **Navigation**: Smooth underline animations

## 🔧 API Endpoints

### Frontend API Routes (`/api/`)

#### `POST /api/tts`
Generate speech from text using ODIADEV TTS service.
```json
{
  "text": "Hello, welcome to ODIADEV",
  "voice_id": "naija_female_warm"
}
```

#### `POST /api/brain/qualify`
Qualify leads using AI brain service.
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+234800000000",
  "message": "Interested in voice AI",
  "source": "website",
  "session_id": "uuid"
}
```

#### `POST /api/events`
Forward events to n8n webhook for automation.
```json
{
  "type": "lead|intake|conversation_end|error",
  "session_id": "uuid",
  // ... additional payload data
}
```

## 📊 Database Schema

### Tables

#### `leads`
- Lead capture from website forms
- Qualification scoring and notes
- Source tracking and session linking

#### `client_intake`
- Full business onboarding data
- Channel preferences and use cases
- Voice preferences and contact info

#### `conversations`
- Chat session transcripts
- AI-generated summaries
- Final replies and timestamps

## 🤖 n8n Automation

The n8n workflow handles:
- **Lead qualification** with AI scoring
- **Email alerts** for qualified leads
- **Telegram notifications** for urgent items
- **Data storage** in Supabase
- **Error handling** with failure notifications

## 🧪 Testing

### Acceptance Tests
1. ✅ Avatar selection → voice plays within 300ms
2. ✅ Lead form → Supabase row created + n8n event
3. ✅ Intake form → Full data saved + email alert
4. ✅ Chat end → Conversation saved + summary
5. ✅ Widget persistence across page navigation
6. ✅ No API keys exposed in client bundle

### Manual Testing
```bash
# Start dev server
npm run dev

# Test chat widget
# 1. Open widget, select avatar
# 2. Send message, verify voice plays
# 3. Navigate pages, verify persistence

# Test forms
# 1. Submit contact form
# 2. Check Supabase for new lead
# 3. Verify n8n receives event
```

## 🚀 Deployment

### Vercel (Frontend)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
```

### Render (Backend)
- Deploy Node.js service with environment variables
- Configure health checks and auto-deploy
- Set up custom domain mapping

### Supabase
- Create project and get connection strings
- Run migrations to create tables
- Configure Row Level Security (RLS)

## 📈 Performance

- **Lighthouse Score**: 90+ (Performance, Accessibility, Best Practices, SEO)
- **Core Web Vitals**: Optimized for LCP, FID, CLS
- **Bundle Size**: Optimized with code splitting
- **Images**: WebP format with lazy loading

## 🔒 Security

- **API Keys**: Server-side only, never exposed to client
- **CORS**: Restricted to allowed origins
- **Rate Limiting**: Token bucket on API routes
- **Input Validation**: Zod schemas for all inputs
- **HTTPS**: Enforced in production

## 📝 Environment Variables

### Required for Development
```env
N8N_WEBHOOK_URL=
ODIADEV_TTS_URL=
ODIADEV_TTS_API_KEY=
BRAIN_BASE_URL=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

### Optional
```env
BRAIN_API_KEY=          # For brain service authentication
ALERT_EMAIL_TO=         # Override default email
TELEGRAM_BOT_TOKEN=     # For n8n notifications
TELEGRAM_CHAT_ID=       # For n8n notifications
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is proprietary software owned by ODIADEV. All rights reserved.

## 🆘 Support

- **Email**: support@odiadev.com
- **Documentation**: [Coming Soon]
- **Issues**: Create GitHub issue for bugs
- **Feature Requests**: Contact via email

---

Built with ❤️ by the ODIADEV team in Nigeria 🇳🇬
