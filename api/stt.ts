import type { VercelRequest, VercelResponse } from '@vercel/node';

const OPENAI_KEY = process.env.OPENAI_API_KEY || '';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
    const { audioBase64, mimeType } = req.body || {};
    if (!audioBase64 || !mimeType) return res.status(400).json({ error: 'Missing audio' });
    if (!OPENAI_KEY) return res.status(500).json({ error: 'OPENAI_API_KEY not set' });

    const bytes = Buffer.from(audioBase64, 'base64');
    const form = new FormData();
    // Whisper prefers wav/mp3/m4a/webm — name with extension
    form.append('file', new Blob([bytes], { type: mimeType }) as any, 'audio.webm');
    form.append('model', 'whisper-1'); // stable

    const r = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${OPENAI_KEY}` },
      body: form as any,
    });
    if (!r.ok) {
      const errTxt = await r.text();
      return res.status(502).json({ error: `OpenAI STT failed: ${errTxt}` });
    }
    const data = await r.json();
    return res.status(200).json({ text: data.text || '' });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'STT error' });
  }
}
