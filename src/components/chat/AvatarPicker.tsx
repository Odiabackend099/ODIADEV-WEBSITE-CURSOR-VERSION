import { motion } from 'framer-motion'
import { useChatStore } from '../../store/chatStore'

const AvatarPicker = () => {
  const { selectedAvatar, setSelectedAvatar } = useChatStore()

  const avatars = [
    {
      id: 'naija_female_warm',
      name: 'Amina',
      voiceId: 'naija_female_warm',
      description: 'Warm Nigerian female voice',
      image: '/avatars/amina.svg',
      accent: 'nigerian' as const,
      gender: 'female' as const,
    },
    {
      id: 'naija_male_clear',
      name: 'Chinedu',
      voiceId: 'naija_male_clear',
      description: 'Clear Nigerian male voice',
      image: '/avatars/chinedu.svg',
      accent: 'nigerian' as const,
      gender: 'male' as const,
    },
    {
      id: 'us_female_crisp',
      name: 'Sarah',
      voiceId: 'us_female_crisp',
      description: 'Crisp US female voice',
      image: '/avatars/sarah.svg',
      accent: 'us' as const,
      gender: 'female' as const,
    },
    {
      id: 'us_male_calm',
      name: 'David',
      voiceId: 'us_male_calm',
      description: 'Calm US male voice',
      image: '/avatars/david.svg',
      accent: 'us' as const,
      gender: 'male' as const,
    },
  ]

  return (
    <div>
      <h4 className="text-sm font-medium text-navy mb-3">Choose Your Assistant</h4>
      <div className="grid grid-cols-2 gap-2">
        {avatars.map((avatar) => (
          <motion.button
            key={avatar.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedAvatar(avatar)}
            className={`p-3 rounded-lg border-2 transition-all duration-200 ${
              selectedAvatar?.id === avatar.id
                ? 'border-gold bg-gold/10'
                : 'border-mist/30 hover:border-gold/50'
            }`}
          >
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                avatar.gender === 'female' 
                  ? 'bg-pink-100 text-pink-600' 
                  : 'bg-blue-100 text-blue-600'
              }`}>
                {avatar.name.charAt(0)}
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-navy">{avatar.name}</div>
                <div className="text-xs text-stone">{avatar.accent}</div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

export default AvatarPicker
