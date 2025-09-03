import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getRandomFallbackResponse } from '../config/development'

export interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  audioUrl?: string
}

export interface Avatar {
  id: string
  name: string
  voiceId: string
  description: string
  image: string
  accent: 'nigerian' | 'us'
  gender: 'male' | 'female'
}

export interface ChatState {
  sessionId: string | null
  messages: Message[]
  isVoiceMode: boolean
  isMicEnabled: boolean
  selectedAvatar: Avatar | null
  isRecording: boolean
  isPlaying: boolean
}

export interface ChatActions {
  initializeSession: () => void
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void
  sendMessage: (content: string) => Promise<void>
  toggleVoiceMode: () => void
  toggleMicEnabled: () => void
  setSelectedAvatar: (avatar: Avatar) => void
  setRecording: (recording: boolean) => void
  setPlaying: (playing: boolean) => void
  endConversation: () => Promise<void>
  clearMessages: () => void
  sendEvent: (type: string, payload: any) => Promise<void>
}

const defaultAvatars: Avatar[] = [
  {
    id: 'naija_female_warm',
    name: 'Amina',
    voiceId: 'naija_female_warm',
    description: 'Warm Nigerian female voice',
    image: '/avatars/amina.svg',
    accent: 'nigerian',
    gender: 'female',
  },
  {
    id: 'naija_male_clear',
    name: 'Chinedu',
    voiceId: 'naija_male_clear',
    description: 'Clear Nigerian male voice',
    image: '/avatars/chinedu.svg',
    accent: 'nigerian',
    gender: 'male',
  },
  {
    id: 'us_female_crisp',
    name: 'Sarah',
    voiceId: 'us_female_crisp',
    description: 'Crisp US female voice',
    image: '/avatars/sarah.svg',
    accent: 'us',
    gender: 'female',
  },
  {
    id: 'us_male_calm',
    name: 'David',
    voiceId: 'us_male_calm',
    description: 'Calm US male voice',
    image: '/avatars/david.svg',
    accent: 'us',
    gender: 'male',
  },
]

export const useChatStore = create<ChatState & ChatActions>()(
  persist(
    (set, get) => ({
      // State
      sessionId: null,
      messages: [],
      isVoiceMode: false,
      isMicEnabled: false,
      selectedAvatar: defaultAvatars[0],
      isRecording: false,
      isPlaying: false,

      // Actions
      initializeSession: () => {
        const sessionId = get().sessionId || crypto.randomUUID()
        set({ sessionId })
      },

      addMessage: (message) => {
        const newMessage: Message = {
          ...message,
          id: crypto.randomUUID(),
          timestamp: new Date(),
        }
        set((state) => ({
          messages: [...state.messages, newMessage],
        }))
      },

      sendMessage: async (content: string) => {
        const { addMessage, selectedAvatar, isVoiceMode, sessionId } = get()
        
        // Add user message
        addMessage({
          content,
          role: 'user',
        })

        try {
          const payload = {
            message: content,
            sessionId,
            voiceId: selectedAvatar?.voiceId,
          }

                            // Send to API (server will add security headers)
                  const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                  })

          if (!response.ok) {
            throw new Error(`API Error: ${response.status}`)
          }

          const data = await response.json()
          
          // Add assistant response
          addMessage({
            content: data.message,
            role: 'assistant',
            audioUrl: data.audioUrl,
          })

          // Auto-play audio if voice mode is on
          if (isVoiceMode && data.audioUrl) {
            const audio = new Audio(data.audioUrl)
            audio.play().catch(console.error)
          }
        } catch (error) {
          console.error('Error sending message:', error)
          
          // Use fallback response for development
          const fallbackResponse = getRandomFallbackResponse()
          addMessage({
            content: fallbackResponse,
            role: 'assistant',
          })
        }
      },

      toggleVoiceMode: () => {
        set((state) => ({ isVoiceMode: !state.isVoiceMode }))
      },

      toggleMicEnabled: () => {
        set((state) => ({ isMicEnabled: !state.isMicEnabled }))
      },

      setSelectedAvatar: (avatar) => {
        set({ selectedAvatar: avatar })
      },

      setRecording: (recording) => {
        set({ isRecording: recording })
      },

      setPlaying: (playing) => {
        set({ isPlaying: playing })
      },

      endConversation: async () => {
        const { messages, sessionId } = get()
        
        if (messages.length === 0 || !sessionId) return

        try {
          const payload = {
            type: 'conversation_end',
            sessionId,
            transcript: messages.map(m => `${m.role}: ${m.content}`).join('\n'),
            finalReply: messages[messages.length - 1]?.content || '',
          }

                            // Send conversation end event (server will add security headers)
                  await fetch('/api/events', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                  })
        } catch (error) {
          console.error('Error ending conversation:', error)
        }
      },

      clearMessages: () => {
        set({ messages: [] })
      },

      sendEvent: async (type: string, payload: any) => {
        try {
          const eventPayload = {
            type,
            ...payload,
          }

                            await fetch('/api/events', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(eventPayload),
                  })
        } catch (error) {
          console.error('Error sending event:', error)
        }
      },
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({
        sessionId: state.sessionId,
        selectedAvatar: state.selectedAvatar,
        isVoiceMode: state.isVoiceMode,
        isMicEnabled: state.isMicEnabled,
      }),
    }
  )
)
