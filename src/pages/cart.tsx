import { Link } from 'react-router-dom'
import { useCart } from '@hooks/useCart'
import CartItem from '@components/cart/CartItem'
import CartSummary from '@components/cart/CartSummary'
import EmptyCart from '@components/cart/EmptyCart'
import { ShoppingBagIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'

const CartPage = () => {
  const { items, getTotalItems } = useCart()

  if (items.length === 0) {
    return <EmptyCart />
  }

  return (
    <div className="container-custom pt-28 pb-12 md:pt-32">
      {/* Header */}
      {/* ✅ FIX: Added flex-wrap, gap-4, and min-w-0 to prevent pushing elements off-screen */}
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div className="flex items-center space-x-3 min-w-0">
          <ShoppingBagIcon className="h-7 w-7 sm:h-8 sm:w-8 text-gray-900 flex-shrink-0" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">
            Shopping Cart ({getTotalItems()})
          </h1>
        </div>

        {/* ✅ FIX: Redesigned as a modern interactive button. Removed 'hidden' so it appears on mobile. */}
        <Link
          to="/catalog"
          className="group flex items-center gap-2 bg-white border-2 border-gray-100 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:text-[#f97316] hover:border-orange-200 hover:bg-orange-50 transition-all whitespace-nowrap shrink-0"
        >
          <ArrowLeftIcon className="h-4 w-4 sm:h-5 sm:w-5 group-hover:-translate-x-1 transition-transform" />
          <span>Continue Shopping</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.variantId} className="card p-4 sm:p-6">
              <CartItem item={item} />
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <div className="card p-4 sm:p-6 sticky top-24 lg:top-32">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
            <CartSummary />
            <div className="mt-4 space-y-3">
              <Link to="/catalog" className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold text-center py-3 rounded-xl transition-colors">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage