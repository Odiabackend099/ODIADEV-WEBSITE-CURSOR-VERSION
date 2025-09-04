// api/tts.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

const TTS_URL = process.env.ODIADEV_TTS_URL;         // e.g. https://tts-api.odia.dev
const TTS_KEY = process.env.ODIADEV_TTS_API_KEY || '';

function toBase64(buf: ArrayBuffer) {
  // @ts-ignore
  return Buffer.from(buf).toString('base64');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  if (!TTS_URL) return res.status(500).json({ error: 'ODIADEV_TTS_URL not set' });

  try {
    const { text, voice_id } = req.body || {};
    if (!text) return res.status(400).json({ error: 'Missing text' });

    // try a few likely endpoints, normalize outputs
    const targets = [
      // JSON -> { audio: base64 } or { audioUrl } or raw stream
      { url: `${TTS_URL}/v1/tts`, json: true },
      { url: `${TTS_URL}/synthesize`, json: false },
      { url: `${TTS_URL}`, json: false },
    ];

    let audioB64: string | null = null;

    for (const t of targets) {
      try {
        const r = await fetch(t.url, {
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
          // normalize common shapes
          if (data.audioUrl && typeof data.audioUrl === 'string' && data.audioUrl.startsWith('data:')) {
            audioB64 = data.audioUrl.split(',')[1];
          } else if (data.audio && typeof data.audio === 'string') {
            audioB64 = data.audio;
          } else if (data.data && typeof data.data === 'string') {
            audioB64 = data.data;
          }
        } else {
          // assume binary stream (mp3/ogg/wav)
          const buf = await r.arrayBuffer();
          audioB64 = toBase64(buf);
        }

        if (audioB64) break;
      } catch {
        // try next target
      }
    }

    if (!audioB64) {
      return res.status(502).json({ error: 'Upstream TTS failed' });
    }

    // Always return a data URL
    return res.status(200).json({
      audioUrl: `data:audio/mpeg;base64,${audioB64}`,
    });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'TTS error' });
  }
}