import { formatPrice } from '@/lib/utils'

interface VariantSelectorProps {
  osOptions: string[]
  selectedOS: string | undefined
  onOSSelect: (os: string) => void
  availableScreenTypes: string[]
  selectedScreenType: string | undefined
  onScreenTypeSelect: (type: string) => void
  variantMap: Record<string, any>
}

export default function VariantSelector({
  osOptions,
  selectedOS,
  onOSSelect,
  availableScreenTypes,
  selectedScreenType,
  onScreenTypeSelect,
  variantMap
}: VariantSelectorProps) {
  if (osOptions.length === 0) return null

  // Styles
  const sectionStyle: React.CSSProperties = {
    marginBottom: '24px',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151', // Slightly softer black
    marginBottom: '12px',
    display: 'block',
    letterSpacing: '0.02em'
  }

  const buttonContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
  }

  // Updated Button Style Logic
  const getButtonStyle = (isSelected: boolean): React.CSSProperties => ({
    padding: '12px 20px',
    borderRadius: '8px', // Slightly sharper corners
    // If selected: Orange Border + Ring Effect using box-shadow
    // If not: Light grey border
    border: isSelected ? '1px solid #f97316' : '1px solid #e5e7eb',
    backgroundColor: isSelected ? '#fff7ed' : '#ffffff', // Very light orange bg if selected
    color: isSelected ? '#ea580c' : '#374151',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    // The "Ring" effect
    boxShadow: isSelected ? '0 0 0 2px #fff, 0 0 0 4px #f97316' : '0 1px 2px rgba(0,0,0,0.05)',
    position: 'relative',
    margin: isSelected ? '2px' : '0', // Compensate for ring
  })

  const priceTagStyle: React.CSSProperties = {
    fontSize: '12px',
    fontWeight: '500',
    opacity: 0.8,
    marginLeft: '4px',
  }

  return (
    <div>
      {/* OS Selection */}
      <div style={sectionStyle}>
        <label style={labelStyle}>
          Style Name: <span style={{ color: '#111827', fontWeight: '700' }}>{selectedOS}</span>
        </label>
        <div style={buttonContainerStyle}>
          {osOptions.map((os) => {
            const isSelected = selectedOS === os
            return (
              <button
                key={os}
                onClick={() => onOSSelect(os)}
                style={getButtonStyle(isSelected)}
              >
                {/* Optional: Checkmark icon if selected */}
                {isSelected && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )}
                <span>{os}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Screen Type Selection */}
      {availableScreenTypes.length > 0 && (
        <div style={sectionStyle}>
          <label style={labelStyle}>
            Screen Type: <span style={{ color: '#111827', fontWeight: '700' }}>{selectedScreenType}</span>
          </label>
          <div style={buttonContainerStyle}>
            {availableScreenTypes.map((screenType) => {
              const isSelected = selectedScreenType === screenType
              const variant = variantMap[`${selectedOS}_${screenType}`]
              const price = variant?.pricing?.price?.gross?.amount || 0
              const currency = variant?.pricing?.price?.gross?.currency || 'INR'

              return (
                <button
                  key={screenType}
                  onClick={() => onScreenTypeSelect(screenType)}
                  style={getButtonStyle(isSelected)}
                >
                  {isSelected && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                  <span>{screenType}</span>
                  {price > 0 && (
                    <span style={priceTagStyle}>
                      {formatPrice(price, currency)}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}