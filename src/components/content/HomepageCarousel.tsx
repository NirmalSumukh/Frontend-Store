import { useHomepageContent } from '@/hooks/useHomepageContent'
import CarouselLayout from './layouts/CarouselLayout'

export default function HomepageCarousel() {
  const { content, loading } = useHomepageContent()
  return <CarouselLayout slides={content.carouselSlides} loading={loading} />
}