import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Copy, Tag } from 'lucide-react'
import { PopupBanner } from '@/hooks/useHomepageContent'
import toast from 'react-hot-toast'
import { Input } from '@/components/ui/input'

interface PopupBannerLayoutProps {
  banner: PopupBanner
  onClose?: () => void
}

export default function PopupBannerLayout({ banner, onClose }: PopupBannerLayoutProps) {
  const [isOpen, setIsOpen] = useState(true)

  if (!isOpen || !banner.image) {
    return null
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(banner.couponCode)
    toast.success('Coupon Code Copied!')
  }

  const handleClose = () => {
    setIsOpen(false)
    if (onClose) onClose()
  }

  return (
    <AnimatePresence>
      {/* ✅ FIX: Added a full-screen backdrop that dims the background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={handleClose} // Clicking the dark background closes the pop-up
      >
        {/* ✅ FIX: Changed animation from sliding up to a smooth "pop-in" scale effect */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md bg-white shadow-2xl rounded-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside the card
        >
          {/* Enhanced Close Button */}
          <button
            onClick={handleClose}
            type="button"
            aria-label="Close banner"
            className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-md hover:bg-white rounded-full text-gray-800 shadow-sm z-10 transition-all hover:scale-105 hover:text-red-500"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Banner Image */}
          <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] bg-gray-50">
            <img
              src={banner.image}
              alt="Special Promotion"
              className="w-full h-full object-cover"
            />
            {/* Subtle gradient overlay to blend image into the white card */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
          </div>

          {/* Upgraded Coupon Code Section */}
          {banner.couponCode && (
            <div className="p-6 bg-white">
              <div className="text-center mb-5">
                <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1 bg-orange-50 text-[#f97316] text-xs font-bold uppercase tracking-widest rounded-full mb-3 border border-orange-100">
                  <Tag className="w-3.5 h-3.5" />
                  Limited Time Offer
                </span>
                <h3 className="text-xl font-extrabold text-gray-900">Unlock Your Discount</h3>
                <p className="text-sm text-gray-500 mt-1">Use the code below at checkout to save.</p>
              </div>

              {/* Input and Button combined in a single pill shape */}
              <div className="flex items-center gap-2 p-1.5 bg-gray-50 border border-gray-200 rounded-xl">
                <Input
                  id="coupon-code"
                  readOnly
                  value={banner.couponCode}
                  className="flex-1 bg-transparent border-none text-[#f97316] font-black text-center text-lg focus-visible:ring-0 shadow-none tracking-wider"
                />
                <button
                  onClick={handleCopy}
                  type="button"
                  className="flex items-center gap-2 px-5 py-3 bg-[#f97316] hover:bg-[#ea580c] text-white font-bold rounded-lg transition-colors shadow-sm shrink-0"
                  aria-label="Copy coupon code"
                >
                  <Copy className="w-4 h-4" />
                  <span className="text-sm">Copy</span>
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}