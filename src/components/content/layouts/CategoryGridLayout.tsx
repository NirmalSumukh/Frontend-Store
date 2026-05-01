import { Link } from 'react-router-dom'

interface CategoryNode {
    id: string
    name: string
    slug: string
    backgroundImage?: {
        url: string
        alt?: string
    }
}

interface CategoryGridLayoutProps {
    categories: CategoryNode[]
    loading?: boolean
}

// ✅ FIX: Smart URL parser to handle Saleor's relative media paths
const getValidImageUrl = (url?: string) => {
    if (!url) return null;
    // If it's already a full URL, return it
    if (url.startsWith('http')) return url;

    // If it's a relative URL, prepend your Saleor API base URL (stripping the /graphql/ part)
    const apiUrl = import.meta.env.VITE_SALEOR_API_URL || 'http://localhost:8000/graphql/';
    const baseUrl = apiUrl.replace('/graphql/', '').replace('/graphql', '');

    return `${baseUrl}${url}`;
}

export default function CategoryGridLayout({ categories, loading }: CategoryGridLayoutProps) {
    if (loading) {
        return (
            <section className="py-20 px-4 md:px-8 max-w-[1400px] mx-auto w-full">
                <div className="h-12 w-64 bg-gray-200 animate-pulse rounded-lg mb-12" />
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-56 md:h-72 bg-gray-200 animate-pulse rounded-3xl" />
                    ))}
                </div>
            </section>
        )
    }

    if (!categories || categories.length === 0) return null

    return (
        <section className="py-20 px-4 md:px-8 max-w-[1400px] mx-auto w-full">
            {/* --- ENHANCED PREMIUM HEADING --- */}
            <div className="mb-12 flex flex-col md:flex-row justify-between items-center md:items-end gap-6 text-center md:text-left">
                <div className="relative">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500 tracking-tight mb-3">
                        Shop by Category
                    </h2>
                    {/* Decorative Underline */}
                    <div className="h-1.5 w-24 bg-gradient-to-r from-[#f97316] to-orange-300 rounded-full mx-auto md:mx-0"></div>
                    <p className="text-gray-500 mt-4 text-lg font-medium">
                        Discover our curated collections tailored for you
                    </p>
                </div>

                {/* Enhanced View All Button */}
                <Link
                    to="/catalog"
                    className="group flex items-center gap-2 px-6 py-3 bg-white hover:bg-[#fff7ed] text-gray-900 hover:text-[#ea580c] rounded-full font-bold transition-all duration-300 shadow-sm border border-gray-200 hover:border-[#f97316] hover:shadow-md"
                >
                    View All Categories
                    <span className="transform group-hover:translate-x-1.5 transition-transform duration-300" aria-hidden="true">&rarr;</span>
                </Link>
            </div>

            {/* --- GRID LAYOUT --- */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                {categories.map((category) => {
                    const imageUrl = getValidImageUrl(category.backgroundImage?.url);

                    return (
                        <Link
                            key={category.id}
                            to={`/catalog?category=${category.slug}`}
                            className="group relative h-56 md:h-72 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 block bg-gray-100"
                        >
                            {/* ✅ FIX: Explicit z-0 for image layer */}
                            <div className="absolute inset-0 z-0">
                                {imageUrl ? (
                                    <img
                                        src={imageUrl}
                                        alt={category.backgroundImage?.alt || `${category.name} collection`}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        loading="lazy"
                                        onLoad={(e) => e.currentTarget.classList.add('loaded')}
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                        <span className="text-gray-400 font-medium text-sm tracking-wider uppercase">No Cover Image</span>
                                    </div>
                                )}
                            </div>

                            {/* ✅ FIX: Explicit z-10 for gradient overlay layer */}
                            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />

                            {/* ✅ FIX: Explicit z-20 for text layer */}
                            <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full flex flex-col justify-end z-20">
                                <h3 className="text-white text-xl md:text-2xl font-bold translate-y-3 group-hover:translate-y-0 transition-transform duration-500 tracking-wide">
                                    {category.name}
                                </h3>

                                <div className="overflow-hidden mt-2">
                                    <p className="text-[#f97316] text-sm md:text-base font-bold opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 flex items-center gap-1">
                                        Explore Collection
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="mt-0.5">
                                            <polyline points="9 18 15 12 9 6"></polyline>
                                        </svg>
                                    </p>
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </section>
    )
}