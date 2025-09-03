import { Link } from 'react-router-dom'


const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    company: [
      { name: 'About', path: '/about' },
      { name: 'Careers', path: '/careers' },
      { name: 'Contact', path: '/contact' },
    ],
    legal: [
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Terms of Service', path: '/terms' },
    ],
    social: [
      { name: 'LinkedIn', url: 'https://linkedin.com/company/odiadev' },
    ],
  }

  return (
    <footer className="bg-navy-900 text-white">
      <div className="container-custom">
        {/* Main Footer Content */}
        <div className="py-16 border-b border-gold/20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="lg:col-span-2">
              <Link to="/" className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center">
                  <span className="text-navy font-bold text-lg">O</span>
                </div>
                <span className="text-2xl font-serif font-semibold text-white">
                  ODIADEV
                </span>
              </Link>
              <p className="text-stone text-lg leading-relaxed max-w-md">
                Voice AI Infrastructure for Real Business. Building the future of 
                conversational commerce with Nigerian excellence and global reach.
              </p>
              <div className="mt-6">
                <p className="text-gold font-medium mb-2">Ready to hear your business speak?</p>
                <Link
                  to="/contact"
                  className="btn-primary text-sm"
                >
                  Start Your Journey
                </Link>
              </div>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-lg font-serif font-semibold text-gold mb-4">
                Company
              </h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-stone hover:text-gold transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="text-lg font-serif font-semibold text-gold mb-4">
                Legal
              </h3>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-stone hover:text-gold transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-stone text-sm">
            © {currentYear} ODIADEV. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            {footerLinks.social.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone hover:text-gold transition-colors duration-300"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
