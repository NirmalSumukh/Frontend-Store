import { useStaticPage } from '@/hooks/useSaleor'
import { Link } from 'react-router-dom'
import { Disclosure, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import Footer from '@/components/layout/Footer'

interface FAQStaticPageProps {
    slug: string
}

export default function FAQStaticPage({ slug }: FAQStaticPageProps) {
    const { data, loading, error } = useStaticPage(slug)

    if (loading) {
        return (
            // ✅ FIX 1 & 2: Added pt-32 for navbar clearance and widened to max-w-5xl
            <div className="max-w-5xl mx-auto px-4 pt-28 md:pt-32 pb-16 w-full animate-pulse">
                <div className="h-12 w-64 bg-gray-200 rounded-lg mb-12 mx-auto"></div>
                <div className="space-y-4 max-w-4xl mx-auto">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-20 bg-gray-100 rounded-2xl w-full"></div>
                    ))}
                </div>
            </div>
        )
    }

    const page = data?.page

    if (error || !page) {
        return (
            <div className="max-w-5xl mx-auto px-4 pt-32 pb-24 text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
                <p className="text-gray-500 mb-8">The FAQ content is currently unavailable.</p>
                <Link to="/" className="text-[#f97316] font-bold hover:underline">&larr; Back to Home</Link>
            </div>
        )
    }

    const renderContent = () => {
        if (!page.content) return null
        try {
            const parsed = typeof page.content === 'string' ? JSON.parse(page.content) : page.content

            if (parsed.blocks && Array.isArray(parsed.blocks)) {
                return parsed.blocks.map((block: any, idx: number) => {
                    switch (block.type) {
                        case 'paragraph':
                            return (
                                <p key={idx} className="text-gray-600 leading-relaxed mb-8 text-lg" dangerouslySetInnerHTML={{ __html: block.data.text }} />
                            )
                        case 'header':
                            const Tag = `h${block.data.level}` as keyof JSX.IntrinsicElements
                            const sizes: Record<number, string> = {
                                1: 'text-4xl font-extrabold text-gray-900 mb-6 mt-12',
                                2: 'text-3xl font-bold text-gray-900 mb-6 mt-10',
                                3: 'text-2xl font-bold text-gray-800 mb-4 mt-8',
                            }
                            return (
                                <Tag key={idx} className={sizes[block.data.level] || sizes[3]} dangerouslySetInnerHTML={{ __html: block.data.text }} />
                            )
                        case 'quote':
                            return (
                                <Disclosure as="div" className="mb-4" key={idx}>
                                    {({ open }) => (
                                        <div
                                            className={`border rounded-2xl transition-all duration-300 overflow-hidden ${open
                                                    ? 'border-[#f97316] bg-orange-50/30 shadow-md'
                                                    : 'border-gray-200 bg-white hover:border-orange-200 hover:shadow-sm'
                                                }`}
                                        >
                                            <Disclosure.Button className="flex w-full items-center justify-between px-6 py-5 text-left focus:outline-none focus-visible:ring focus-visible:ring-[#f97316] focus-visible:ring-opacity-50">
                                                {/* ✅ FIX 3: Swapped to block.data.text for the Question */}
                                                <span
                                                    className={`text-lg font-bold pr-4 transition-colors ${open ? 'text-[#ea580c]' : 'text-gray-900'}`}
                                                    dangerouslySetInnerHTML={{ __html: block.data.text || 'Question' }}
                                                />
                                                <div className={`p-2 rounded-full transition-colors ${open ? 'bg-orange-100' : 'bg-gray-50'}`}>
                                                    <ChevronDownIcon
                                                        className={`h-5 w-5 text-[#f97316] transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                                                    />
                                                </div>
                                            </Disclosure.Button>

                                            <Transition
                                                enter="transition duration-200 ease-out"
                                                enterFrom="transform opacity-0 -translate-y-2"
                                                enterTo="transform opacity-100 translate-y-0"
                                                leave="transition duration-150 ease-in"
                                                leaveFrom="transform opacity-100 translate-y-0"
                                                leaveTo="transform opacity-0 -translate-y-2"
                                            >
                                                {/* ✅ FIX 3: Swapped to block.data.caption for the Answer */}
                                                <Disclosure.Panel className="px-6 pb-6 pt-1 text-gray-600 text-base leading-relaxed">
                                                    <div dangerouslySetInnerHTML={{ __html: block.data.caption || '' }} />
                                                </Disclosure.Panel>
                                            </Transition>
                                        </div>
                                    )}
                                </Disclosure>
                            )
                        default:
                            return null
                    }
                })
            }
            return <p className="text-gray-600 leading-relaxed text-lg">{page.content}</p>
        } catch (e) {
            console.error("Failed to parse FAQ content", e)
            return null
        }
    }

    return (
        <>
            <div className="max-w-5xl mx-auto px-4 pt-28 md:pt-32 pb-16 w-full">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
                        {page.title}
                    </h1>
                    <div className="w-24 h-1.5 bg-gradient-to-r from-[#f97316] to-orange-300 rounded-full mx-auto mb-6"></div>
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                        Find answers to common questions about our products, shipping, returns, and more.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto w-full">
                    {renderContent()}
                </div>
            </div>
            <Footer />
        </>
    )
}