import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useProducts, useCategoryBySlug } from '@/hooks/useSaleor'
import CatalogLayout from '@/components/catalog/templates/CatalogLayout'
import { useCatalogLogic } from '@/hooks/useCatalogLogic'

const CatalogPage = () => {
  const [searchParams] = useSearchParams()
  const categorySlug = searchParams.get('category')

  const { data: categoryData, loading: categoryLoading } = useCategoryBySlug(categorySlug)
  const categoryId = categoryData?.category?.id

  const filterInput = useMemo(() => {
    if (!categoryId) return undefined
    return { categories: [categoryId] }
  }, [categoryId])

  const { data: productsData, loading, error, fetchMore } = useProducts({
    first: 100,
    after: undefined,
    filter: filterInput,
  })

  // ✅ Use Shared Logic (dealsOnly = false)
  const {
    filteredVariants,
    dynamicFilters,
    activeFilters,
    handleToggleFilter,
    handleClearFilters,
    handleAddToCart,
    getNameForChoice
  } = useCatalogLogic(productsData, false)

  const handleLoadMore = () => {
    if (productsData?.products?.pageInfo?.hasNextPage && !loading) {
      fetchMore({
        variables: { after: productsData.products.pageInfo.endCursor },
      })
    }
  }

  const isLoading = categoryLoading || loading

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">Error loading catalog.</p>
      </div>
    )
  }

  return (
    <CatalogLayout
      products={filteredVariants}
      loading={isLoading}
      filters={dynamicFilters}
      activeFilters={activeFilters}
      onToggleFilter={handleToggleFilter}
      onClearFilters={handleClearFilters}
      onAddToCart={handleAddToCart}
      onLoadMore={handleLoadMore}
      hasNextPage={productsData?.products?.pageInfo?.hasNextPage || false}
      getChoiceNameBySlug={getNameForChoice}
      // Default Styling
      title={
        <>
          Discover <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600">
            True Vision
          </span>
        </>
      }
      accentColor="bg-orange-500"
    />
  )
}

export default CatalogPage