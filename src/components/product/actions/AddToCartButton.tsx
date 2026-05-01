import React from 'react'

interface AddToCartButtonProps {
  onBuyNow: () => void
  onAddToCart: () => void
  isOutOfStock?: boolean
}

export default function AddToCartButton({ onBuyNow, onAddToCart, isOutOfStock = false }: AddToCartButtonProps) {
  const buttonContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    width: '100%',
  }

  // Brand Colors
  const BRAND_ORANGE = '#f97316'
  const BRAND_BLACK = '#111827'
  const DISABLED_GREY = '#d1d5db'

  const buyNowButtonStyle: React.CSSProperties = {
    flex: 1,
    padding: '16px 24px',
    fontSize: '16px',
    fontWeight: '600',
    borderRadius: '12px',
    // Black border/bg normally, Grey if OOS
    border: isOutOfStock ? `2px solid ${DISABLED_GREY}` : `2px solid ${BRAND_BLACK}`,
    backgroundColor: isOutOfStock ? '#f3f4f6' : '#ffffff',
    color: isOutOfStock ? '#9ca3af' : BRAND_BLACK,
    cursor: isOutOfStock ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  }

  const addToCartButtonStyle: React.CSSProperties = {
    flex: 1,
    padding: '16px 24px',
    fontSize: '16px',
    fontWeight: '600',
    borderRadius: '12px',
    // Orange border/bg normally
    border: isOutOfStock ? `2px solid ${DISABLED_GREY}` : `2px solid ${BRAND_ORANGE}`,
    backgroundColor: isOutOfStock ? DISABLED_GREY : BRAND_ORANGE,
    color: '#ffffff',
    cursor: isOutOfStock ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  }

  return (
    <div style={buttonContainerStyle}>
      {/* BUY NOW Button */}
      <button
        onClick={onBuyNow}
        disabled={isOutOfStock}
        style={buyNowButtonStyle}
        onMouseEnter={(e) => {
          if (!isOutOfStock) {
            e.currentTarget.style.backgroundColor = BRAND_BLACK
            e.currentTarget.style.color = '#ffffff'
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
          }
        }}
        onMouseLeave={(e) => {
          if (!isOutOfStock) {
            e.currentTarget.style.backgroundColor = '#ffffff'
            e.currentTarget.style.color = BRAND_BLACK
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
        <span>{isOutOfStock ? 'Out of Stock' : 'BUY NOW'}</span>
      </button>

      {/* ADD TO CART Button */}
      <button
        onClick={onAddToCart}
        disabled={isOutOfStock}
        style={addToCartButtonStyle}
        onMouseEnter={(e) => {
          if (!isOutOfStock) {
            // Darker Orange on hover
            e.currentTarget.style.backgroundColor = '#ea580c'
            e.currentTarget.style.borderColor = '#ea580c'
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(249, 115, 22, 0.3)'
          }
        }}
        onMouseLeave={(e) => {
          if (!isOutOfStock) {
            e.currentTarget.style.backgroundColor = BRAND_ORANGE
            e.currentTarget.style.borderColor = BRAND_ORANGE
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
        <span>{isOutOfStock ? 'Unavailable' : 'ADD TO CART'}</span>
      </button>
    </div>
  )
}