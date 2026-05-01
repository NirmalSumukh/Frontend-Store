import { motion } from 'framer-motion'
import CatalogCard from '../CatalogCard'
import FilterBar from '../FilterBar'
import Footer from '@/components/layout/Footer'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  undiscountedPrice?: number
  currency: string
  thumbnail: string
  specs?: { label: string; value: string }[]
}

interface FilterOption {
  label: string
  value: string
  options: string[]
}

interface CatalogLayoutProps {
  products: Product[]
  loading: boolean
  filters: FilterOption[]
  activeFilters: Record<string, string>
  onToggleFilter: (group: string, option: string) => void
  onClearFilters: () => void
  onAddToCart: (product: Product) => void
  onLoadMore: () => void
  hasNextPage: boolean
  getChoiceNameBySlug: (attributeSlug: string, choiceSlug: string) => string
  // ✅ NEW PROPS
  title?: React.ReactNode
  description?: string
  accentColor?: string // Tailwind color class e.g., 'bg-red-500'
}

const GeometricBackground = ({ accentClass = "border-orange-500/20" }: { accentClass?: string }) => {
  const lineColor = "border-gray-900/5";
  const lineBg = "bg-gray-900/5";

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-white">
      <div className={`absolute top-0 left-0 w-64 h-64 border-l-2 border-t-2 ${lineColor}`}></div>
      <div className={`absolute top-20 left-20 w-32 h-32 border ${lineColor} rounded-full`}></div>
      <div className={`absolute top-40 right-10 w-24 h-24 border-r-2 border-b-2 ${lineColor}`}></div>
      <div className={`absolute top-32 right-0 w-1/3 h-px ${lineBg}`}></div>
      <div className={`absolute top-1/3 left-12 w-px h-64 ${lineBg}`}></div>
      {/* Dynamic Accent Shape */}
      <div className={`absolute bottom-24 right-12 w-32 h-32 border-2 ${accentClass} rotate-45`}></div>
    </div>
  )
}

export default function CatalogLayout({
  products,
  loading,
  filters,
  activeFilters,
  onToggleFilter,
  onClearFilters,
  onAddToCart,
  onLoadMore,
  hasNextPage,
  getChoiceNameBySlug,
  title = "Discover True Vision",
  description,
  accentColor = "bg-orange-500"
}: CatalogLayoutProps) {

  const accentBorderClass = accentColor.replace('bg-', 'border-') + '/20';

  return (
    <div className="min-h-screen bg-white relative font-sans text-gray-900">
      <GeometricBackground accentClass={accentBorderClass} />

      <div className="relative z-10">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
          <div className="mb-6">
            <h1 className="text-6xl tracking-tight mb-6 text-gray-900 font-extrabold uppercase">
              {title}
            </h1>
            {description && <p className="text-xl text-gray-500 mb-6 max-w-2xl">{description}</p>}

            {/* Dynamic Accent Bar */}
            <div className={`w-24 h-2 ${accentColor} rounded-full shadow-lg opacity-80`}></div>
          </div>
        </section>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {filters.length > 0 && (
            <div className="mb-12 sticky top-4 z-40 bg-white/80 backdrop-blur-md py-4 -mx-4 px-4 rounded-xl border border-white/20 shadow-sm">
              <FilterBar
                filters={filters}
                activeFilters={activeFilters}
                onToggleFilter={onToggleFilter}
                onClearFilters={onClearFilters}
                getChoiceNameBySlug={getChoiceNameBySlug}
              />
            </div>
          )}

          {loading && products.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-50 rounded-2xl h-[400px] animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Try adjusting your filters or check back later for new inventory.
              </p>
              <button
                onClick={onClearFilters}
                className="px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="mb-8 flex items-center justify-between border-b border-gray-100 pb-4">
                <p className="text-sm text-gray-500 font-medium">
                  <span className="text-gray-900 font-bold">{products.length}</span> Results
                </p>
                {Object.keys(activeFilters).length > 0 && (
                  <button
                    onClick={onClearFilters}
                    className="text-sm text-red-600 hover:text-red-700 font-bold uppercase tracking-wide text-xs"
                  >
                    Reset Filters
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <CatalogCard
                      product={product as any} // Cast safely due to shared structure
                      onAddToCart={(e) => {
                        e.preventDefault()
                        onAddToCart(product)
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            </>
          )}

          {hasNextPage && (
            <div className="mt-16 text-center">
              <button
                onClick={onLoadMore}
                disabled={loading}
                className="px-8 py-3 text-sm font-bold text-white bg-gray-900 rounded-full hover:bg-gray-800 disabled:opacity-70"
              >
                {loading ? 'Loading...' : 'Load More Products'}
              </button>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </div>
  )
}