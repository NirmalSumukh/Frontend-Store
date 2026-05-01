import { Link } from 'react-router-dom'
import { ImageWithFallback } from '@/components/product/ImageWithFallback'

interface SearchResultProduct {
  id: string
  name: string
  slug: string
  thumbnail?: { url: string; alt: string }
  // Pricing data is available in props but ignored in UI
  pricing?: any 
  category?: { name: string }
}

interface SearchResultsProps {
  results: SearchResultProduct[]
  loading: boolean
  onResultClick: () => void
}

export default function SearchResults({ results, loading, onResultClick }: SearchResultsProps) {
  if (loading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <div className="animate-spin inline-block w-6 h-6 border-2 border-current border-t-transparent rounded-full mb-2" />
        <p>Searching...</p>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <p>No products found.</p>
      </div>
    )
  }

  return (
    <div className="p-4 max-h-[70vh] overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {results.map((product) => {
          return (
            <Link
              key={product.id}
              to={`/product/${product.slug}`}
              onClick={onResultClick}
              className="group block"
            >
              {/* MOBILE: Flex Row (Bar style)
                 DESKTOP: Flex Column (Card style) via md: classes
              */}
              <div className="
                flex flex-row md:flex-col 
                items-center md:items-start 
                bg-card hover:bg-accent/50 
                border border-border rounded-xl 
                p-3 md:p-4 
                transition-all duration-200
                gap-4 md:gap-0
              ">
                {/* Image Container */}
                <div className="
                  w-16 h-16 md:w-full md:h-48 
                  flex-shrink-0 
                  bg-white rounded-lg overflow-hidden 
                  md:mb-4 relative
                ">
                  <ImageWithFallback
                    src={product.thumbnail?.url || ''}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Content Container */}
                <div className="flex-1 min-w-0 w-full">
                  <p className="text-xs text-muted-foreground mb-1 truncate">
                    {product.category?.name || 'Product'}
                  </p>
                  <h4 className="font-semibold text-foreground text-sm md:text-base line-clamp-2 md:mb-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h4>
                  
                  {/* ✅ Price section is deliberately removed */}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}