import { useState, ImgHTMLAttributes } from 'react'

interface ImageWithFallbackProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  fallbackSrc?: string
}

export function ImageWithFallback({
  src,
  alt,
  fallbackSrc,
  className,
  style,
  ...props
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const imageSrc = error && fallbackSrc ? fallbackSrc : src

  return (
    <>
      {/* ✅ NO wrapper div - render img directly */}
      <img
        src={imageSrc}
        alt={alt}
        className={className}
        style={{
          ...style,
          // ✅ Only apply visibility control, not display
          visibility: loaded ? 'visible' : 'hidden'
        }}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        {...props}
      />
      
      {/* Placeholder shown while loading */}
      {!loaded && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-gray-100"
          style={{ pointerEvents: 'none' }}
        >
          <svg className="w-12 h-12 text-gray-300 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}
    </>
  )
}
