import { motion } from 'framer-motion'
import { useChatStore } from '../../store/chatStore'

const MicButton = () => {
  const { isMicEnabled, isRecording, toggleMicEnabled, setRecording } = useChatStore()

  const handleMicClick = async () => {
    if (!isMicEnabled) {
      toggleMicEnabled()
      return
    }

    if (isRecording) {
      // Stop recording
      setRecording(false)
      // TODO: Process recorded audio
    } else {
      // Start recording
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true })
        setRecording(true)
        
        // TODO: Implement actual recording logic
        // For now, just simulate recording
        setTimeout(() => {
          setRecording(false)
        }, 3000)
      } catch (error) {
        console.error('Error accessing microphone:', error)
      }
    }
  }

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
