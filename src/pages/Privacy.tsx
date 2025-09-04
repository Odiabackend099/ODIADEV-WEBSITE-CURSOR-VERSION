import { motion } from 'framer-motion'

const Privacy = () => {
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
              Privacy Policy
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
                Information We Collect
              </h2>
              <p className="text-stone leading-relaxed mb-6">
                ODIADEV collects information you provide directly to us, such as when you create an account, 
                use our services, or contact us for support. This may include:
              </p>
              <ul className="list-disc list-inside text-stone mb-8 space-y-2">
                <li>Name, email address, and contact information</li>
                <li>Business information and use case details</li>
                <li>Voice recordings and conversation transcripts</li>
                <li>Usage data and analytics</li>
                <li>Payment and billing information</li>
              </ul>

              <h2 className="text-3xl font-serif font-bold text-navy mb-6">
                How We Use Your Information
              </h2>
              <p className="text-stone leading-relaxed mb-6">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-stone mb-8 space-y-2">
                <li>Provide, maintain, and improve our voice AI services</li>
                <li>Process transactions and send related information</li>
                <li>Send technical notices, updates, and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Develop new products and services</li>
              </ul>

              <h2 className="text-3xl font-serif font-bold text-navy mb-6">
                Information Sharing
              </h2>
              <p className="text-stone leading-relaxed mb-6">
                We do not sell, trade, or otherwise transfer your personal information to third parties 
                without your consent, except as described in this policy. We may share your information:
              </p>
              <ul className="list-disc list-inside text-stone mb-8 space-y-2">
                <li>With service providers who assist us in operating our platform</li>
                <li>When required by law or to protect our rights</li>
                <li>In connection with a business transfer or acquisition</li>
                <li>With your explicit consent</li>
              </ul>

              <h2 className="text-3xl font-serif font-bold text-navy mb-6">
                Data Security
              </h2>
              <p className="text-stone leading-relaxed mb-6">
                We implement appropriate technical and organizational measures to protect your personal 
                information against unauthorized access, alteration, disclosure, or destruction. This includes:
              </p>
              <ul className="list-disc list-inside text-stone mb-8 space-y-2">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication</li>
                <li>Secure data centers and infrastructure</li>
              </ul>

              <h2 className="text-3xl font-serif font-bold text-navy mb-6">
                Your Rights
              </h2>
              <p className="text-stone leading-relaxed mb-6">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-stone mb-8 space-y-2">
                <li>Access and update your personal information</li>
                <li>Request deletion of your data</li>
                <li>Opt out of marketing communications</li>
                <li>Data portability</li>
                <li>Withdraw consent where applicable</li>
              </ul>

              <h2 className="text-3xl font-serif font-bold text-navy mb-6">
                Contact Us
              </h2>
              <p className="text-stone leading-relaxed mb-6">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <div className="bg-stone/5 p-6 rounded-lg">
                <p className="text-stone">
                  <strong>Email:</strong> privacy@odia.dev<br />
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

export default Privacy
