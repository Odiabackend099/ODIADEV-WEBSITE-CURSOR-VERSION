import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion'
import { useChatStore } from '../../store/chatStore'

type MicButtonProps = {
  // called when STT finalizes; your parent should send this to the assistant
  onSubmitText: (text: string) => Promise<void> | void;
  // optionally play bot answers with TTS; pass the text and optional voice id
  defaultVoiceId?: string; // e.g. "naija_female_warm"
  className?: string;
};

declare global {
  interface Window {
    webkitSpeechRecognition?: any;
    SpeechRecognition?: any;
  }
}

const hasWebSpeech =
  typeof window !== 'undefined' &&
  (window.SpeechRecognition || window.webkitSpeechRecognition);

export default function MicButton({
  onSubmitText,
  defaultVoiceId = 'naija_female_warm',
  className = '',
}: MicButtonProps) {
  const { isMicEnabled, toggleMicEnabled, updateUserProfile, stopCurrentAudio } = useChatStore()
  const [isListening, setIsListening] = useState(false);
  const [interim, setInterim] = useState('');
  const recRef = useRef<any>(null);
  const unlockedRef = useRef(false);

  // Create a silent audio to unlock autoplay on first user gesture
  const unlockAudio = async () => {
    if (unlockedRef.current) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const buf = ctx.createBuffer(1, 1, 22050);
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.connect(ctx.destination);
      src.start(0);
      await ctx.resume();
      unlockedRef.current = true;
    } catch {
      // best-effort
    }
  };

  const startRecognition = async () => {
    await unlockAudio();

    if (!hasWebSpeech) {
      alert('Voice input not supported on this browser. Please use the text box.');
      return;
    }
    if (recRef.current) return;

    const Recognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new Recognition();
    rec.lang = 'en-US'; // TODO: make dynamic if you want locales
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    rec.continuous = false;

    rec.onstart = () => {
      setIsListening(true);
      setInterim('');
    };

    rec.onresult = async (event: any) => {
      let finalText = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const r = event.results[i];
        if (r.isFinal) {
          finalText += r[0].transcript;
        } else {
          setInterim(r[0].transcript);
        }
      }
      if (finalText.trim()) {
        setInterim('');
        await onSubmitText(finalText.trim());
      }
    };

    rec.onerror = () => {
      stopRecognition();
      alert('Microphone error. Please allow mic permissions and try again.');
    };

    rec.onend = () => {
      stopRecognition();
    };

    recRef.current = rec;
    rec.start();
  };

  const stopRecognition = () => {
    if (recRef.current) {
      try {
        recRef.current.stop();
      } catch {}
      recRef.current = null;
    }
    setIsListening(false);
    setInterim('');
  };

  // Utility to play any string via our API
  const playTTS = async (text: string, voiceId?: string) => {
    try {
      const apiUrl = process.env.NODE_ENV === 'development' 
        ? 'http://localhost:3001/api/tts' 
        : '/api/tts'
      
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice_id: voiceId || defaultVoiceId }),
      });
      if (!res.ok) throw new Error('TTS failed');
      const data = await res.json();
      const audio = new Audio(data.audioUrl);
      await unlockAudio();
      await audio.play();
    } catch (e) {
      console.error(e);
    }
  };

  // Expose a simple test hook via window (optional)
  useEffect(() => {
    (window as any).ODIADEV_playTTS = playTTS;
  }, []);

  const handleMicClick = async () => {
    if (!isMicEnabled) {
      toggleMicEnabled()
      // Update user profile to indicate they've consented to microphone access
      updateUserProfile({ hasConsented: true })
      return
    }

    if (isListening) {
      stopRecognition()
    } else {
      // Stop any currently playing TTS audio (barge-in functionality)
      stopCurrentAudio()
      await startRecognition()
    }
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className="text-sm text-stone">Mic</span>
      <motion.button
        onMouseDown={startRecognition}
        onMouseUp={stopRecognition}
        onTouchStart={startRecognition}
        onTouchEnd={stopRecognition}
        onClick={handleMicClick}
        aria-pressed={isListening}
        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
          isListening
            ? 'bg-red-500 text-white animate-pulse'
            : isMicEnabled
            ? 'bg-gold text-navy hover:bg-gold-soft'
            : 'bg-mist text-stone'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title={isListening ? 'Release to stop talking' : 'Hold to talk'}
      >
        {isListening ? (
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

      {interim ? (
        <div className="text-xs text-stone opacity-70">
          {interim}
        </div>
      ) : null}

      {/* Optional quick TTS demo button (safe to remove) */}
      <div className="ml-2">
        <button
          type="button"
          onClick={() => playTTS('Hello from ODIADEV voice!')}
          className="rounded px-2 py-1 text-xs bg-mist hover:bg-mist/80 text-navy"
        >
          Test TTS ▶
        </button>
      </div>
    </div>
  );
}
