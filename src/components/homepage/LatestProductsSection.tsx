import { useProducts } from '@/hooks/useSaleor'
import LatestProductsLayout from './layouts/LatestProductsLayout'
import { Product } from '@/types'

// Skeletons for loading state
const LoadingSkeleton = () => {
  return (
    <section className="py-20 px-6 bg-[#0F1115] relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="h-6 w-32 bg-gray-800 rounded-full mb-4 mx-auto animate-pulse"></div>
          <div className="h-10 w-1/2 bg-gray-800 rounded-lg mb-4 mx-auto animate-pulse"></div>
          <div className="h-5 w-3/4 bg-gray-800 rounded-lg mx-auto animate-pulse"></div>
        </div>
        <div className="relative h-[480px] md:h-[480px] flex items-center justify-center">
          <div className="w-[280px] md:w-[300px] h-[420px] bg-[#1A1C23]/80 rounded-3xl border border-[#333333] animate-pulse opacity-50"></div>
        </div>
      </div>
    </section>
  )
}

export default function LatestProductsSection() {
  // Logic: Fetching the latest products
  const {
    data: productsData,
    loading: productsLoading,
    error: productsError
  } = useProducts({ first: 8 }) // Fetches 8 products for the carousel

  const products: Product[] =
    productsData?.products?.edges?.map((edge: any) => edge.node) || []

  if (productsLoading && products.length === 0) {
    return <LoadingSkeleton />;
  }

  if (productsError) {
    return (
      <div className="text-center py-12 bg-[#0F1115]">
        <p className="text-destructive">Error loading latest products.</p>
      </div>
    )
  }

  // Render: Pass the fetched products to the new layout
  return <LatestProductsLayout products={products} />
}