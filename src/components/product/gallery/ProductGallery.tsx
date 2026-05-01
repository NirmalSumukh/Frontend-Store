import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSwipeable } from '@/hooks/useSwipeable'

interface ProductGalleryProps {
  images: { url: string; alt?: string }[]
  isOutOfStock?: boolean
}

export default function ProductGallery({ images, isOutOfStock = false }: ProductGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const productImages =
    images.length > 0
      ? images.map((img) => img.url)
      : ['https://placehold.co/600x600/27272a/737373?text=No+Image']

  // ✅ FIX: Reset to the first image whenever the variant (and its images) changes.
  // This prevents the gallery from crashing if you switch from a variant with 5 images to one with 2.
  useEffect(() => {
    setCurrentImageIndex(0)
  }, [images])

  const nextImage = () => {
    setDirection(1)
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length)
  }

  const prevImage = () => {
    setDirection(-1)
    setCurrentImageIndex((prev) =>
      prev === 0 ? productImages.length - 1 : prev - 1
    )
  }

  const selectImage = (index: number) => {
    setDirection(index > currentImageIndex ? 1 : -1)
    setCurrentImageIndex(index)
  }

  useEffect(() => {
    if (isHovered || productImages.length <= 1) return
    const interval = setInterval(nextImage, 4000)
    return () => clearInterval(interval)
  }, [isHovered, productImages.length])

  const swipeHandlers = useSwipeable({
    onSwipedLeft: nextImage,
    onSwipedRight: prevImage,
  })

  const slideVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? 1000 : -1000, opacity: 0 }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (direction: number) => ({ zIndex: 0, x: direction < 0 ? 1000 : -1000, opacity: 0 }),
  }

  const BRAND_ORANGE = '#f97316'

  // Styles
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    width: '100%',
  }

  const mainImageContainerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    minHeight: '400px',
    height: '500px',
    borderRadius: '16px',
    overflow: 'hidden',
    backgroundColor: '#f9fafb',
    border: '1px solid #f3f4f6'
  }

  const ribbonStyle: React.CSSProperties = {
    position: 'absolute',
    top: '20px',
    right: '-35px',
    width: '150px',
    backgroundColor: '#ef4444',
    color: '#ffffff',
    textAlign: 'center',
    padding: '8px 0',
    transform: 'rotate(45deg)',
    fontWeight: 'bold',
    fontSize: '14px',
    zIndex: 20,
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    letterSpacing: '1px'
  }

  const thumbnailContainerStyle: React.CSSProperties = {
    display: 'none',
    flexDirection: 'row',
    flexWrap: 'wrap', // ✅ FIX: Allows thumbnails to wrap to the next line
    width: '100%',    // ✅ FIX: Constrains the width so it doesn't break the CSS grid
    gap: '12px',
    padding: '4px',
  }

  const thumbnailButtonStyle = (isActive: boolean): React.CSSProperties => ({
    width: '80px',
    height: '80px',
    flexShrink: 0,
    padding: 0,
    border: isActive ? `2px solid ${BRAND_ORANGE}` : '2px solid #e5e7eb',
    borderRadius: '12px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backgroundColor: '#ffffff',
    opacity: isOutOfStock ? 0.6 : 1
  })

  const dotContainerStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '8px',
    zIndex: 10,
    padding: '8px 12px',
    backgroundColor: 'rgba(255,255,255,0.8)',
    backdropFilter: 'blur(4px)',
    borderRadius: '20px'
  }

  const dotStyle = (isActive: boolean): React.CSSProperties => ({
    width: isActive ? '24px' : '8px',
    height: '4px',
    borderRadius: '2px',
    backgroundColor: isActive ? BRAND_ORANGE : '#d1d5db',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    border: 'none',
    padding: 0,
  })

  return (
    <>
      <style>
        {`
          @media (min-width: 1024px) {
            .gallery-container {
              height: 600px !important;
            }
            .thumbnail-row {
              display: flex !important;
            }
            .dot-indicators {
              display: none !important;
            }
          }
        `}
      </style>

      <div style={containerStyle}>
        {/* Main Image */}
        <div
          {...swipeHandlers}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="gallery-container"
          style={mainImageContainerStyle}
        >
          {isOutOfStock && (
            <div style={ribbonStyle}>
              OUT OF STOCK
            </div>
          )}

          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentImageIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              style={{
                position: 'absolute',
                inset: 0,
                filter: isOutOfStock ? 'grayscale(100%)' : 'none',
                opacity: isOutOfStock ? 0.8 : 1
              }}
            >
              <img
                src={productImages[currentImageIndex]}
                alt="Product main view"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            </motion.div>
          </AnimatePresence>

          {/* Dot Indicators - Mobile Only */}
          {productImages.length > 1 && (
            <div className="dot-indicators" style={dotContainerStyle}>
              {productImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => selectImage(index)}
                  style={dotStyle(currentImageIndex === index)}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Thumbnails Row - Desktop Only */}
        <div className="thumbnail-row" style={thumbnailContainerStyle}>
          {productImages.map((image, index) => (
            <button
              key={index}
              onClick={() => selectImage(index)}
              style={thumbnailButtonStyle(currentImageIndex === index)}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  display: 'block',
                  filter: isOutOfStock ? 'grayscale(100%)' : 'none'
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </>
  )
}