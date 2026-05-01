import { useParams, Navigate } from 'react-router-dom'
import { useProduct } from '@hooks/useSaleor'
// MODIFIED: Import the new product view component
import NewProductView from '@components/product/NewProductView'
// REMOVED: Old component import
// import ProductView from '@components/product/ProductView'

const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>()
  const { data, loading, error } = useProduct(slug || '')

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white px-4 py-8 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto animate-pulse">
          {/* Skeleton state matching the new design */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-12 lg:mb-20">
            {/* Image Gallery Skeleton */}
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
              {/* Thumbnails */}
              <div className="hidden lg:flex flex-col gap-4">
                <div className="w-20 h-20 xl:w-24 xl:h-24 rounded-2xl bg-neutral-800" />
                <div className="w-20 h-20 xl:w-24 xl:h-24 rounded-2xl bg-neutral-800" />
                <div className="w-20 h-20 xl:w-24 xl:h-24 rounded-2xl bg-neutral-800" />
              </div>
              {/* Main Image */}
              <div className="flex-1">
                <div className="aspect-square lg:h-[600px] rounded-3xl bg-neutral-800" />
              </div>
            </div>
            {/* Info Skeleton */}
            <div className="flex flex-col justify-between lg:pl-8">
              <div>
                <div className="h-10 w-3/4 bg-neutral-800 rounded-lg mb-4" />
                <div className="h-4 w-1/2 bg-neutral-800 rounded-lg mb-8" />
                <div className="h-12 w-1/3 bg-neutral-800 rounded-lg mb-8" />
                <div className="flex gap-4">
                  <div className="h-12 w-32 bg-neutral-800 rounded-xl" />
                  <div className="h-12 w-32 bg-neutral-800 rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !data?.product) {
    return <Navigate to="/catalog" replace />
  }

  // MODIFIED: Render the new component and pass the product data
  return <NewProductView product={data.product} />
}

export default ProductPage