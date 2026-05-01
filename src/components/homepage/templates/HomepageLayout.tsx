import Footer from '@/components/layout/Footer'
import FeaturesSection from '../FeaturesSection'
import LatestProductsSection from '../LatestProductsSection'

// Import new content components
import HomepageCarousel from '@components/content/HomepageCarousel'
import HomepageCategories from '@components/content/HomepageCategories'
import HomepageBannerSection from '@components/content/HomepageBannerSection' // 👈 ADDED
import HomepagePopupBanner from '@components/content/HomepagePopupBanner'

export default function HomepageLayout() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Carousel */}
      <section className="w-full">
        <HomepageCarousel />
      </section>

      {/* Features (Shipping, etc.) */}
      <FeaturesSection />

      {/* Categories */}
      <HomepageCategories />

      {/* Latest Products (Dynamic from API) */}
      <LatestProductsSection />

      {/* ✅ NEW: Interactive Banner Section (Replaces Partners) */}
      <HomepageBannerSection />

      {/* Footer */}
      <Footer />

      {/* Popup Banner (Homepage only) */}
      <HomepagePopupBanner />
    </div>
  )
}