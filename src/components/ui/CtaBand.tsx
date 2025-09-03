import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const CtaBand = () => {
  return (
    <section className="py-20 bg-navy text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0 bg-repeat"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C8A862' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
      </div>

      {/* Gold Accent Lines */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent"></div>

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-medium text-white mb-6 leading-tight">
            Ready to hear your business speak?
          </h2>
          <p className="text-xl text-mist mb-8 max-w-2xl mx-auto">
            Join the conversation revolution. Let's build your voice AI infrastructure 
            together and transform how you connect with customers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/contact"
              className="btn-primary text-lg px-8 py-4 min-w-[200px]"
            >
              Start Intake
            </Link>
            <Link
              to="/pricing"
              className="btn-secondary text-lg px-8 py-4 min-w-[200px]"
            >
              View Pricing
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default CtaBand
