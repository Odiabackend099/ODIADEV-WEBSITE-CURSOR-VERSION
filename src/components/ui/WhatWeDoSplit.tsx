import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const WhatWeDoSplit = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const features = [
    {
      title: 'We are your Voice AI Operations Team.',
      description: 'From design to deployment, we deliver voice-enabled agents tuned for sales, support and operations. Start manually, template later, scale when ready.',
      image: '/assets/hero/voice-abstract.jpg',
      reverse: false,
    },
    {
      title: 'Built for Nigerian Businesses',
      description: 'Understanding local context, language nuances, and business practices. Our agents speak your customers\' language, literally and figuratively.',
      image: '/assets/hero/nigerian-business.jpg',
      reverse: true,
    },
    {
      title: 'Enterprise-Grade Infrastructure',
      description: 'Scalable, secure, and reliable. From startup to enterprise, our infrastructure grows with your business needs.',
      image: '/assets/hero/infrastructure.jpg',
      reverse: false,
    },
  ]

  return (
    <section className="section-padding">
      <div className="container-custom">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            ref={index === 0 ? ref : null}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            className={`flex flex-col ${
              feature.reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'
            } items-center gap-12 mb-24 last:mb-0`}
          >
            {/* Content */}
            <div className="flex-1">
              <h2 className="text-4xl md:text-5xl font-serif font-medium text-navy mb-6 leading-tight">
                {feature.title}
              </h2>
              <p className="text-xl text-stone leading-relaxed mb-8">
                {feature.description}
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gold rounded-full"></div>
                  <span className="text-stone">Custom voice training</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gold rounded-full"></div>
                  <span className="text-stone">Multi-channel deployment</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gold rounded-full"></div>
                  <span className="text-stone">24/7 monitoring & support</span>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="flex-1">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="relative rounded-2xl overflow-hidden shadow-2xl"
              >
                <div className="aspect-[4/3] bg-gradient-to-br from-navy to-navy-700 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    </div>
                    <p className="text-gold font-medium">Feature Image</p>
                    <p className="text-sm text-mist">Coming Soon</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default WhatWeDoSplit
