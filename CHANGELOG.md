# Changelog

All notable changes to the ODIADEV Website project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-09-03

### Added
- Initial release of ODIADEV Website
- Premium voice AI platform with floating chat widget
- CRM dashboard with leads management and analytics
- Multiple voice avatars (Amina, Chinedu, Sarah, David)
- Voice mode toggle with auto-play TTS
- Contact form with lead capture
- Pricing page with tiered plans
- Responsive design optimized for all devices
- Security implementation with HMAC signatures
- Development configuration with fallback responses
- Comprehensive error handling and loading states

### Features
- **Chat Widget**: Persistent floating widget with avatar selection
- **Voice Integration**: TTS with 4 voice options (Nigerian/US, male/female)
- **Dashboard**: Leads management, conversation tracking, analytics
- **Security**: CORS, rate limiting, input validation, webhook signatures
- **Animations**: GSAP, Framer Motion, Lenis smooth scroll
- **State Management**: Zustand with localStorage persistence

### Technical
- React 18 + TypeScript + Vite
- Tailwind CSS with custom design tokens
- Vercel API routes for backend services
- Supabase database schema
- n8n automation workflows
- Render backend services

### Security
- HTTP security headers (CSP, HSTS, X-Frame-Options)
- HMAC-SHA256 webhook signature verification
- Rate limiting with token bucket
- Input validation with Zod schemas
- CORS allow-list configuration

## [0.1.0] - 2025-09-03

### Added
- Project initialization
- Basic React + TypeScript setup
- Tailwind CSS configuration
- Component structure
- Routing setup

### Changed
- Initial project structure

### Fixed
- Development environment setup
- Build configuration
