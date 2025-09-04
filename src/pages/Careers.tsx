import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const Careers = () => {
  const openPositions = [
    {
      title: "Senior AI Engineer",
      location: "Remote / Lagos",
      type: "Full-time",
      description: "Lead the development of our voice AI infrastructure and conversational agents."
    },
    {
      title: "Frontend Developer",
      location: "Remote / Lagos", 
      type: "Full-time",
      description: "Build beautiful, responsive interfaces for our voice AI platform."
    },
    {
      title: "DevOps Engineer",
      location: "Remote / Lagos",
      type: "Full-time", 
      description: "Scale our infrastructure and ensure 99.9% uptime for our AI services."
    },
    {
      title: "Product Manager",
      location: "Remote / Lagos",
      type: "Full-time",
      description: "Shape the future of conversational AI and drive product strategy."
    }
  ]

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
              Join the <span className="text-gold">ODIADEV</span> Team
            </h1>
            <p className="text-xl text-stone leading-relaxed mb-8">
              Help us build the future of conversational AI. We're looking for passionate 
              individuals who want to make a real impact.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why Work With Us */}
      <section className="py-20">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-serif font-bold text-navy mb-6">
              Why Work With Us?
            </h2>
            <p className="text-xl text-stone max-w-3xl mx-auto">
              We're building something revolutionary, and we need the best talent to make it happen.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Remote First",
                description: "Work from anywhere in the world with flexible hours and async collaboration."
              },
              {
                title: "Cutting Edge Tech",
                description: "Work with the latest AI technologies and shape the future of conversational commerce."
              },
              {
                title: "Growth Opportunities",
                description: "Rapid career growth in a fast-moving startup environment with learning budgets."
              },
              {
                title: "Impact Driven",
                description: "Make a real difference by bringing AI technology to businesses across Africa."
              }
            ].map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-lg border border-gold/10"
              >
                <h3 className="text-xl font-serif font-semibold text-navy mb-3">
                  {benefit.title}
                </h3>
                <p className="text-stone leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20 bg-stone/5">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-serif font-bold text-navy mb-6">
              Open Positions
            </h2>
            <p className="text-xl text-stone max-w-3xl mx-auto">
              Ready to join our mission? Check out our current openings.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-6">
            {openPositions.map((position, index) => (
              <motion.div
                key={position.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-lg border border-gold/10 hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-serif font-semibold text-navy mb-2">
                      {position.title}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-stone">
                      <span className="flex items-center">
                        📍 {position.location}
                      </span>
                      <span className="flex items-center">
                        💼 {position.type}
                      </span>
                    </div>
                  </div>
                  <Link
                    to="/contact"
                    className="btn-primary mt-4 md:mt-0"
                  >
                    Apply Now
                  </Link>
                </div>
                <p className="text-stone leading-relaxed">
                  {position.description}
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
              Don't See Your Role?
            </h2>
            <p className="text-xl text-stone mb-8 max-w-2xl mx-auto">
              We're always looking for exceptional talent. Send us your resume and tell us 
              how you'd like to contribute to ODIADEV.
            </p>
            <Link
              to="/contact"
              className="btn-primary text-lg px-8 py-4"
            >
              Get In Touch
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Careers
