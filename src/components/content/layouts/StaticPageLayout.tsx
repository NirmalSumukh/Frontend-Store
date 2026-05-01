import { useStaticPage } from '@/hooks/useSaleor'
import { Link } from 'react-router-dom'
import Footer from '@/components/layout/Footer'

interface StaticPageLayoutProps {
    slug: string
}

export default function StaticPageLayout({ slug }: StaticPageLayoutProps) {
    const { data, loading, error } = useStaticPage(slug)

    if (loading) {
        return (
            // ✅ FIX: Added pt-28 md:pt-32 for navbar clearance and widened to max-w-5xl
            <div className="max-w-5xl mx-auto px-4 pt-28 md:pt-32 pb-16 w-full animate-pulse">
                <div className="h-12 w-64 bg-gray-200 rounded-lg mb-12"></div>
                <div className="space-y-6">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>
            </div>
        )
    }

    const page = data?.page

    if (error || !page) {
        return (
            // ✅ FIX: Added pt-32 and widened to max-w-5xl
            <div className="max-w-5xl mx-auto px-4 pt-32 pb-24 text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
                <p className="text-gray-500 mb-8">The content you are looking for is currently unavailable.</p>
                <Link to="/" className="text-[#f97316] font-bold hover:underline">&larr; Back to Home</Link>
            </div>
        )
    }

    // Parse Saleor's Editor.js JSON content
    const renderContent = () => {
        if (!page.content) return null
        try {
            const parsed = typeof page.content === 'string' ? JSON.parse(page.content) : page.content

            if (parsed.blocks && Array.isArray(parsed.blocks)) {
                return parsed.blocks.map((block: any, idx: number) => {
                    switch (block.type) {
                        case 'paragraph':
                            return (
                                <p key={idx} className="text-gray-600 leading-relaxed mb-6 text-lg" dangerouslySetInnerHTML={{ __html: block.data.text }} />
                            )
                        case 'header':
                            const Tag = `h${block.data.level}` as keyof JSX.IntrinsicElements
                            const sizes: Record<number, string> = {
                                1: 'text-4xl font-extrabold text-gray-900 mb-6 mt-12',
                                2: 'text-3xl font-bold text-gray-900 mb-5 mt-10',
                                3: 'text-2xl font-bold text-gray-800 mb-4 mt-8',
                            }
                            return (
                                <Tag key={idx} className={sizes[block.data.level] || sizes[3]} dangerouslySetInnerHTML={{ __html: block.data.text }} />
                            )
                        case 'list':
                            const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul'
                            const listClass = block.data.style === 'ordered' ? 'list-decimal' : 'list-disc'
                            return (
                                <ListTag key={idx} className={`${listClass} pl-6 mb-6 space-y-2 text-gray-600 text-lg marker:text-[#f97316]`}>
                                    {block.data.items.map((item: string, i: number) => (
                                        <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                                    ))}
                                </ListTag>
                            )
                        case 'quote':
                            return (
                                <div key={idx} className="bg-orange-50 border-l-4 border-[#f97316] p-6 rounded-r-xl mb-8 shadow-sm">
                                    <p className="text-xl italic text-gray-800 font-medium mb-3" dangerouslySetInnerHTML={{ __html: block.data.text }} />
                                    {block.data.caption && (
                                        <p className="text-sm font-bold text-[#f97316] uppercase tracking-wider" dangerouslySetInnerHTML={{ __html: block.data.caption }} />
                                    )}
                                </div>
                            )
                        default:
                            return null
                    }
                })
            }
            return <p className="text-gray-600 leading-relaxed text-lg">{page.content}</p>
        } catch (e) {
            console.error("Failed to parse page content", e)
            return null
        }
    }

    return (
        <>
        // ✅ FIX: Added pt-28 md:pt-32 for navbar clearance and widened from max-w-4xl to max-w-5xl
            <div className="max-w-5xl mx-auto px-4 pt-28 md:pt-32 pb-16 w-full">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
                    {page.title}
                </h1>
                <div className="w-24 h-1.5 bg-gradient-to-r from-[#f97316] to-orange-300 rounded-full mb-12"></div>

                {/* We keep max-w-none here so the prose expands fully within the max-w-5xl parent */}
                <div className="prose prose-lg max-w-none prose-a:text-[#f97316] hover:prose-a:text-[#ea580c]">
                    {renderContent()}
                </div>
            </div>
            <Footer />
        </>
    )
}