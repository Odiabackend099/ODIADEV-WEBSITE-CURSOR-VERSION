import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, Send, Volume2, VolumeX, X, MessageCircle } from 'lucide-react'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  isAudio?: boolean
}

const AdaquaChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      addMessage({
        content: "Hello! I'm Agent ODIADEV, your AI assistant. How can I help you today?",
        role: 'assistant',
        isAudio: true
      })
    }
  }, [])

  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date()
    }
    setMessages(prev => [...prev, newMessage])
    return newMessage
  }

  const playAudio = async (audioUrl: string) => {
    if (audioRef.current) {
      audioRef.current.src = audioUrl
      setIsPlaying(true)
      try {
        await audioRef.current.play()
      } catch (error) {
        console.error('Audio play failed:', error)
        setIsPlaying(false)
      }
    }
  }

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsPlaying(false)
    }
  }

  const generateTTS = async (text: string): Promise<string | null> => {
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          voice_id: 'naija_female_warm',
          format: 'mp3'
        })
      })

      if (!response.ok) {
        throw new Error('TTS API failed')
      }

      const data = await response.json()
      return data.audioUrl
    } catch (error) {
      console.error('TTS Error:', error)
      return null
    }
  }

  const sendToAI = async (text: string) => {
    setIsTyping(true)
    
    try {
      // Send to n8n webhook for AI processing
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          sessionId: 'adaqua-session-' + Date.now()
        })
      })

      if (!response.ok) {
        throw new Error('AI API failed')
      }

      const data = await response.json()
      const aiResponse = data.reply || data.message || "I'm sorry, I couldn't process that request."

      // Add AI response
      const assistantMessage = addMessage({
        content: aiResponse,
        role: 'assistant',
        isAudio: true
      })

      // Generate and play TTS
      if (isVoiceEnabled) {
        const audioUrl = await generateTTS(aiResponse)
        if (audioUrl) {
          await playAudio(audioUrl)
        }
      }

    } catch (error) {
      console.error('AI Error:', error)
      addMessage({
        content: "I'm sorry, I'm having trouble connecting right now. Please try again.",
        role: 'assistant',
        isAudio: true
      })
    } finally {
      setIsTyping(false)
    }
  }

  const handleSendMessage = async () => {
    if (!inputText.trim()) return

    const userMessage = addMessage({
      content: inputText,
      role: 'user'
    })

    setInputText('')
    await sendToAI(inputText)
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })
      
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const audioUrl = URL.createObjectURL(audioBlob)
        
        // Convert to base64 for STT
        const arrayBuffer = await audioBlob.arrayBuffer()
        const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))

        // Send to STT API
        try {
          const sttResponse = await fetch('/api/stt', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              audioBase64: base64,
              mimeType: 'audio/webm'
            })
          })

          if (sttResponse.ok) {
            const sttData = await sttResponse.json()
            const transcribedText = sttData.text || sttData.transcript

            if (transcribedText) {
              addMessage({
                content: transcribedText,
                role: 'user'
              })
              await sendToAI(transcribedText)
            }
          }
        } catch (error) {
          console.error('STT Error:', error)
          addMessage({
            content: "Sorry, I couldn't understand what you said. Please try again.",
            role: 'assistant'
          })
        }

        // Clean up
        stream.getTracks().forEach(track => track.stop())
        URL.revokeObjectURL(audioUrl)
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Microphone access denied:', error)
      alert('Please allow microphone access to use voice features.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const toggleVoice = () => {
    setIsVoiceEnabled(!isVoiceEnabled)
    if (isPlaying) {
      stopAudio()
    }
  }

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-2xl flex items-center justify-center text-white z-50 hover:scale-105 transition-transform"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>

      {/* Chat Widget */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-40 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold">O</span>
                </div>
                <div>
                  <h3 className="font-semibold">Agent ODIADEV</h3>
                  <p className="text-xs opacity-90">AI Assistant</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleVoice}
                  className={`p-2 rounded-full transition-colors ${
                    isVoiceEnabled ? 'bg-white/20' : 'bg-white/10'
                  }`}
                >
                  {isVoiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    {message.isAudio && message.role === 'assistant' && (
                      <div className="mt-2 flex items-center space-x-2">
                        <button
                          onClick={() => {
                            if (isPlaying) {
                              stopAudio()
                            } else {
                              generateTTS(message.content).then(audioUrl => {
                                if (audioUrl) playAudio(audioUrl)
                              })
                            }
                          }}
                          className="text-xs bg-white/20 px-2 py-1 rounded-full hover:bg-white/30 transition-colors"
                        >
                          {isPlaying ? '⏸️' : '🔊'} Play
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-100 p-3 rounded-2xl">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <button
                  onMouseDown={startRecording}
                  onMouseUp={stopRecording}
                  onTouchStart={startRecording}
                  onTouchEnd={stopRecording}
                  className={`p-3 rounded-full transition-colors ${
                    isRecording
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
                </button>
                
                <button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim()}
                  className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
                >
                  <Send size={20} />
                </button>
              </div>
              
              <p className="text-xs text-gray-500 mt-2 text-center">
                {isVoiceEnabled ? 'Voice enabled - Hold mic to speak' : 'Voice disabled - Type to chat'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Audio Element */}
      <audio
        ref={audioRef}
        onEnded={() => setIsPlaying(false)}
        onError={() => setIsPlaying(false)}
        className="hidden"
      />
    </>
  )
}

export default AdaquaChatWidget
