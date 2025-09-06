# 🌍 ODIADEV Conversational Assistant — Universal Deployment Guide

This guide provides complete deployment instructions for the ODIADEV Conversational Assistant following the universal build prompt template.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Vercel account (recommended) or any hosting platform
- ODIADEV TTS API key

### 1. Environment Setup

Create a `.env.local` file in your project root:

```bash
# ODIADEV TTS Configuration
ODIADEV_TTS_KEY=your_actual_api_key_here

# N8N Webhook (optional)
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/your-webhook-id
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Development Server

```bash
# Start development server
npm run dev

# Start with API server (for local testing)
npm run dev:full
```

### 4. Build for Production

```bash
npm run build
```

## 🔧 Configuration

### API Configuration

The system uses the following API endpoints:

- **TTS API**: `http://13.247.221.39/v1/tts`
- **Voice Options**: 
  - `naija_female_warm` (default)
  - `naija_male_strong`

### Security Features

- ✅ API key stored securely in environment variables
- ✅ Rate limiting (3 requests per minute per IP)
- ✅ CORS configured for `https://*.odia.dev`
- ✅ Input validation and sanitization
- ✅ Request timeout handling (10 seconds)

### Mobile-First Features

- ✅ Responsive design (mobile-first)
- ✅ Touch-friendly interface
- ✅ Offline support with message queuing
- ✅ Nigerian network optimization
- ✅ Retry logic with exponential backoff

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel
   ```

2. **Set Environment Variables**
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add `ODIADEV_TTS_KEY` with your actual API key
   - Add `N8N_WEBHOOK_URL` if using custom webhook

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Option 2: Netlify

1. **Build Command**: `npm run build`
2. **Publish Directory**: `dist`
3. **Environment Variables**: Add in Netlify dashboard

### Option 3: Render

1. **Build Command**: `npm run build`
2. **Start Command**: `npm run preview`
3. **Environment Variables**: Add in Render dashboard

### Option 4: Self-Hosted

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Serve the dist folder** with any static file server:
   ```bash
   # Using serve
   npx serve dist
   
   # Using http-server
   npx http-server dist
   ```

## 🔒 Security Checklist

- [ ] API key stored in environment variables (never in code)
- [ ] CORS properly configured for your domain
- [ ] Rate limiting enabled
- [ ] Input validation active
- [ ] HTTPS enabled in production
- [ ] Content Security Policy configured

## 📱 Mobile Optimization

The chat widget is optimized for Nigerian mobile networks:

- **Connection Timeout**: 10 seconds
- **Retry Logic**: 3 attempts with exponential backoff (250ms, 500ms, 1000ms)
- **Offline Support**: Messages queued when offline
- **Responsive Design**: Works on all screen sizes
- **Touch Interface**: Optimized for mobile interaction

## 🎤 Voice Features

### Supported Voices
- **Naija Female (Warm)**: `naija_female_warm` (default)
- **Naija Male (Strong)**: `naija_male_strong`

### Voice Controls
- Toggle voice on/off
- Voice selector in chat header
- Auto-play voice responses
- Manual play/pause for each message

## 🛠 Troubleshooting

### Common Issues

1. **TTS Not Working**
   - Check `ODIADEV_TTS_KEY` environment variable
   - Verify API key is valid
   - Check network connectivity

2. **CORS Errors**
   - Ensure your domain is in `ALLOWED_ORIGINS`
   - Check CORS configuration in `api/tts.ts`

3. **Rate Limiting**
   - Default: 3 requests per minute per IP
   - Adjust in `api/tts.ts` if needed

4. **Mobile Issues**
   - Test on actual mobile devices
   - Check touch event handlers
   - Verify responsive breakpoints

### Debug Mode

Enable debug logging by adding to your environment:
```bash
DEBUG=odiadev:*
```

## 📊 Performance Monitoring

### Key Metrics to Monitor
- TTS response time
- API success rate
- Mobile user experience
- Network connectivity issues

### Recommended Tools
- Vercel Analytics
- Google Analytics
- Custom logging in TTS API

## 🔄 Updates and Maintenance

### Regular Updates
- Monitor ODIADEV TTS API status
- Update voice options as new ones become available
- Review and update rate limiting as needed
- Monitor mobile performance metrics

### Backup Strategy
- Keep environment variables secure
- Regular code backups
- API key rotation plan

## 📞 Support

For issues with:
- **ODIADEV TTS API**: Contact ODIADEV support
- **Deployment Issues**: Check hosting platform documentation
- **Code Issues**: Review this guide and code comments

## 🎯 Production Checklist

Before going live:

- [ ] Environment variables configured
- [ ] Domain added to CORS origins
- [ ] SSL certificate active
- [ ] Rate limiting tested
- [ ] Mobile devices tested
- [ ] Voice features working
- [ ] Offline mode tested
- [ ] Performance optimized
- [ ] Error handling verified
- [ ] Analytics configured

---

**Built with ❤️ using the ODIADEV Universal Build Prompt Template**

This implementation provides a production-ready conversational assistant with Nigerian voice support, mobile-first design, and robust error handling for reliable operation on Nigerian networks.
