// src/components/content/layouts/CarouselLayout.tsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react'
import { CarouselSlide } from '../../../hooks/useHomepageContent'
import { useSwipeable } from '../../../hooks/useSwipeable' // Changed to relative path to fix resolution error

interface CarouselLayoutProps {
  slides: CarouselSlide[]
  loading: boolean
}

const DEV_SLIDES: CarouselSlide[] = [
  {
    id: 'dev-1',
    heading: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1630183477086-effc914f2aea?w=1200&h=400&fit=crop',
    mobileImage: 'https://images.unsplash.com/photo-1630183477086-effc914f2aea?w=600&h=800&fit=crop',
    link: '/catalog',
    sortOrder: 1,
  },
  {
    id: 'dev-2',
    heading: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&h=400&fit=crop',
    mobileImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=800&fit=crop',
    link: '/catalog?category=audio',
    sortOrder: 2,
  },
]

export default function CarouselLayout({
  slides: backendSlides,
  loading,
}: CarouselLayoutProps) {
  const navigate = useNavigate()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)
  const [imageLoaded, setImageLoaded] = useState<Record<number, boolean>>({})
  const [isPaused, setIsPaused] = useState(false)

  const slides = backendSlides.length > 0 ? backendSlides : DEV_SLIDES
  const shouldAutoPlay = true
  const autoPlayInterval = 5000

  // Inject custom CSS for responsive values
  const renderStyles = () => (
    <style>
      {`
        .carousel-layout-container {
          height: 450px; /* Reduced Mobile Height to remove empty space */
        }
        .carousel-heading {
          font-size: 1.8rem; /* Smaller heading for mobile */
          line-height: 1.2;
        }
        .carousel-desc {
          font-size: 0.9rem; /* Smaller description for mobile */
          line-height: 1.4;
          max-width: 90%;
        }
        .carousel-btn {
          padding: 10px 24px;
          font-size: 14px;
        }
        /* Hide nav arrows by default (mobile), show on desktop */
        .carousel-nav-arrows {
          display: none !important;
        }
        
        @media (min-width: 768px) {
          .carousel-layout-container {
            height: 850px; /* Increased Desktop Height */
          }
          .carousel-heading {
            font-size: 4.5rem;
          }
          .carousel-desc {
            font-size: 1.25rem;
            max-width: 600px;
          }
          .carousel-btn {
            padding: 14px 32px;
            font-size: 16px;
          }
          /* Show arrows on desktop */
          .carousel-nav-arrows {
            display: flex !important;
          }
        }

        /* Hide scrollbars if any appear */
        .carousel-layout-container::-webkit-scrollbar {
          display: none;
        }
      `}
    </style>
  )

  useEffect(() => {
    if (!autoPlay || !shouldAutoPlay || loading || isPaused) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [autoPlay, shouldAutoPlay, slides.length, autoPlayInterval, loading, isPaused])

  useEffect(() => {
    if (slides.length === 0) return
    const nextIndex = (currentSlide + 1) % slides.length
    const nextSlide = slides[nextIndex]
    if (nextSlide?.image) {
      const img = new Image()
      img.src = nextSlide.image
    }
  }, [currentSlide, slides])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setAutoPlay(false)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    setAutoPlay(false)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    setAutoPlay(false)
  }

  // Swipe Handlers
  const swipeHandlers = useSwipeable({
    onSwipedLeft: nextSlide,
    onSwipedRight: prevSlide,
  })

  const handleCTAClick = (link?: string) => {
    if (link) {
      navigate(link)
    }
  }

  const handleImageLoad = (index: number) => {
    setImageLoaded((prev) => ({ ...prev, [index]: true }))
  }

  // --- Inline Styles ---

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
    borderRadius: '0px',
    margin: 0,
    padding: 0,
  }

  const loadingStyle: React.CSSProperties = {
    ...containerStyle,
    height: '450px', // Matched new mobile height
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a1a',
  }

  const slideContainerStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  }

  // Main Product Image Style (Updated to Cover for full stretch)
  const mainImageStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '100%',
    objectFit: 'cover', // Stretches to fill container
    objectPosition: 'center', // Keeps focus in center
    display: 'block', // Fixes bottom whitespace gap
    zIndex: 1,
  }



  const navButtonStyle: React.CSSProperties = {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(0,0,0,0.15)',
    transition: 'transform 0.2s ease, background-color 0.2s ease',
    pointerEvents: 'auto',
  }

  const dotsContainerStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '24px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '12px',
    zIndex: 4,
    pointerEvents: 'auto',
  }

  const dotStyle = (isActive: boolean): React.CSSProperties => ({
    width: isActive ? '32px' : '10px',
    height: '10px',
    borderRadius: '5px',
    backgroundColor: isActive ? '#FF6B35' : 'rgba(255, 255, 255, 0.3)',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  })

  if (loading) {
    return (
      <div style={loadingStyle}>
        <div style={{ color: '#ffffff', fontSize: '1.2rem' }}>Loading...</div>
      </div>
    )
  }

  if (slides.length === 0) {
    return null
  }

  return (
    <div
      className="carousel-layout-container"
      style={containerStyle}
      onMouseEnter={() => setAutoPlay(false)}
      onMouseLeave={() => setAutoPlay(shouldAutoPlay)}
      {...swipeHandlers} // Attach swipe listeners here
    >
      {renderStyles()}

      <AnimatePresence mode="wait">
        {slides.map((slide, index) => (
          currentSlide === index && (
            <motion.div
              key={slide.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              style={slideContainerStyle}
            >
              {/* Main Image - Stretched to Cover */}
              <picture style={{ display: 'block', width: '100%', height: '100%' }}>
                {slide.mobileImage && <source media="(max-width: 767px)" srcSet={slide.mobileImage} />}
                <img
                  src={slide.image}
                  alt={slide.heading || `Slide ${index + 1}`}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  onLoad={() => handleImageLoad(index)}
                  onClick={() => handleCTAClick(slide.link)}
                  style={{
                    ...mainImageStyle,
                    opacity: imageLoaded[index] ? 1 : 0,
                    transition: 'opacity 0.5s ease-in-out',
                    cursor: 'pointer'
                  }}
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1630183477086-effc914f2aea?w=1200&h=400&fit=crop'
                  }}
                />
              </picture>
            </motion.div>
          )
        ))}
      </AnimatePresence>

      {/* Navigation Arrows - Controlled by CSS class */}
      <div
        className="carousel-nav-arrows" // Class to control visibility
        style={{
          position: 'absolute',
          top: '50%',
          left: '10px',
          right: '10px',
          transform: 'translateY(-50%)',
          // display: 'flex', // REMOVED inline display, controlled by CSS
          justifyContent: 'space-between',
          pointerEvents: 'none',
          zIndex: 4,
        }}>
        <button
          onClick={prevSlide}
          style={navButtonStyle}
          aria-label="Previous slide"
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <ChevronLeft size={20} color="#1a1a1a" />
        </button>

        <button
          onClick={nextSlide}
          style={navButtonStyle}
          aria-label="Next slide"
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <ChevronRight size={20} color="#1a1a1a" />
        </button>
      </div>

      {/* Dots */}
      <div style={dotsContainerStyle}>
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            style={dotStyle(currentSlide === index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Play/Pause Button */}
      <button
        onClick={() => setIsPaused(!isPaused)}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '50%',
          width: '36px',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: '#ffffff',
          zIndex: 4,
          transition: 'background-color 0.3s ease',
          pointerEvents: 'auto'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.6)'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.4)'}
      >
        {isPaused ? <Play size={16} /> : <Pause size={16} />}
      </button>
    </div>
  )
}