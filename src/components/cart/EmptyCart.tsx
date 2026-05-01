import { Link } from 'react-router-dom'
import { ShoppingBagIcon } from '@heroicons/react/24/outline'

const EmptyCart = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md px-6">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-gray-100 p-6">
            <ShoppingBagIcon className="h-24 w-24 text-gray-400" />
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Your cart is empty
        </h2>

        {/* Description */}
        <p className="text-gray-600 mb-8">
          Looks like you haven't added anything to your cart yet. Start shopping and
          discover amazing products!
        </p>

        {/* CTA Button */}
        <Link
          to="/catalog"
          className="inline-block btn-primary px-8 py-4"
        >
          Start Shopping
        </Link>

        {/* Additional Links */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center text-sm">
          <Link
            to="/account/orders"
            className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            View Order History
          </Link>
          <span className="hidden sm:block text-gray-400">•</span>
          <Link
            to="/account/wishlist"
            className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            Check Wishlist
          </Link>
        </div>

        {/* Featured Categories */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            POPULAR CATEGORIES
          </h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {['Electronics', 'Fashion', 'Home & Living', 'Beauty', 'Sports'].map(
              (category) => (
                <Link
                  key={category}
                  to={`/catalog?category=${category.toLowerCase()}`}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition-colors"
                >
                  {category}
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmptyCart
