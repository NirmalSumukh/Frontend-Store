export interface Money {
    amount: number
    currency: string
}

export interface PriceRange {
    gross: Money
}

export interface DiscountInfo {
    gross: Money
}

export interface ProductPricing {
    onSale: boolean
    discount: DiscountInfo | null
    price: PriceRange
    priceUndiscounted: PriceRange
}

export interface VariantPricing {
    onSale: boolean
    discount: DiscountInfo | null
    price: PriceRange
    priceUndiscounted: PriceRange
}

// Helper function to calculate discount percentage
export const calculateDiscountPercentage = (
    originalPrice: number,
    discountedPrice: number
): number => {
    if (originalPrice <= 0) return 0
    return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
}

// Helper function to check if discount is flat or percentage
export const getDiscountType = (
    originalPrice: number,
    discountAmount: number
): 'flat' | 'percentage' => {
    // If discount amount equals the difference, it's a flat discount
    // Otherwise, calculate if it's a clean percentage
    const percentage = (discountAmount / originalPrice) * 100
    return percentage === Math.round(percentage) ? 'percentage' : 'flat'
}
