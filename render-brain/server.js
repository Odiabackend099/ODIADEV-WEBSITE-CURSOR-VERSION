// render-brain/server.js
import express from 'express'
import compression from 'compression'
import cors from 'cors'

const app = express()
app.use(express.json({ limit: '1mb' }))
app.use(compression())
app.use(cors({ origin: '*', methods: ['GET','POST'] }))

// root + healthz for Render health checks
app.get('/', (_req, res) => {
  res.type('text/plain').send('ODIADEV Brain OK')
})
app.get('/healthz', (_req, res) => {
  res.json({ ok: true, service: 'odiadev-brain' })
})

// Qualify endpoint (simple heuristic)
app.post('/api/qualify', (req, res) => {
  const { name, email, message = '', source = 'website' } = req.body || {}
  if (!name || !email) return res.status(400).json({ error: 'Missing name/email' })
  const score = Math.min(100, message.length + (source === 'website' ? 20 : 0))
  res.json({ qualified: score >= 40, score, notes: 'Heuristic score from Brain service' })
})

// Summarize endpoint (first 60 words)
app.post('/api/summarize', (req, res) => {
  const { transcript } = req.body || {}
  if (!transcript) return res.status(400).json({ error: 'Missing transcript' })
  const words = String(transcript).split(/\s+/)
  const summary = words.slice(0, 60).join(' ') + (words.length > 60 ? '…' : '')
  res.json({ summary, topics: [] })
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log('Brain listening on ' + port))
