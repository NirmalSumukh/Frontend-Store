// Product Types
export interface Product {
  id: string
  name: string
  slug: string
  description?: string
  thumbnail?: {
    url: string
    alt: string
  }
  pricing?: {
    priceRange?: {
      start?: {
        gross?: {
          amount: number
          currency: string
        }
      }
    }
    priceRangeUndiscounted?: {
      start?: {
        gross?: {
          amount: number
          currency: string
        }
      }
    }
  }
  category?: {
    id: string
    name: string
    slug: string
  }
}

// Category Types
export interface Category {
  id: string
  name: string
  slug: string
  backgroundImage?: {
    url: string
    alt: string
  }
}

// Carousel Types
export interface CarouselSlide {
  id: string
  title: string
  description: string
  image: string
  cta: string
  link?: string
}

export interface CarouselSettings {
  slides: CarouselSlide[]
  autoPlay: boolean
  interval: number
}

// Cart Types
export interface CartItem {
  id: string
  variantId: string
  productId: string
  name: string
  slug: string
  price: number
  quantity: number
  thumbnail: string
  variant: {
    name: string
    attributes: Record<string, string>
  }
}

// User Types
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  isStaff: boolean
  permissions: string[]
}
