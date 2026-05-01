import { Link } from 'react-router-dom'
import { TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline'
import { useCart } from '@hooks/useCart'
import toast from 'react-hot-toast'

interface CartItemProps {
  item: {
    id: string
    variantId: string
    productId: string
    name: string
    slug: string
    price: number
    quantity: number
    thumbnail: string
    variant: {
      name: string
      attributes: Record<string, string>
    }
  }
}

const CartItem = ({ item }: CartItemProps) => {
  const { updateQuantity, removeItem } = useCart()

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount)
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemove()
      return
    }
    if (newQuantity > 10) {
      toast.error('Maximum quantity is 10')
      return
    }
    updateQuantity(item.variantId, newQuantity)
  }

  const handleRemove = () => {
    removeItem(item.variantId)
    toast.success('Item removed from cart')
  }

  const subtotal = item.price * item.quantity

  return (
    // ✅ FIX: Reduced gap spacing slightly for narrow phones
    <div className="flex space-x-3 sm:space-x-4">
      {/* Product Image */}
      <Link
        to={`/product/${item.slug}`}
        className="flex-shrink-0"
      >
        {/* ✅ FIX: Shrinks image to w-20 h-20 on mobile, stays w-24 on desktop */}
        <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
          {item.thumbnail ? (
            <img
              src={item.thumbnail}
              alt={item.name}
              className="h-full w-full object-cover hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-gray-400">
              <span className="text-2xl sm:text-3xl">📦</span>
            </div>
          )}
        </div>
      </Link>

      {/* Product Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5 sm:py-1">

        {/* ✅ FIX: Grouped Title and Delete Icon together at the top to save vertical space */}
        <div className="flex justify-between items-start gap-2">
          <div className="min-w-0">
            <Link
              to={`/product/${item.slug}`}
              className="text-sm font-bold text-gray-900 hover:text-[#f97316] line-clamp-2 transition-colors leading-snug"
            >
              {item.name}
            </Link>

            {/* Variant Info */}
            {item.variant.name !== 'Default' && (
              <p className="text-xs text-gray-500 mt-1 font-medium truncate">
                Variant: {item.variant.name}
              </p>
            )}

            {/* Attributes */}
            {Object.keys(item.variant.attributes).length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1.5">
                {Object.entries(item.variant.attributes).map(([key, value]) => (
                  <span
                    key={key}
                    className="text-[9px] sm:text-[10px] font-semibold tracking-wide uppercase bg-gray-100 text-gray-600 px-1.5 sm:px-2 py-0.5 rounded-md"
                  >
                    {value}
                  </span>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleRemove}
            className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors p-1 -mt-1 -mr-1"
            aria-label="Remove item"
          >
            <TrashIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>

        {/* Price and Quantity Controls */}
        {/* ✅ FIX: Added flex-wrap and gap-2 so controls neatly stack instead of overlapping on Z Fold 5 */}
        <div className="flex items-center justify-between mt-2 sm:mt-3 flex-wrap gap-2">

          <div className="flex items-center border border-gray-200 rounded-lg bg-white shadow-sm flex-shrink-0">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              className="p-1 sm:p-1.5 text-gray-500 hover:text-[#f97316] hover:bg-orange-50 rounded-l-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={item.quantity <= 1}
              aria-label="Decrease quantity"
            >
              <MinusIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            </button>

            <input
              type="number"
              value={item.quantity}
              readOnly
              className="w-6 sm:w-8 text-center text-xs sm:text-sm font-bold text-gray-800 border-0 focus:ring-0 p-0 bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none cursor-default"
              aria-label={`Quantity for ${item.name}`}
            />

            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              className="p-1 sm:p-1.5 text-gray-500 hover:text-[#f97316] hover:bg-orange-50 rounded-r-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={item.quantity >= 10}
              aria-label="Increase quantity"
            >
              <PlusIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            </button>
          </div>

          {/* Price */}
          <div className="text-right flex-shrink-0">
            <p className="text-sm font-extrabold text-[#f97316]">
              {formatPrice(subtotal)}
            </p>
            {item.quantity > 1 && (
              <p className="text-[9px] sm:text-[10px] text-gray-400 font-medium">
                {formatPrice(item.price)} each
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartItem