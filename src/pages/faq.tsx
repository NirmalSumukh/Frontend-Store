import FAQStaticPage from '@/components/content/layouts/FAQStaticPage'

export default function FAQPage() {
    // Make sure the slug "faq" exists in your Saleor Dashboard > Configuration > Pages
    return <FAQStaticPage slug="faq" />
}