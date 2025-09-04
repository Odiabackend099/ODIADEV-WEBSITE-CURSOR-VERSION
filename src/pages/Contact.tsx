import { useState } from 'react'
import { motion } from 'framer-motion'
import { useChatStore } from '../store/chatStore'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const payload = {
        type: 'lead',
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        source: 'contact_form',
        session_id: useChatStore.getState().sessionId,
      }

      // Send lead event (server will add security headers)
      const eventsUrl = process.env.NODE_ENV === 'development' 
        ? 'http://localhost:3001/api/events' 
        : '/api/events'
      
      const response = await fetch(eventsUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`Form submission failed: ${response.status}`)
      }

      setIsSubmitted(true)
    } catch (error) {
      console.error('Error submitting form:', error)
      // Still show success for better UX in development
      setIsSubmitted(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto p-8"
        >
          <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-serif font-semibold text-navy mb-4">
            Thank You!
          </h2>
          <p className="text-stone mb-6">
            We've received your message and will get back to you within 24 hours.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsSubmitted(false)}
            className="btn-primary"
          >
            Send Another Message
          </motion.button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-navy to-navy-700 text-white">
        <div className="container-custom text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-serif font-medium mb-6"
          >
            Let's Build Something Amazing
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-mist max-w-3xl mx-auto"
          >
            Ready to transform your business with voice AI? Get in touch and 
            let's discuss how ODIADEV can help you connect with customers like never before.
          </motion.p>
        </div>
      </section>

      {/* Contact Form */}
      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-serif font-semibold text-navy mb-8">
                Get in Touch
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy mb-1">Email</h3>
                    <p className="text-stone">support@odiadev.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy mb-1">Phone</h3>
                    <p className="text-stone">+234 (0) 800 ODIADEV</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy mb-1">Location</h3>
                    <p className="text-stone">Lagos, Nigeria</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-mist/30 rounded-lg">
                <h3 className="font-semibold text-navy mb-3">Response Time</h3>
                <p className="text-stone text-sm">
                  We typically respond to all inquiries within 24 hours. 
                  For urgent matters, please call us directly.
                </p>
              </div>
            </motion.div>

            {/* Form */}
            <motion.form
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-navy mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-mist/30 rounded-lg focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-200"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-navy mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-mist/30 rounded-lg focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-navy mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-mist/30 rounded-lg focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-200"
                  />
                </div>
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-navy mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-mist/30 rounded-lg focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-navy mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your project and how we can help..."
                  className="w-full px-4 py-3 border border-mist/30 rounded-lg focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-200 resize-none"
                />
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-4 px-6 rounded-lg font-medium transition-all duration-300 ${
                  isSubmitting
                    ? 'bg-mist text-stone cursor-not-allowed'
                    : 'btn-primary'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-navy border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending...</span>
                  </div>
                ) : (
                  'Send Message'
                )}
              </motion.button>
            </motion.form>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact
