import { Fragment, useState, useMemo } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useQuery } from '@apollo/client'
import { useCart } from '@/hooks/useCart'
import { useCheckoutLogic } from '@/hooks/useCheckoutLogic'
import { useChannel } from '@/hooks/useChannel'
import { GET_VOUCHER_PAGES } from '@/lib/content-queries'
import { TagIcon, TruckIcon, XMarkIcon, TicketIcon } from '@heroicons/react/24/outline'
import { initiateShiprocketCheckout } from '@/lib/shiprocket'

const CartSummary = () => {
  const { items, getTotalPrice } = useCart()
  const { applyVoucher, removeVoucher, promoDiscount, appliedVoucher, isApplying } = useCheckoutLogic()
  const { currentChannel } = useChannel()

  const [couponInput, setCouponInput] = useState('')
  const [showOffersModal, setShowOffersModal] = useState(false)

  // Fetch Voucher Pages (only runs when the modal is opened)
  const { data, loading } = useQuery(GET_VOUCHER_PAGES, {
    skip: !showOffersModal,
    fetchPolicy: 'cache-first'
  })

  // 1. Find the page that matches the current channel metadata
  // We look for: metadata key === 'channel' AND value === currentChannel
  const activeOfferPage = data?.pages?.edges.find((edge: any) =>
    edge.node.metadata.some((m: any) => m.key === 'channel' && m.value === currentChannel)
  )?.node

  // 2. Map the attributes into a usable list of offers
  const availableOffers = useMemo(() => {
    if (!activeOfferPage?.attributes) return []

    // Since this page is dedicated to vouchers, we can flatten all attribute values inside it.
    return activeOfferPage.attributes.flatMap((attr: any) =>
      attr.values.map((v: any) => {
        let parsedDescription = v.value
        
        if (v.richText) {
          try {
            const parsed = JSON.parse(v.richText)
            // Saleor's rich text often wraps the description in a quote block or just a paragraph
            const quoteBlock = parsed.blocks?.find((b: any) => b.type === 'quote')
            if (quoteBlock?.data?.caption) {
              parsedDescription = quoteBlock.data.caption
            } else if (parsed.blocks?.[0]?.data?.text) {
              // Fallback to the first block's text if it's not a quote
              // and the first block text is not the code itself
              const text = parsed.blocks[0].data.text
              if (text !== v.name) {
                parsedDescription = text
              } else if (parsed.blocks?.[1]?.data?.text) {
                parsedDescription = parsed.blocks[1].data.text
              }
            }
          } catch (e) {
            console.error("Failed to parse voucher richText", e)
          }
        }

        return {
          code: v.name,        // e.g., "WELCOME10"
          description: parsedDescription || "No description available"
        }
      })
    )
  }, [activeOfferPage])

  const subtotal = getTotalPrice()
  const freeShippingThreshold = 999
  const shippingCost = subtotal >= freeShippingThreshold ? 0 : 50

  const discountedSubtotal = Math.max(0, subtotal - promoDiscount)
  const total = discountedSubtotal + shippingCost

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount)
  }

  const handleApplyCoupon = async (code: string) => {
    if (!code.trim()) return
    const success = await applyVoucher(code.toUpperCase())
    if (success) {
      setCouponInput('')
      setShowOffersModal(false)
    }
  }

  const remainingForFreeShipping = freeShippingThreshold - subtotal

  return (
    <>
      <div className="space-y-5">
        {/* Free Shipping Progress */}
        {remainingForFreeShipping > 0 ? (
          <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
            <div className="flex items-center space-x-2 text-sm text-[#ea580c] mb-2">
              <TruckIcon className="h-5 w-5" />
              <span className="font-semibold">
                Add {formatPrice(remainingForFreeShipping)} more for FREE shipping!
              </span>
            </div>
            <div className="w-full bg-orange-200/50 rounded-full h-1.5">
              <div
                className="bg-[#f97316] h-1.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.min((subtotal / freeShippingThreshold) * 100, 100)}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-xl p-3">
            <div className="flex items-center space-x-2 text-sm text-green-700">
              <TruckIcon className="h-5 w-5" />
              <span className="font-bold">🎉 You unlocked FREE shipping!</span>
            </div>
          </div>
        )}

        {/* Coupon Section */}
        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-center space-x-2 mb-3">
            <TagIcon className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-bold text-gray-800">
              Apply Discount Code
            </span>
          </div>

          {appliedVoucher ? (
            <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3 shadow-sm">
              <div>
                <p className="text-sm font-bold text-green-800 flex items-center gap-2">
                  {appliedVoucher}
                  <span className="bg-green-200 text-green-800 text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider">Applied</span>
                </p>
                <p className="text-xs font-medium text-green-600 mt-0.5">
                  You saved {formatPrice(promoDiscount)}
                </p>
              </div>
              <button
                onClick={removeVoucher}
                className="text-sm text-red-500 hover:text-red-700 font-bold transition-colors"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="Enter code"
                  className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-[#f97316] focus:ring-[#f97316] sm:text-sm"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleApplyCoupon(couponInput)
                  }}
                />
                <button
                  onClick={() => handleApplyCoupon(couponInput)}
                  disabled={!couponInput.trim() || isApplying}
                  className="bg-gray-900 text-white hover:bg-gray-800 px-5 py-2 rounded-lg text-sm font-bold disabled:opacity-50 transition-colors"
                >
                  {isApplying ? '...' : 'Apply'}
                </button>
              </div>

              <button
                onClick={() => setShowOffersModal(true)}
                className="text-[#f97316] hover:text-[#ea580c] text-sm font-bold flex items-center gap-1.5 transition-colors"
              >
                <TicketIcon className="w-4 h-4" />
                View available offers
              </button>
            </div>
          )}
        </div>

        {/* Price Breakdown */}
        <div className="border-t border-gray-100 pt-4 space-y-2.5">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 font-medium">Subtotal</span>
            <span className="font-bold text-gray-800">{formatPrice(subtotal)}</span>
          </div>

          {promoDiscount > 0 && (
            <div className="flex justify-between text-sm text-green-600 font-medium">
              <span>Discount ({appliedVoucher})</span>
              <span>- {formatPrice(promoDiscount)}</span>
            </div>
          )}

          <div className="flex justify-between text-sm">
            <span className="text-gray-500 font-medium">Shipping</span>
            <span className="font-bold text-gray-800">
              {shippingCost === 0 ? (
                <span className="text-green-600">FREE</span>
              ) : (
                formatPrice(shippingCost)
              )}
            </span>
          </div>
        </div>

        {/* Total */}
        <div className="border-t border-gray-200 pt-4 pb-2">
          <div className="flex justify-between items-center">
            <span className="text-lg font-black text-gray-900">Total</span>
            <div className="text-right">
              <span className="text-2xl font-black text-[#f97316]">
                {formatPrice(total)}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={(e) => initiateShiprocketCheckout(e, items)}
            className="w-full bg-[#f97316] hover:bg-[#ea580c] text-white py-4 rounded-xl text-lg font-bold shadow-lg hover:shadow-orange-500/30 transition-all flex justify-center items-center gap-2"
          >
            Secure Checkout
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Offers Modal */}
      <Transition.Root show={showOffersModal} as={Fragment}>
        <Dialog as="div" className="relative z-[60]" onClose={setShowOffersModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end sm:items-center justify-center text-center p-0 sm:p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="translate-y-full sm:translate-y-0 sm:scale-95 sm:opacity-0"
                enterTo="translate-y-0 sm:scale-100 sm:opacity-100"
                leave="ease-in duration-200"
                leaveFrom="translate-y-0 sm:scale-100 sm:opacity-100"
                leaveTo="translate-y-full sm:translate-y-0 sm:scale-95 sm:opacity-0"
              >
                <Dialog.Panel className="relative transform overflow-hidden bg-white text-left shadow-2xl transition-all w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl flex flex-col max-h-[85vh]">

                  {/* Modal Header */}
                  <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white z-10">
                    <Dialog.Title className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                      <TicketIcon className="w-6 h-6 text-[#f97316]" />
                      Available Offers
                    </Dialog.Title>
                    <button
                      onClick={() => setShowOffersModal(false)}
                      className="text-gray-400 hover:text-gray-600 hover:bg-gray-50 p-2 rounded-full transition-colors"
                    >
                      <XMarkIcon className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Modal Body: CMS Mapped Coupons */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                    {loading ? (
                      <div className="animate-pulse space-y-4">
                        {[1, 2].map(i => (
                          <div key={i} className="bg-white h-24 rounded-2xl border border-gray-200"></div>
                        ))}
                      </div>
                    ) : availableOffers.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500 font-medium">No offers currently available for your channel.</p>
                      </div>
                    ) : (
                      availableOffers.map((offer: any, idx: number) => (
                        <div key={idx} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:border-orange-300 hover:shadow-md transition-all">
                          <div className="flex justify-between items-start mb-2">
                            {/* The 'name' from the CMS acts as the Code string */}
                            <div className="bg-orange-50 border border-orange-100 text-[#f97316] font-extrabold text-sm px-3 py-1.5 rounded-md uppercase tracking-widest">
                              {offer.code}
                            </div>
                            <button
                              onClick={() => handleApplyCoupon(offer.code)}
                              disabled={isApplying}
                              className="text-sm font-bold text-[#f97316] hover:text-[#ea580c] disabled:opacity-50 uppercase"
                            >
                              Apply
                            </button>
                          </div>
                          {/* The 'value' from the CMS acts as the Description */}
                          <p className="text-gray-600 text-sm leading-relaxed mt-3">
                            {offer.description}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}

export default CartSummary