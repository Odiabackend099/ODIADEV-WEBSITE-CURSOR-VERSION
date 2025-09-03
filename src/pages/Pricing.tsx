import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const Pricing = () => {
  const tiers = [
    {
      name: 'Starter',
      price: '$25',
      ngn: '₦15,000',
      description: 'Perfect for small businesses getting started with voice AI',
      features: [
        'Web chat widget',
        'Basic voice responses',
        'Email support',
        'Up to 1,000 conversations/month',
        'Standard Nigerian voices',
      ],
      cta: 'Start Free Trial',
      popular: false,
    },
    {
      name: 'Business',
      price: '$59',
      ngn: '₦35,000',
      description: 'Ideal for growing businesses with multiple channels',
      features: [
        'WhatsApp or Telegram integration',
        'Custom voice training',
        'Intake form builder',
        'n8n automation workflows',
        'Priority support',
        'Up to 10,000 conversations/month',
      ],
      cta: 'Start Free Trial',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: '$199',
      ngn: '₦75,000',
      description: 'Full-featured solution for large organizations',
      features: [
        'All channels (WhatsApp, Telegram, Web)',
        'Custom voice development',
        'SLA guarantee',
        'Dedicated account manager',
        'Advanced analytics',
        'Unlimited conversations',
        'White-label options',
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ]

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
            Simple, Transparent Pricing
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-mist max-w-3xl mx-auto"
          >
            Choose the plan that fits your business needs. All plans include 
            our core voice AI infrastructure with no hidden fees.
          </motion.p>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative bg-white rounded-2xl p-8 shadow-lg border-2 ${
                  tier.popular ? 'border-gold' : 'border-mist/30'
                } card-hover`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gold text-navy px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-serif font-semibold text-navy mb-2">
                    {tier.name}
                  </h3>
                  <p className="text-stone mb-4">{tier.description}</p>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-navy">{tier.price}</span>
                    <span className="text-stone ml-2">/month</span>
                  </div>
                  <div className="text-sm text-stone">
                    or {tier.ngn}/month
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <div className="w-5 h-5 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-gold" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-stone text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/contact"
                  className={`block w-full text-center py-3 px-6 rounded-lg font-medium transition-all duration-300 ${
                    tier.popular
                      ? 'btn-primary'
                      : 'btn-secondary'
                  }`}
                >
                  {tier.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-mist/30">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-serif font-medium text-navy mb-6">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: 'Can I change my plan at any time?',
                answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we\'ll prorate any billing differences.',
              },
              {
                question: 'Do you offer custom voice development?',
                answer: 'Yes, our Enterprise plan includes custom voice development. We can create unique voices tailored to your brand and requirements.',
              },
              {
                question: 'What channels do you support?',
                answer: 'We support WhatsApp, Telegram, and web chat widgets. The Starter plan includes web only, while Business and Enterprise include additional channels.',
              },
              {
                question: 'Is there a free trial?',
                answer: 'Yes, all plans come with a 14-day free trial. No credit card required to get started.',
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-lg p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-navy mb-3">{faq.question}</h3>
                <p className="text-stone">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Pricing
