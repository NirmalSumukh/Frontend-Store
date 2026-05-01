import { useCategories } from '@/hooks/useSaleor'
import CategoryGridLayout from './layouts/CategoryGridLayout'

export default function HomepageCategories() {
    const { data, loading, error } = useCategories()

    // Extract the nodes from the GraphQL edges format
    const categories = data?.categories?.edges?.map((edge: any) => edge.node) || []

    if (error) {
        console.error('Failed to load categories:', error)
        return null // Fail silently so it doesn't break the whole homepage
    }

    return <CategoryGridLayout categories={categories} loading={loading} />
}