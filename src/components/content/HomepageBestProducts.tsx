import { useHomepageContent } from '@/hooks/useHomepageContent'
import BestProductsLayout from './layouts/BestProductsLayout'

export default function HomepageBestProducts() {
  const { content, loading } = useHomepageContent()
  return <BestProductsLayout cards={content.bestProducts} loading={loading} />
}