import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 text-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">
              About <span className="text-gold">ODIADEV</span>
            </h1>
            <p className="text-xl text-stone leading-relaxed mb-8">
              We're building the future of conversational commerce with Nigerian excellence and global reach.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-serif font-bold text-navy mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-stone leading-relaxed mb-6">
                ODIADEV is revolutionizing how businesses communicate with their customers through 
                intelligent voice AI agents. We believe that every business deserves access to 
                premium conversational AI technology.
              </p>
              <p className="text-lg text-stone leading-relaxed">
                Our platform combines cutting-edge AI with deep understanding of African markets, 
                creating voice agents that speak your customers' language—literally and figuratively.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-gradient-to-br from-gold/10 to-gold/5 p-8 rounded-2xl"
            >
              <h3 className="text-2xl font-serif font-semibold text-navy mb-4">
                Why Voice AI?
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-gold rounded-full mt-2"></div>
                  <span className="text-stone">Natural, human-like conversations</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-gold rounded-full mt-2"></div>
                  <span className="text-stone">24/7 availability across all channels</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-gold rounded-full mt-2"></div>
                  <span className="text-stone">Scalable customer support</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-gold rounded-full mt-2"></div>
                  <span className="text-stone">Multilingual capabilities</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-stone/5">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-serif font-bold text-navy mb-6">
              Our Values
            </h2>
            <p className="text-xl text-stone max-w-3xl mx-auto">
              These principles guide everything we do at ODIADEV
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Excellence",
                description: "We deliver premium quality voice AI solutions that exceed expectations and drive real business results."
              },
              {
                title: "Innovation",
                description: "We continuously push the boundaries of what's possible with conversational AI technology."
              },
              {
                title: "Accessibility",
                description: "We make advanced AI technology accessible to businesses of all sizes across Africa and beyond."
              }
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="bg-white p-8 rounded-2xl shadow-lg"
              >
                <h3 className="text-2xl font-serif font-semibold text-navy mb-4">
                  {value.title}
                </h3>
                <p className="text-stone leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center bg-gradient-to-r from-gold/10 to-gold/5 p-12 rounded-3xl"
          >
            <h2 className="text-4xl font-serif font-bold text-navy mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-stone mb-8 max-w-2xl mx-auto">
              Join the conversation revolution. Let's build something amazing together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="btn-primary text-lg px-8 py-4"
              >
                Get Started
              </Link>
              <Link
                to="/pricing"
                className="btn-ghost text-lg px-8 py-4"
              >
                View Pricing
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default About
