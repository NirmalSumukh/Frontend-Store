import { useHomepageContent } from '@/hooks/useHomepageContent'
import BannerSectionLayout from './layouts/BannerSectionLayout'

export default function HomepageBannerSection() {
    const { content, loading } = useHomepageContent()
    return <BannerSectionLayout items={content.bannerSection} loading={loading} />
}