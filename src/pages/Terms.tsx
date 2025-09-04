import { motion } from 'framer-motion'

const Terms = () => {
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
              Terms of Service
            </h1>
            <p className="text-xl text-stone leading-relaxed">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="prose prose-lg max-w-none"
            >
              <h2 className="text-3xl font-serif font-bold text-navy mb-6">
                Acceptance of Terms
              </h2>
              <p className="text-stone leading-relaxed mb-6">
                By accessing and using ODIADEV's services, you accept and agree to be bound by the 
                terms and provision of this agreement. If you do not agree to abide by the above, 
                please do not use this service.
              </p>

              <h2 className="text-3xl font-serif font-bold text-navy mb-6">
                Description of Service
              </h2>
              <p className="text-stone leading-relaxed mb-6">
                ODIADEV provides voice AI and conversational agent services including but not limited to:
              </p>
              <ul className="list-disc list-inside text-stone mb-8 space-y-2">
                <li>Text-to-speech (TTS) and speech-to-text (STT) services</li>
                <li>Conversational AI agents for WhatsApp, Telegram, and web platforms</li>
                <li>Voice AI infrastructure and APIs</li>
                <li>Integration and deployment services</li>
                <li>Analytics and reporting tools</li>
              </ul>

              <h2 className="text-3xl font-serif font-bold text-navy mb-6">
                User Responsibilities
              </h2>
              <p className="text-stone leading-relaxed mb-6">
                As a user of our services, you agree to:
              </p>
              <ul className="list-disc list-inside text-stone mb-8 space-y-2">
                <li>Provide accurate and complete information</li>
                <li>Use the services in compliance with applicable laws</li>
                <li>Not use the services for illegal or harmful purposes</li>
                <li>Respect intellectual property rights</li>
                <li>Maintain the security of your account credentials</li>
              </ul>

              <h2 className="text-3xl font-serif font-bold text-navy mb-6">
                Prohibited Uses
              </h2>
              <p className="text-stone leading-relaxed mb-6">
                You may not use our services for:
              </p>
              <ul className="list-disc list-inside text-stone mb-8 space-y-2">
                <li>Spam, harassment, or abusive content</li>
                <li>Violation of any applicable laws or regulations</li>
                <li>Infringement of intellectual property rights</li>
                <li>Malicious or harmful activities</li>
                <li>Attempting to gain unauthorized access to our systems</li>
              </ul>

              <h2 className="text-3xl font-serif font-bold text-navy mb-6">
                Payment Terms
              </h2>
              <p className="text-stone leading-relaxed mb-6">
                Payment terms are as follows:
              </p>
              <ul className="list-disc list-inside text-stone mb-8 space-y-2">
                <li>Fees are billed in advance on a monthly or annual basis</li>
                <li>All fees are non-refundable unless otherwise specified</li>
                <li>We reserve the right to change pricing with 30 days notice</li>
                <li>Failure to pay may result in service suspension</li>
              </ul>

              <h2 className="text-3xl font-serif font-bold text-navy mb-6">
                Intellectual Property
              </h2>
              <p className="text-stone leading-relaxed mb-6">
                ODIADEV retains all rights, title, and interest in and to our services, including all 
                intellectual property rights. You retain ownership of your content and data, but grant 
                us a license to use it as necessary to provide our services.
              </p>

              <h2 className="text-3xl font-serif font-bold text-navy mb-6">
                Limitation of Liability
              </h2>
              <p className="text-stone leading-relaxed mb-6">
                To the maximum extent permitted by law, ODIADEV shall not be liable for any indirect, 
                incidental, special, consequential, or punitive damages, including but not limited to 
                loss of profits, data, or business opportunities.
              </p>

              <h2 className="text-3xl font-serif font-bold text-navy mb-6">
                Termination
              </h2>
              <p className="text-stone leading-relaxed mb-6">
                Either party may terminate this agreement at any time. Upon termination:
              </p>
              <ul className="list-disc list-inside text-stone mb-8 space-y-2">
                <li>Your access to the services will be discontinued</li>
                <li>You remain responsible for any outstanding fees</li>
                <li>We may delete your data after a reasonable period</li>
              </ul>

              <h2 className="text-3xl font-serif font-bold text-navy mb-6">
                Contact Information
              </h2>
              <p className="text-stone leading-relaxed mb-6">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="bg-stone/5 p-6 rounded-lg">
                <p className="text-stone">
                  <strong>Email:</strong> legal@odia.dev<br />
                  <strong>Address:</strong> ODIADEV, Lagos, Nigeria
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Terms
