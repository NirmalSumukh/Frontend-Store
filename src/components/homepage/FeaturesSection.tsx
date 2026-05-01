import { motion } from 'framer-motion'
import { Truck, Shield, CreditCard } from 'lucide-react'

export default function FeaturesSection() {
  const features = [
    {
      icon: <Truck className="w-6 h-6" />,
      title: 'Free Shipping',
      description: 'All over India',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: '2 Year Warranty',
      description: 'On all products',
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: 'Secure Payment',
      description: '100% protected',
    },
  ]

  return (
    <section className="py-12 border-y border-gray-200 bg-[#F8F8F8]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 p-6 rounded-xl bg-white border border-gray-100 hover:border-gray-200 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <div className="p-3 bg-gray-100 rounded-lg text-[#4A4A4A]">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#222222]">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}