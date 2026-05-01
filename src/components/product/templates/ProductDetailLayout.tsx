import { formatPrice } from '@/lib/utils'
import ProductGallery from '../gallery/ProductGallery'
import ProductInfo from '../info/ProductInfo'
import VariantSelector from '../info/VariantSelector'
import AddToCartButton from '../actions/AddToCartButton'
import ProductSpecifications from '../info/ProductSpecifications'

interface ProductDetailLayoutProps {
  productName: string
  productDescription: string
  productImages: { url: string; alt?: string }[]
  price: number
  listPrice: number // ✅ New Prop for MRP
  currency: string
  specifications: { label: string; value: string }[]
  quantityAvailable: number
  osOptions: string[]
  selectedOS: string | undefined
  availableScreenTypes: string[]
  selectedScreenType: string | undefined
  variantMap: Record<string, any>
  onOSSelect: (os: string) => void
  onScreenTypeSelect: (type: string) => void
  onBuyNow: () => void
  onAddToCart: () => void
}

export default function ProductDetailLayout({
  productName,
  productDescription,
  productImages,
  price,
  listPrice, // ✅
  currency,
  specifications,
  quantityAvailable,
  osOptions,
  selectedOS,
  availableScreenTypes,
  selectedScreenType,
  onOSSelect,
  onScreenTypeSelect,
  onBuyNow,
  onAddToCart
}: ProductDetailLayoutProps) {

  const isOutOfStock = quantityAvailable <= 0
  const isLowStock = quantityAvailable > 0 && quantityAvailable < 10

  // ✅ Discount Calculation
  const hasDiscount = listPrice > price
  const discountPercentage = hasDiscount
    ? Math.round(((listPrice - price) / listPrice) * 100)
    : 0

  return (
    <div style={{
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '120px 20px 40px 20px',
    }}>
      {/* --- TOP SECTION: DECISION ENGINE --- */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: window.innerWidth >= 1024 ? '1fr 450px' : '1fr',
        gap: '60px',
        marginBottom: '80px',
        alignItems: 'start'
      }}>

        {/* Left Column: Gallery (Sticky) */}
        <div style={{
          position: 'sticky',
          top: '100px',
          height: 'fit-content'
        }}>
          <ProductGallery
            images={productImages}
            isOutOfStock={isOutOfStock}
          />
        </div>

        {/* Right Column: Key Info & Actions ONLY */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}>
          {/* Title */}
          <h1 style={{
            fontSize: '36px',
            fontWeight: '800',
            lineHeight: '1.2',
            color: '#111827'
          }}>
            {productName}
          </h1>

          {/* ✅ Price Section (The Redesign) */}
          <div style={{ paddingBottom: '20px', borderBottom: '1px solid #e5e7eb' }}>

            {hasDiscount ? (
              // --- DISCOUNT VIEW ---
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', flexWrap: 'wrap' }}>
                {/* 1. Main Selling Price (RED) */}
                <div style={{ fontSize: '36px', fontWeight: '800', color: '#dc2626', lineHeight: '1' }}>
                  {formatPrice(price, currency)}
                </div>

                {/* 2. List Price (Strikethrough) */}
                <div style={{
                  fontSize: '18px',
                  color: '#9ca3af',
                  textDecoration: 'line-through',
                  marginBottom: '6px'
                }}>
                  {formatPrice(listPrice, currency)}
                </div>

                {/* 3. Discount Badge */}
                <div style={{
                  backgroundColor: '#fee2e2', // Light Red BG
                  color: '#dc2626',           // Red Text
                  fontSize: '14px',
                  fontWeight: '700',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  marginBottom: '6px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  {discountPercentage}% OFF
                </div>
              </div>
            ) : (
              // --- STANDARD VIEW (No Discount) ---
              <div style={{ fontSize: '36px', fontWeight: '700', color: '#111827' }}>
                {formatPrice(price, currency)}
              </div>
            )}

            {/* MRP Disclaimer */}
            <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '8px' }}>
              MRP (Inclusive of all taxes)
            </div>

            {/* Low Stock Warning */}
            {isLowStock && (
              <div style={{
                fontSize: '14px',
                color: '#c2410c',
                backgroundColor: '#ffedd5',
                padding: '8px 12px',
                borderRadius: '6px',
                marginTop: '12px',
                fontWeight: '600',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                Only {quantityAvailable} left in stock
              </div>
            )}
          </div>

          <VariantSelector
            osOptions={osOptions}
            selectedOS={selectedOS}
            availableScreenTypes={availableScreenTypes}
            selectedScreenType={selectedScreenType}
            variantMap={{}}
            onOSSelect={onOSSelect}
            onScreenTypeSelect={onScreenTypeSelect}
          />

          <div style={{ marginTop: '12px' }}>
            <AddToCartButton
              onBuyNow={onBuyNow}
              onAddToCart={onAddToCart}
              isOutOfStock={isOutOfStock}
            />
          </div>

          <div style={{ display: 'flex', gap: '20px', fontSize: '13px', color: '#6b7280', marginTop: '10px' }}>
            <span>✓ Free Shipping</span>
            <span>✓ 1 Year Warranty</span>
            <span>✓ 7 Day Replacement</span>
          </div>
        </div>
      </div>

      {/* --- BOTTOM SECTION: THE STORY & SPECS --- */}
      <div style={{
        marginTop: '60px',
        paddingTop: '60px',
        borderTop: '1px solid #e5e7eb',
        display: 'grid',
        gridTemplateColumns: window.innerWidth >= 1024 ? '2fr 1fr' : '1fr',
        gap: '80px'
      }}>
        {/* Description */}
        <div>
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '32px', color: '#111827' }}>
            Product Overview
          </h3>
          <ProductInfo title="" description={productDescription} />
        </div>

        {/* Specs */}
        <div>
          <ProductSpecifications specifications={specifications} />
        </div>
      </div>
    </div>
  )
}