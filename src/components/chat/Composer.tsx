import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

interface ComposerProps {
  onSendMessage: (message: string) => Promise<void>
}

const Composer = ({ onSendMessage }: ComposerProps) => {
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || isLoading) return

    const messageToSend = message.trim()
    setMessage('')
    setIsLoading(true)

    try {
      await onSendMessage(messageToSend)
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [message])

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <div className="flex items-end space-x-2">
        <div className="flex-1">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="w-full px-4 py-3 border border-mist/30 rounded-xl resize-none focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-200"
            rows={1}
            maxLength={1000}
            disabled={isLoading}
          />
        </div>
        <motion.button
          type="submit"
          disabled={!message.trim() || isLoading}
          className={`p-3 rounded-xl transition-all duration-200 ${
            message.trim() && !isLoading
              ? 'bg-gold text-navy hover:bg-gold-soft'
              : 'bg-mist text-stone cursor-not-allowed'
          }`}
          whileHover={message.trim() && !isLoading ? { scale: 1.05 } : {}}
          whileTap={message.trim() && !isLoading ? { scale: 0.95 } : {}}
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-5 h-5 border-2 border-navy border-t-transparent rounded-full"
            />
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </motion.button>
      </div>
      <div className="flex justify-between items-center mt-2 text-xs text-stone">
        <span>Press Enter to send, Shift+Enter for new line</span>
        <span>{message.length}/1000</span>
      </div>
    </form>
  )
}

export default Composer
