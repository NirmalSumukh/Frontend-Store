import { useProducts } from '@/hooks/useSaleor'
import CatalogLayout from '@/components/catalog/templates/CatalogLayout'
import { useCatalogLogic } from '@/hooks/useCatalogLogic'

const DealsPage = () => {
    // 1. Fetch ALL products (or a large subset) to filter on client side
    // Ideally, filter logic should be server-side, but client-side ensures 
    // we catch all variants with discounts regardless of base product settings.
    const { data: productsData, loading, error, fetchMore } = useProducts({
        first: 100, // Fetch more initially to ensure we populate the deals page
        after: undefined,
    })

    const hasNextPage = productsData?.products?.pageInfo?.hasNextPage || false

    // 2. Use the Shared Logic Hook with dealsOnly = true
    const {
        filteredVariants,
        dynamicFilters,
        activeFilters,
        handleToggleFilter,
        handleClearFilters,
        handleAddToCart,
        getNameForChoice
    } = useCatalogLogic(productsData, true) // <--- TRUE enables deals filtering

    const handleLoadMore = () => {
        if (hasNextPage && !loading) {
            fetchMore({
                variables: { after: productsData.products.pageInfo.endCursor },
            })
        }
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-red-600">Error loading deals.</p>
            </div>
        )
    }

    return (
        <CatalogLayout
            products={filteredVariants}
            loading={loading}
            filters={dynamicFilters}
            activeFilters={activeFilters}
            onToggleFilter={handleToggleFilter}
            onClearFilters={handleClearFilters}
            onAddToCart={handleAddToCart}
            onLoadMore={handleLoadMore}
            hasNextPage={hasNextPage}
            getChoiceNameBySlug={getNameForChoice}
            // ✅ Custom Branding for Deals Page
            title={
                <>
                    Exclusive <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-500">
                        Offers & Deals
                    </span>
                </>
            }
            description="Limited time offers on TVs, Audio, and Accessories. Grab them before they are gone."
            accentColor="bg-rose-600" // Red accent for "Sale" feeling
        />
    )
}

export default DealsPage