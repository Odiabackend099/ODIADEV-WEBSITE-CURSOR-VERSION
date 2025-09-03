import { motion } from 'framer-motion'
import { useChatStore } from '../../store/chatStore'

const VoiceToggle = () => {
  const { isVoiceMode, toggleVoiceMode } = useChatStore()

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-stone">Voice</span>
      <motion.button
        onClick={toggleVoiceMode}
        className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
          isVoiceMode ? 'bg-gold' : 'bg-mist'
        }`}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md"
          animate={{ x: isVoiceMode ? 26 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </motion.button>
      {isVoiceMode && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center space-x-1"
        >
          <div className="w-1 h-1 bg-gold rounded-full animate-pulse"></div>
          <div className="w-1 h-1 bg-gold rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-1 h-1 bg-gold rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </motion.div>
      )}
    </div>
  )
}

export default VoiceToggle
