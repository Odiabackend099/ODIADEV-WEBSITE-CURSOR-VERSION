import express from 'express'
const app = express()
app.use(express.json())

// Health check
app.get('/', (_req, res) => res.send('ODIADEV Brain OK'))

// Qualify endpoint
app.post('/api/qualify', (req, res) => {
  const { name, email, phone, message, source } = req.body || {}
  if (!name || !email) return res.status(400).json({ error: 'Missing name/email' })
  const score = Math.min(100, (message?.length || 10) + (source === 'website' ? 20 : 0))
  res.json({ qualified: score >= 40, score, notes: 'Heuristic score from Brain placeholder' })
})

// Summarize endpoint
app.post('/api/summarize', (req, res) => {
  const { transcript } = req.body || {}
  if (!transcript) return res.status(400).json({ error: 'Missing transcript' })
  const words = String(transcript).split(/\s+/)
  const summary = words.slice(0, 60).join(' ') + (words.length > 60 ? '…' : '')
  res.json({ summary, topics: [] })
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log('Brain listening on ' + port))
