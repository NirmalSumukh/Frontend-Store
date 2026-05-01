import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
} from 'lucide-react'
import leemaLogo from '@/assets/Leema Logo.png'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerSections = {
    shop: [
      { name: 'All Products', href: '/catalog' },
      { name: 'New Arrivals', href: '/catalog?sort=newest' },
      { name: 'Best Sellers', href: '/catalog?sort=popular' },
      { name: 'Sale', href: '/deals' },
    ],
    company: [
      { name: 'About Us', href: '/about-us' },
      { name: 'CSR Policy', href: '/csr-policy' },
      // { name: 'Careers', href: '/careers' },
      // { name: 'Contact', href: '/contact-us' },
    ],
    support: [
      { name: 'Warranty Guidelines', href: '/warranty-guidelines' },
      { name: 'Track Order', href: '/account/orders' },
      { name: 'FAQ', href: '/faq' },
      // { name: 'Returns', href: '/returns' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy-policy' },
      { name: 'Terms of Service', href: '/terms-conditions' },
      { name: 'E-Waste Management', href: '/e-waste-management' },
      // { name: 'Disclaimer', href: '/disclaimer' },
    ],
  }

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ]

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'info@leemasmart.com',
      href: 'mailto:info@leemasmart.com',
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '1800 9848 8892',
      href: 'tel:180098488892',
    },
    {
      icon: MapPin,
      label: 'Address',
      value: '2nd Floor, SCO 18, Sector 12A, Gurgaon, Haryana - 122001',
      href: '#',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <footer className="bg-gradient-to-b from-dark-900 to-dark-800 border-t border-white/10">
      {/* Newsletter Section */}
      <section className="py-12 border-b border-white/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12"
          >
            <div className="max-w-2xl">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Subscribe to our newsletter
              </h3>
              <p className="text-gray-400 mb-6">
                Get the latest updates on new products and upcoming sales. Plus,
                get 10% off your first order!
              </p>

              <form className="flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-white/40 transition-colors duration-200"
                  required
                />
                <button className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group">
                  Subscribe
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Footer */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-12"
          >
            {/* Brand */}
            <motion.div variants={itemVariants} className="col-span-2 md:col-span-1">
              <Link to="/" className="inline-block mb-4 group block">
                <div className="flex items-center">
                  <img 
                    src={leemaLogo} 
                    alt="Leema Logo" 
                    className="h-12 w-auto max-w-[200px] object-contain flex-shrink-0"
                  />
                </div>
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Your trusted destination for premium tech products and
                exceptional customer service.
              </p>

              {/* Social Links */}
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200 text-gray-400 hover:text-white"
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Links Sections */}
            {Object.entries(footerSections).map(([key, links]) => (
              <motion.div key={key} variants={itemVariants}>
                <h4 className="text-white font-semibold mb-4 capitalize">
                  {key}
                </h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        to={link.href}
                        className="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center gap-2 group"
                      >
                        <span className="w-1 h-1 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}

            {/* Contact Info */}
            <motion.div variants={itemVariants}>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-3">
                {contactInfo.map((info) => (
                  <li key={info.label}>
                    <a
                      href={info.href}
                      className="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-start gap-2 group"
                    >
                      <info.icon className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-400" />
                      <div>
                        <p className="text-xs text-gray-500">{info.label}</p>
                        <p className="group-hover:text-blue-400 transition-colors duration-200">
                          {info.value}
                        </p>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8" />

          {/* Bottom Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center justify-between gap-4"
          >
            <p className="text-gray-400 text-sm text-center md:text-left">
              &copy; {currentYear} Leema Mobiles Pvt Ltd. All rights reserved.
            </p>

            <div className="flex items-center gap-6 text-sm text-gray-400">
            </div>
          </motion.div>
        </div>
      </section>
    </footer>
  )
}

export default Footer
