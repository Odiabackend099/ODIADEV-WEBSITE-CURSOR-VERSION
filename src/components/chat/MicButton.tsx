import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion'
import { useChatStore } from '../../store/chatStore'

type Props = {
  onTranscript: (text: string) => Promise<void> | void; // call your send() with this
  className?: string;
};

export default function MicButton({ onTranscript, className = '' }: Props) {
  const { isMicEnabled, toggleMicEnabled, updateUserProfile } = useChatStore()
  const [rec, setRec] = useState<MediaRecorder | null>(null);
  const chunks = useRef<BlobPart[]>([]);

  const start = async () => {
    if (!isMicEnabled) {
      toggleMicEnabled()
      updateUserProfile({ hasConsented: true })
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      chunks.current = [];
      mr.ondataavailable = (e) => { if (e.data.size) chunks.current.push(e.data); };
      mr.onstop = async () => {
        const blob = new Blob(chunks.current, { type: 'audio/webm' });
        const buf = await blob.arrayBuffer();
        const b64 = btoa(String.fromCharCode(...new Uint8Array(buf)));
        
        const apiUrl = process.env.NODE_ENV === 'development' 
          ? 'http://localhost:3001/api/stt' 
          : '/api/stt'
        
        const r = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ audioBase64: b64, mimeType: 'audio/webm' }),
        });
        const j = await r.json();
        if (j?.text) await onTranscript(j.text);
      };
      mr.start();
      setRec(mr);
    } catch {
      alert('Microphone permission denied.');
    }
  };

  const stop = () => {
    if (!rec) return;
    try { rec.stop(); } catch {}
    rec.stream.getTracks().forEach(t => t.stop());
    setRec(null);
  };

  const listening = !!rec;

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className="text-sm text-stone">Mic</span>
      <motion.button
        type="button"
        onMouseDown={start}
        onMouseUp={stop}
        onTouchStart={start}
        onTouchEnd={stop}
        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
          listening
            ? 'bg-red-500 text-white animate-pulse'
            : isMicEnabled
            ? 'bg-gold text-navy hover:bg-gold-soft'
            : 'bg-mist text-stone'
        }`}
        aria-pressed={listening}
        title={listening ? 'Release to stop' : 'Hold to talk'}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {listening ? (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
            </svg>
          </motion.div>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        )}
      </motion.button>
    </div>
  );
}
