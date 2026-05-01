import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingCart, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ImageWithFallback } from '@/components/product/ImageWithFallback'
import { useCart } from '@/hooks/useCart'
import toast from 'react-hot-toast'
import { Product } from '@/types'
import { formatPrice } from '@/lib/utils'
import { useMemo } from 'react'
import { calculateDiscountPercentage } from '@/types/pricing'

interface LatestProductCardProps {
  product: Product
}

export default function LatestProductCard({ product }: LatestProductCardProps) {
  const { addItem, toggleCart } = useCart()

  // Data Extraction
  const price = product.pricing?.priceRange?.start?.gross?.amount || 0
  const currency = product.pricing?.priceRange?.start?.gross?.currency || 'INR'
  const imageUrl = product.thumbnail?.url || 'https://via.placeholder.com/400'

  // ✅ Extract undiscounted price for discount display
  const undiscountedPrice = product.pricing?.priceRangeUndiscounted?.start?.gross?.amount

  // ✅ Check if product is on sale
  const hasDiscount = undiscountedPrice && undiscountedPrice > price

  // ✅ Calculate discount percentage
  const discountPercentage = useMemo(() => {
    if (!hasDiscount || !undiscountedPrice) return 0
    return calculateDiscountPercentage(undiscountedPrice, price)
  }, [price, undiscountedPrice, hasDiscount])

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      id: `${product.id}-default`,
      variantId: (product as any).variants?.[0]?.id || product.id,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: price,
      quantity: 1,
      thumbnail: imageUrl,
      variant: { name: 'Default', attributes: {} },
    })
    toast.success('Added to cart!')
    toggleCart()
  }

  return (
    // CHANGE: Removed initial/whileInView animations for smoother looping scrolling.
    // Kept motion.div just in case we want other spring animations later, but it acts as a standard div now.
    <motion.div
      className="w-[280px] md:w-[320px] group relative h-full"
    >
      <Link to={`/product/${product.slug}`} className="block h-full">

        {/* CARD CONTAINER */}
        {/* Added h-full and flex col to ensure uniform height alignment in Swiper */}
        <div className="h-full flex flex-col bg-[#14161B] border border-white/10 rounded-3xl p-6 transition-all duration-500 group-hover:border-[#FF6B00]/50 group-hover:bg-[#1A1C23]">

          {/* IMAGE AREA - Floating Effect */}
          {/* Added flex-grow to push content down evenly */}
          <div className="relative h-52 w-full mb-6 flex items-center justify-center flex-grow">
            {/* Glow behind image on hover */}
            <div className="absolute w-2/3 h-2/3 bg-[#FF6B00]/0 rounded-full blur-2xl group-hover:bg-[#FF6B00]/10 transition-all duration-500" />

            <ImageWithFallback
              src={imageUrl}
              alt={product.name}
              className="relative z-10 w-full h-full object-contain drop-shadow-2xl transition-transform duration-500 group-hover:-translate-y-2 group-hover:scale-105"
            />

            {/* ✅ DISCOUNT BADGE - Top Left Corner */}
            {hasDiscount && (
              <div className="absolute top-0 left-0 z-20">
                <span className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-rose-600 to-red-500 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg shadow-red-500/30">
                  -{discountPercentage}% OFF
                </span>
              </div>
            )}
          </div>

          {/* CONTENT AREA */}
          <div className="flex flex-col gap-1 mt-auto">

            {/* TITLE */}
            <h3 className="text-white font-medium text-lg leading-tight line-clamp-2 h-[3.25rem]">
              {product.name}
            </h3>

            {/* PRICE & ACTION ROW */}
            <div className="flex items-end justify-between mt-4 border-t border-white/5 pt-4">
              <div className="flex flex-col">
                <span className="text-[#9CA3AF] text-xs font-medium mb-1">Price</span>

                {/* ✅ STRIKETHROUGH ORIGINAL PRICE */}
                {hasDiscount && (
                  <span className="text-[#6B7280] text-sm line-through mb-0.5">
                    {formatPrice(undiscountedPrice, currency)}
                  </span>
                )}

                {/* CURRENT PRICE */}
                <span className="text-2xl font-bold text-[#FF6B00]">
                  {formatPrice(price, currency)}
                </span>
              </div>

              {/* ACTION ARROW */}
              <div className="flex gap-2">
                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-[#FF6B00] group-hover:bg-[#FF6B00] group-hover:text-white transition-all duration-300">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* QUICK ADD BUTTON (Floating, appears on hover) */}
      <div className="absolute top-4 right-4 opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-20">
        <Button
          onClick={handleAddToCart}
          size="icon"
          className="rounded-full bg-[#FF6B00] hover:bg-[#E56000] text-white shadow-lg shadow-orange-500/20"
        >
          <ShoppingCart className="w-4 h-4" />
        </Button>
      </div>

    </motion.div>
  )
}