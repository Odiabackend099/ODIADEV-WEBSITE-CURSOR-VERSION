import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getRandomFallbackResponse } from '../config/development'
import { playDataUrl } from '../lib/audio'

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

export interface UserProfile {
  name?: string
  email?: string
  phone?: string
  businessName?: string
  industry?: string
  hasConsented: boolean
  lastVisit?: Date
}

export interface ChatState {
  sessionId: string | null
  messages: Message[]
  isVoiceMode: boolean
  isMicEnabled: boolean
  selectedAvatar: Avatar | null
  isRecording: boolean
  isPlaying: boolean
  currentAudio: HTMLAudioElement | null
  userProfile: UserProfile
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
  stopCurrentAudio: () => void
  updateUserProfile: (profile: Partial<UserProfile>) => void
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
      currentAudio: null as HTMLAudioElement | null,
      userProfile: {
        hasConsented: false,
        lastVisit: new Date(),
      },

      // Actions
      initializeSession: () => {
        const { sessionId, userProfile } = get()
        const newSessionId = sessionId || crypto.randomUUID()
        
        // Update last visit
        const updatedProfile = {
          ...userProfile,
          lastVisit: new Date(),
        }
        
        set({ sessionId: newSessionId, userProfile: updatedProfile })
        
        // Show personalized greeting for returning users
        if (userProfile.name && userProfile.hasConsented) {
          const greeting = `Welcome back, ${userProfile.name}! How can I help you today?`
          get().addMessage({
            content: greeting,
            role: 'assistant',
          })
        }
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
          // Prepare messages array for the new chat API
          const { messages } = get()
          const messagesArray = [
            ...messages,
            { role: 'user', content }
          ]

          const payload = {
            messages: messagesArray,
            sessionId,
            voiceId: selectedAvatar?.voiceId,
          }

          // Send to API (server will add security headers)
          const apiUrl = process.env.NODE_ENV === 'development' 
            ? 'http://localhost:3001/api/chat' 
            : '/api/chat'
          
          const response = await fetch(apiUrl, {
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
            content: data.reply,
            role: 'assistant',
          })

          // Generate TTS for the response if voice mode is on
          if (isVoiceMode && data.reply) {
            try {
              const ttsUrl = process.env.NODE_ENV === 'development' 
                ? 'http://localhost:3001/api/tts' 
                : '/api/tts'
              
              const ttsResponse = await fetch(ttsUrl, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  text: data.reply,
                  voice_id: selectedAvatar?.voiceId || 'naija_female_warm'
                }),
              })

              if (ttsResponse.ok) {
                const ttsData = await ttsResponse.json()
                if (ttsData.audioUrl) {
                  // Use the audio utility for reliable playback
                  playDataUrl(ttsData.audioUrl).catch(console.error)
                }
              }
            } catch (ttsError) {
              console.error('TTS Error:', ttsError)
            }
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

      stopCurrentAudio: () => {
        const { currentAudio } = get()
        if (currentAudio) {
          currentAudio.pause()
          currentAudio.currentTime = 0
          set({ currentAudio: null, isPlaying: false })
        }
      },

      updateUserProfile: (profile) => {
        set((state) => ({
          userProfile: { ...state.userProfile, ...profile }
        }))
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
                  const eventsUrl = process.env.NODE_ENV === 'development' 
                    ? 'http://localhost:3001/api/events' 
                    : '/api/events'
                  
                  await fetch(eventsUrl, {
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

                            const eventsUrl = process.env.NODE_ENV === 'development' 
                    ? 'http://localhost:3001/api/events' 
                    : '/api/events'
                  
                  await fetch(eventsUrl, {
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
