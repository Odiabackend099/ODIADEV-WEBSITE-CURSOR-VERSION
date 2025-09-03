import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import PremiumHero from '../components/ui/PremiumHero'
import ValueGrid from '../components/ui/ValueGrid'
import WhatWeDoSplit from '../components/ui/WhatWeDoSplit'
import CtaBand from '../components/ui/CtaBand'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

const Home = () => {
  useEffect(() => {
    // Initialize smooth scroll and animations
    const ctx = gsap.context(() => {
      // Set up scroll-triggered animations
      gsap.utils.toArray('.animate-on-scroll').forEach((element: any) => {
        gsap.fromTo(
          element,
          {
            opacity: 0,
            y: 50,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <div className="min-h-screen">
      <PremiumHero />
      <ValueGrid />
      <WhatWeDoSplit />
      <CtaBand />
    </div>
  )
}

export default Home
