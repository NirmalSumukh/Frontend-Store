import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { ImageWithFallback } from '@/components/product/ImageWithFallback'

interface BestProductCardProps {
  heading: string
  description: string
  image: string
  link: string
}

export default function BestProductCard({
  heading,
  description,
  image,
  link,
}: BestProductCardProps) {
  return (
    <Link to={link} className="block group h-full">
      <motion.div 
        whileHover={{ y: -5 }}
        className="bg-card rounded-3xl p-6 border-2 border-border hover:border-cyan-400 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/20 h-full flex flex-col"
      >
        <div className="mb-6 aspect-video bg-white rounded-2xl overflow-hidden relative">
          <ImageWithFallback
            src={image}
            alt={heading}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <h3 className="text-xl mb-2 text-foreground font-medium line-clamp-2">
          {heading}
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1">
          {description}
        </p>
        <span className="flex items-center gap-2 text-sm font-medium text-cyan-500 group-hover:text-cyan-400 transition-colors">
          View Product
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </span>
      </motion.div>
    </Link>
  )
}