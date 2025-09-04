import type { VercelRequest, VercelResponse } from '@vercel/node';

const TTS_URL = process.env.ODIADEV_TTS_URL || '';      // e.g. https://tts-api.odia.dev
const TTS_KEY = process.env.ODIADEV_TTS_API_KEY || '';
const OPENAI_KEY = process.env.OPENAI_API_KEY || '';

const toB64 = (buf: ArrayBuffer) => Buffer.from(buf).toString('base64');

async function tryOdia(text: string, voice_id?: string): Promise<string|null> {
  if (!TTS_URL) return null;
  const candidates = [
    { url: `${TTS_URL}/v1/tts`, json: true },
    { url: `${TTS_URL}/synthesize`, json: false },
    { url: `${TTS_URL}`, json: false },
  ];
  for (const c of candidates) {
    try {
      const r = await fetch(c.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(TTS_KEY ? { Authorization: `Bearer ${TTS_KEY}` } : {}),
        },
        body: JSON.stringify({ text, voice_id }),
      });
      if (!r.ok) continue;
      const ct = r.headers.get('content-type') || '';
      if (ct.includes('application/json')) {
        const data = await r.json();
        if (typeof data.audioUrl === 'string' && data.audioUrl.startsWith('data:')) {
          return data.audioUrl.split(',')[1];
        }
        if (typeof data.audio === 'string') return data.audio;
        if (typeof data.data === 'string') return data.data;
      } else {
        const buf = await r.arrayBuffer();
        return toB64(buf);
      }
    } catch {}
  }
  return null;
}

async function tryOpenAI(text: string, voice_id?: string): Promise<string|null> {
  if (!OPENAI_KEY) return null;
  // Map your voice ids to OpenAI voices; default to alloy
  const map: Record<string,string> = {
    naija_female_warm: 'alloy',
    naija_male_bass: 'verse',
  };
  const voice = map[voice_id || ''] || 'alloy';

  const r = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini-tts',
      voice,
      input: text,
      format: 'mp3',
    }),
  });
  if (!r.ok) return null;
  const buf = await r.arrayBuffer();
  return toB64(buf);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
    const { text, voice_id } = req.body || {};
    if (!text) return res.status(400).json({ error: 'Missing text' });

    let b64 = await tryOdia(text, voice_id);
    if (!b64) b64 = await tryOpenAI(text, voice_id);
    if (!b64) return res.status(502).json({ error: 'All TTS providers failed' });

    return res.status(200).json({ audioUrl: `data:audio/mpeg;base64,${b64}` });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'TTS error' });
  }
}