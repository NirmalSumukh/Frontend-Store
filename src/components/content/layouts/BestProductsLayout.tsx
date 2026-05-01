// src/components/content/layouts/BestProductsLayout.tsx
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { BestProductCard as BestProductCardType } from '@/hooks/useHomepageContent'
import BestProductCard from './BestProductCard'

interface BestProductsLayoutProps {
  cards: BestProductCardType[]
  loading: boolean
}

export default function BestProductsLayout({
  cards,
  loading,
}: BestProductsLayoutProps) {
  
  const renderSkeletons = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-card rounded-3xl p-6 border-2 border-border h-[400px]">
          <div className="mb-6 aspect-video bg-accent rounded-2xl animate-pulse" />
          <div className="h-6 w-3/4 bg-accent rounded-lg mb-4 animate-pulse" />
          <div className="h-4 w-full bg-accent rounded-lg mb-2 animate-pulse" />
          <div className="h-4 w-2/3 bg-accent rounded-lg animate-pulse" />
        </div>
      ))}
    </div>
  )

  if (loading && cards.length === 0) {
    return (
      <section className="py-16 bg-accent">
        <div className="container mx-auto px-4">
          {renderSkeletons()}
        </div>
      </section>
    )
  }

  if (cards.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-accent">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-600/20 rounded-full mb-4">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-medium text-yellow-400">
              Featured For You
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Our Best Picks
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <BestProductCard
                heading={card.heading}
                description={card.description}
                image={card.image}
                link={card.link}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}