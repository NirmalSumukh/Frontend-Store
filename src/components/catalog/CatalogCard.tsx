import { useMemo, MouseEvent } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { useCart } from '@/hooks/useCart'
import { calculateDiscountPercentage } from '@/types/pricing'

interface TransformedProduct {
  id: string
  productId?: string
  variantId?: string | null
  variantName?: string | null
  name: string
  slug: string
  price: number
  undiscountedPrice?: number // Needed for anchor pricing
  currency: string
  thumbnail: string
  quantityAvailable?: number
  specs?: { label: string; value: string }[]
}

interface CatalogCardProps {
  product: TransformedProduct
  onAddToCart?: (e: MouseEvent<HTMLButtonElement>) => void
}

export default function CatalogCard({ product, onAddToCart }: CatalogCardProps) {
  const { addItem, toggleCart } = useCart()

  const {
    name,
    slug,
    price,
    undiscountedPrice,
    currency,
    thumbnail,
    specs = [],
    variantId,
    productId,
    variantName,
    quantityAvailable = 0,
  } = product

  // ==============================
  // LOGIC: Discount & Stock
  // ==============================

  const isOutOfStock = quantityAvailable <= 0
  const isLowStock = quantityAvailable > 0 && quantityAvailable < 10

  // Check if we actually have a discount
  const hasDiscount = undiscountedPrice && undiscountedPrice > price

  // Calculate percentage off using the imported utility function
  const discountPercentage = useMemo(() => {
    if (!hasDiscount || !undiscountedPrice) return 0
    return calculateDiscountPercentage(undiscountedPrice, price)
  }, [price, undiscountedPrice, hasDiscount])

  // Format Current Price
  const formattedPrice = useMemo(() => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(price)
  }, [price, currency])

  // Format Original Price (Anchor)
  const formattedUndiscountedPrice = useMemo(() => {
    if (!undiscountedPrice) return null
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(undiscountedPrice)
  }, [undiscountedPrice, currency])

  // ==============================
  // HANDLERS
  // ==============================

  const handleAddToCart = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (isOutOfStock) return

    if (onAddToCart) {
      onAddToCart(e)
      return
    }

    const idToAdd = variantId || product.id
    addItem({
      id: idToAdd,
      variantId: idToAdd,
      productId: productId || product.id,
      name: name,
      slug: slug,
      price: price,
      quantity: 1,
      thumbnail: thumbnail,
      variant: {
        name: variantName || 'Default',
        attributes: specs.reduce(
          (acc: Record<string, string>, spec) => {
            acc[spec.label] = spec.value
            return acc
          },
          {}
        ),
      },
    })
    toast.success('Added to cart!')
    toggleCart()
  }

  const productDetailUrl = `/product/${slug}?variant=${variantId || product.id}`

  return (
    <div
      className={`group bg-white rounded-2xl transition-all duration-300 relative overflow-hidden
      ${isOutOfStock ? 'opacity-75 grayscale' : 'hover:shadow-xl hover:-translate-y-1 shadow-sm'}`}
    >
      <Link
        to={productDetailUrl}
        className={`block relative overflow-hidden ${isOutOfStock ? 'pointer-events-none' : ''}`}
      >
        <div className="w-full h-[280px] bg-[#fafafa] flex items-center justify-center p-6 relative">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={name}
              className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <span className="text-gray-300">No image</span>
          )}

          {/* ============================== */}
          {/* BADGES SECTION              */}
          {/* ============================== */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 items-start">

            {/* 1. DISCOUNT BADGE (New) */}
            {hasDiscount && !isOutOfStock && (
              <span className="bg-rose-600 text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full shadow-sm">
                -{discountPercentage}%
              </span>
            )}

            {/* 2. STOCK BADGES */}
            {isOutOfStock && (
              <span className="bg-gray-900 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded">
                Sold Out
              </span>
            )}
            {isLowStock && !isOutOfStock && (
              <span className="bg-orange-100 text-orange-700 px-3 py-1 text-xs font-bold rounded">
                Low Stock
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Content Area */}
      <div className="p-5">
        <div className="mb-4">
          <Link
            to={productDetailUrl}
            className={isOutOfStock ? 'pointer-events-none' : ''}
          >
            <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1 group-hover:text-orange-600 transition-colors line-clamp-2">
              {name}
            </h3>
          </Link>
          <p className="text-sm text-gray-500 font-medium">
            {variantName || (specs.length > 0 ? specs.map(s => s.value).join(' · ') : 'Base Model')}
          </p>
        </div>

        {/* Specs Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {specs.slice(0, 3).map((spec, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-semibold uppercase tracking-wide rounded"
            >
              {spec.value}
            </span>
          ))}
        </div>

        <div className="flex items-end justify-between gap-4 pt-4 border-t border-gray-100">

          {/* ============================== */}
          {/* UPDATED PRICE BLOCK         */}
          {/* ============================== */}
          <div className="flex flex-col">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Price</p>

            {/* Anchor Price (Strikethrough) */}
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through font-medium mb-0.5">
                {formattedUndiscountedPrice}
              </span>
            )}

            {/* Selling Price */}
            <p className="text-xl font-extrabold text-gray-900 leading-none">
              {formattedPrice}
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center gap-3">
            <Link
              to={productDetailUrl}
              className={`text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors ${isOutOfStock ? 'pointer-events-none opacity-50' : ''}`}
            >
              View
            </Link>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`
                flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 shadow-md
                ${isOutOfStock
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-orange-500 text-white hover:bg-orange-600 hover:shadow-orange-500/30 hover:scale-105 active:scale-95'
                }
              `}
              title="Add to Cart"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}