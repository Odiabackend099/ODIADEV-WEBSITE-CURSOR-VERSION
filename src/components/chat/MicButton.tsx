import { motion } from 'framer-motion'
import { useChatStore } from '../../store/chatStore'
import { useState, useRef, useEffect } from 'react'

const MicButton = () => {
  const { isMicEnabled, isRecording, toggleMicEnabled, setRecording, sendMessage, stopCurrentAudio, updateUserProfile } = useChatStore()
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [audioChunks, setAudioChunks] = useState<Blob[]>([])
  const [isListening, setIsListening] = useState(false)
  const [silenceTimer, setSilenceTimer] = useState<NodeJS.Timeout | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Voice Activity Detection
  const startVoiceActivityDetection = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      audioContextRef.current = audioContext
      
      const analyser = audioContext.createAnalyser()
      analyserRef.current = analyser
      
      const source = audioContext.createMediaStreamSource(stream)
      source.connect(analyser)
      
      analyser.fftSize = 256
      const bufferLength = analyser.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)
      
      const checkVoiceActivity = () => {
        if (!isListening) return
        
        analyser.getByteFrequencyData(dataArray)
        const average = dataArray.reduce((a, b) => a + b) / bufferLength
        
        // Voice activity threshold
        if (average > 30) {
          // Voice detected, clear silence timer
          if (silenceTimer) {
            clearTimeout(silenceTimer)
          }
          
          // Set new silence timer
          const timer = setTimeout(() => {
            stopRecording()
          }, 2000) // 2 seconds of silence
          setSilenceTimer(timer)
        }
        
        requestAnimationFrame(checkVoiceActivity)
      }
      
      checkVoiceActivity()
    } catch (error) {
      console.error('Error setting up voice activity detection:', error)
    }
  }

  const stopRecording = async () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop()
      setRecording(false)
      setIsListening(false)
      
      if (silenceTimer) {
        clearTimeout(silenceTimer)
        setSilenceTimer(null)
      }
      
      // Clean up audio context
      if (audioContextRef.current) {
        audioContextRef.current.close()
        audioContextRef.current = null
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
        streamRef.current = null
      }
    }
  }

  const handleMicClick = async () => {
    if (!isMicEnabled) {
      toggleMicEnabled()
      // Update user profile to indicate they've consented to microphone access
      updateUserProfile({ hasConsented: true })
      return
    }

    if (isRecording) {
      await stopRecording()
    } else {
      // Stop any currently playing TTS audio (barge-in functionality)
      stopCurrentAudio()
      
      // Start recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        
        const mediaRecorder = new MediaRecorder(stream)
        setMediaRecorder(mediaRecorder)
        
        const chunks: Blob[] = []
        setAudioChunks(chunks)
        
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data)
          }
        }
        
        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(chunks, { type: 'audio/wav' })
          
          // For now, simulate speech-to-text with a mock response
          // In production, this would send to a speech-to-text API
          const mockTranscription = "Hello, I need help with voice AI integration"
          
          // Send the transcribed message
          await sendMessage(mockTranscription)
        }
        
        mediaRecorder.start()
        setRecording(true)
        setIsListening(true)
        
        // Start voice activity detection
        await startVoiceActivityDetection()
        
      } catch (error) {
        console.error('Error accessing microphone:', error)
      }
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (silenceTimer) {
        clearTimeout(silenceTimer)
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [silenceTimer])

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-stone">Mic</span>
      <motion.button
        onClick={handleMicClick}
        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
          isRecording
            ? 'bg-red-500 text-white animate-pulse'
            : isMicEnabled
            ? 'bg-gold text-navy hover:bg-gold-soft'
            : 'bg-mist text-stone'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isRecording ? (
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
  )
}

export default MicButton
