import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

const PremiumHero = () => {
  const heroRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!heroRef.current || !textRef.current || !ctaRef.current) return

    // Parallax background effect
    gsap.to(heroRef.current, {
      yPercent: -10,
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    })

    // Text animation
    const tl = gsap.timeline({ delay: 0.5 })
    tl.fromTo(
      textRef.current.children,
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
      }
    )

    // CTA animation
    gsap.fromTo(
      ctaRef.current.children,
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        delay: 1.2,
        ease: 'power2.out',
      }
    )
  }, [])

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-navy via-navy-700 to-ink"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0 bg-repeat"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C8A862' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
      </div>

      {/* Gold Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent"></div>

      <div className="container-custom relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Content */}
          <div ref={textRef}>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-6xl lg:text-7xl font-serif font-medium text-white mb-6 leading-tight"
            >
              The Pursuit of{' '}
              <span className="text-gradient">Conversational</span>{' '}
              Excellence.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-mist mb-8 leading-relaxed max-w-3xl mx-auto"
            >
              ODIADEV builds the voice AI infrastructure that powers WhatsApp, 
              Telegram and Web agents — fast, reliable, and truly Nigerian-built.
            </motion.p>
          </div>

          {/* CTA Buttons */}
          <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/contact"
              className="btn-primary text-lg px-8 py-4 min-w-[200px]"
            >
              Talk to the Assistant
            </Link>
            <Link
              to="/pricing"
              className="btn-secondary text-lg px-8 py-4 min-w-[200px]"
            >
              Request a Demo
            </Link>
          </div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.5 }}
            className="mt-16 pt-8 border-t border-gold/20"
          >
            <p className="text-stone text-sm mb-6">Trusted by businesses across Nigeria</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="text-stone font-medium">Healthcare</div>
              <div className="text-stone font-medium">Education</div>
              <div className="text-stone font-medium">E-commerce</div>
              <div className="text-stone font-medium">Financial Services</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="flex flex-col items-center text-gold">
          <span className="text-sm mb-2">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-gold rounded-full flex justify-center"
          >
            <div className="w-1 h-3 bg-gold rounded-full mt-2"></div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

export default PremiumHero
