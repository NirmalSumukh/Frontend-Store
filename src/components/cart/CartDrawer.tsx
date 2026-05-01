import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon, ShoppingBagIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'
import { useCart } from '@/hooks/useCart'
import CartItem from './CartItem'
import CartSummary from './CartSummary'

const CartDrawer = () => {
  const { items, getTotalItems, clearCart, isOpen, toggleCart } = useCart()
  const totalItems = getTotalItems()

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={toggleCart}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            {/* ✅ FIX: Removed left padding on ultra-narrow screens (pl-0 sm:pl-10) */}
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-0 sm:pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-2xl">
                    {/* Header */}
                    {/* ✅ FIX: Responsive padding (px-4 sm:px-6) */}
                    <div className="flex items-center justify-between border-b border-gray-100 px-4 sm:px-6 py-4 sm:py-5 sticky top-0 bg-white/95 backdrop-blur z-10">
                      <Dialog.Title className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2.5">
                        Your Cart
                        {totalItems > 0 && (
                          <span className="bg-orange-100 text-[#f97316] text-xs px-2.5 py-0.5 rounded-full font-bold">
                            {totalItems}
                          </span>
                        )}
                      </Dialog.Title>

                      <button
                        onClick={toggleCart}
                        className="p-2 -mr-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-all"
                        aria-label="Close cart"
                      >
                        <XMarkIcon className="h-6 w-6" />
                      </button>
                    </div>

                    {/* Cart Items */}
                    {items.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-12">
                        <div className="bg-orange-50 p-6 rounded-full mb-6">
                          <ShoppingBagIcon className="h-16 w-16 text-[#f97316]" />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 text-center">
                          Your cart is empty
                        </h3>
                        <p className="text-gray-500 text-center mb-8 font-medium text-sm sm:text-base">
                          Looks like you haven't added anything yet.
                        </p>
                        <button
                          onClick={toggleCart}
                          className="bg-[#f97316] hover:bg-[#ea580c] text-white px-8 py-3.5 rounded-full font-bold shadow-md transition-all w-full sm:w-auto"
                        >
                          Start Shopping
                        </button>
                      </div>
                    ) : (
                      <>
                        {/* Items List */}
                        <div className="flex-1 px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
                          {items.map((item) => (
                            <CartItem key={item.variantId} item={item} />
                          ))}
                        </div>

                        {/* Cart Summary & Actions */}
                        <div className="border-t border-gray-100 px-4 sm:px-6 py-4 sm:py-6 space-y-4 sticky bottom-0 bg-white shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
                          <CartSummary />

                          <div className="flex items-center justify-between pt-2">
                            <button
                              onClick={() => {
                                if (window.confirm('Are you sure you want to clear the cart?')) {
                                  clearCart()
                                }
                              }}
                              className="text-xs sm:text-sm text-gray-400 hover:text-red-500 font-semibold transition-colors underline underline-offset-4"
                            >
                              Clear Cart
                            </button>

                            <Link
                              to="/cart"
                              onClick={toggleCart}
                              className="text-xs sm:text-sm text-[#f97316] hover:text-[#ea580c] font-bold transition-colors"
                            >
                              View Full Cart &rarr;
                            </Link>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default CartDrawer