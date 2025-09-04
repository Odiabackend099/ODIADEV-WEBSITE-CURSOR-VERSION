import type { VercelRequest, VercelResponse } from '@vercel/node';

const BRAIN_BASE_URL = process.env.BRAIN_BASE_URL || '';
const BRAIN_API_KEY = process.env.BRAIN_API_KEY || '';
const OPENAI_KEY = process.env.OPENAI_API_KEY || '';

async function tryBrain(messages: any[]) {
  if (!BRAIN_BASE_URL) return null;
  try {
    const r = await fetch(`${BRAIN_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(BRAIN_API_KEY ? { Authorization: `Bearer ${BRAIN_API_KEY}` } : {}),
      },
      body: JSON.stringify({ messages }),
    });
    if (!r.ok) return null;
    const j = await r.json();
    if (typeof j.reply === 'string') return j.reply;
    if (j.choices?.[0]?.message?.content) return j.choices[0].message.content;
    return null;
  } catch { return null; }
}

async function tryOpenAI(messages: any[]) {
  if (!OPENAI_KEY) return null;
  const r = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.2,
    }),
  });
  if (!r.ok) return null;
  const j = await r.json();
  return j.choices?.[0]?.message?.content || null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
    const { messages } = req.body || {};
    if (!Array.isArray(messages)) return res.status(400).json({ error: 'Missing messages' });

    let reply = await tryBrain(messages);
    if (!reply) reply = await tryOpenAI(messages);
    if (!reply) return res.status(502).json({ error: 'All chat providers failed' });

    return res.status(200).json({ reply });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'Chat error' });
  }
}