import { motion } from 'framer-motion'

const Resources = () => {
  return (
    <div className="min-h-screen pt-20">
      <section className="section-padding">
        <div className="container-custom text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-serif font-medium text-navy mb-6"
          >
            Resources
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-stone max-w-3xl mx-auto"
          >
            Coming soon - Documentation, guides, and resources to help you get the most out of ODIADEV.
          </motion.p>
        </div>
      </section>
    </div>
  )
}

export default Resources
