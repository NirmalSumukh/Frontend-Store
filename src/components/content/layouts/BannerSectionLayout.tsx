import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { BannerSectionItem } from '@/hooks/useHomepageContent'
import { ImageWithFallback } from '@/components/product/ImageWithFallback'
import { cn } from '@/lib/utils'

interface BannerSectionLayoutProps {
    items: BannerSectionItem[]
    loading: boolean
}

// --- SUB-COMPONENT: Standalone Full-Width Banner ---
const StandaloneBanner = ({ item }: { item: BannerSectionItem }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            // STACK LOGIC: 
            // 1. w-full relative
            // 2. border-b border-white/10: Acts as the divider line
            // 3. last:border-b-0: Removes the line if it's the very last item in the stack
            className="w-full relative border-b border-white/10 last:border-b-0 bg-gray-900 group"
        >
            {/* Added hover glow effect on the container itself */}
            <div className="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/5 transition-colors duration-500 z-10 pointer-events-none" />

            <div className="aspect-video w-full relative">
                <ImageWithFallback
                    src={item.image}
                    alt="Feature Banner"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

                {(item.heading || item.description) && (
                    <div className="absolute bottom-0 left-0 p-6 md:p-12 max-w-2xl z-20">
                        {item.heading && <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{item.heading}</h3>}
                        {item.description && <p className="text-gray-300 text-lg">{item.description}</p>}
                    </div>
                )}
            </div>
        </motion.div>
    )
}

// --- SUB-COMPONENT: Interactive Slideshow ---
const FeatureSlideshow = ({ items }: { items: BannerSectionItem[] }) => {
    const [activeIndex, setActiveIndex] = useState(0)
    const activeItem = items[activeIndex]

    if (!activeItem) return null

    return (
        // STACK LOGIC: 
        // 1. No rounded corners (handled by parent).
        // 2. border-b border-white/10: Acts as the divider line.
        <div className="w-full border-b border-white/10 last:border-b-0 bg-gray-900">

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:h-[500px]">

                {/* LEFT: Active Image Display 
                    - Border logic: On Desktop, it needs a right border to separate from the list.
                    - On Mobile, it needs a bottom border.
                */}
                <div className="h-[300px] lg:h-full lg:col-span-8 relative flex items-center justify-center group order-1 border-b lg:border-b-0 lg:border-r border-white/10 bg-black/40">

                    {/* Shadow overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 pointer-events-none" />

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeItem.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="absolute inset-0 w-full h-full"
                        >
                            <ImageWithFallback
                                src={activeItem.image}
                                alt={activeItem.heading}
                                className="w-full h-full object-cover"
                            />
                        </motion.div>
                    </AnimatePresence>

                    {/* Mobile Text Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 lg:hidden z-20">
                        <h3 className="text-lg font-bold mb-1 text-white">{activeItem.heading}</h3>
                        <p className="text-gray-300 text-xs line-clamp-2">{activeItem.description}</p>
                    </div>
                </div>

                {/* RIGHT: Navigation List 
                    - No borders here, the parent container handles the edges.
                */}
                <div className="lg:col-span-4 flex flex-col h-[400px] lg:h-full overflow-hidden bg-gray-900/50 backdrop-blur-sm order-2">

                    <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
                            Features
                        </span>
                        <span className="text-xs text-orange-500 font-mono">
                            {activeIndex + 1}/{items.length}
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-0 custom-scrollbar">
                        {items.map((item, index) => {
                            const isActive = index === activeIndex
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveIndex(index)}
                                    // List Items: Simple bottom borders for separation
                                    className={cn(
                                        "w-full text-left p-4 transition-all duration-300 group relative overflow-hidden border-b border-white/5 last:border-0",
                                        isActive
                                            ? "bg-gradient-to-r from-orange-500/10 to-transparent"
                                            : "bg-transparent hover:bg-white/5"
                                    )}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId={`activeGlow-${items[0]?.id}`}
                                            className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500"
                                        />
                                    )}

                                    <div className="flex justify-between items-center pl-3">
                                        <div>
                                            <h3 className={cn(
                                                "font-bold text-sm md:text-base mb-1 transition-colors",
                                                isActive ? "text-white" : "text-gray-400 group-hover:text-gray-200"
                                            )}>
                                                {item.heading}
                                            </h3>
                                            <p className={cn(
                                                "text-xs transition-colors line-clamp-2 leading-relaxed",
                                                isActive ? "text-gray-300" : "text-gray-600"
                                            )}>
                                                {item.description}
                                            </p>
                                        </div>

                                        <div className="w-6 flex-shrink-0 flex justify-end">
                                            {isActive && (
                                                <motion.div
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                >
                                                    <ChevronRight className="w-4 h-4 text-orange-500" />
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

// --- MAIN COMPONENT ---
export default function BannerSectionLayout({ items, loading }: BannerSectionLayoutProps) {

    const sections = useMemo(() => {
        if (!items || items.length === 0) return []

        const result: Array<{ type: 'slideshow' | 'standalone', data: BannerSectionItem | BannerSectionItem[] }> = []
        let currentSlideshowGroup: BannerSectionItem[] = []

        const sortedItems = [...items].sort((a, b) => a.sortOrder - b.sortOrder)

        sortedItems.forEach((item) => {
            const hasHeading = item.heading && item.heading.trim().length > 0
            if (!hasHeading) {
                if (currentSlideshowGroup.length > 0) {
                    result.push({ type: 'slideshow', data: [...currentSlideshowGroup] })
                    currentSlideshowGroup = []
                }
                result.push({ type: 'standalone', data: item })
            } else {
                currentSlideshowGroup.push(item)
            }
        })
        if (currentSlideshowGroup.length > 0) {
            result.push({ type: 'slideshow', data: [...currentSlideshowGroup] })
        }
        return result
    }, [items])

    if (loading) {
        return (
            <section className="w-full bg-black py-20">
                <div className="container mx-auto px-4">
                    <div className="animate-pulse h-96 bg-gray-800 rounded-sm w-full"></div>
                </div>
            </section>
        )
    }

    if (sections.length === 0) return null

    return (
        <section className="w-full bg-black text-white overflow-hidden relative py-12 md:py-20">

            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-25 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-orange-600/15 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-amber-700/15 rounded-full blur-[120px]" />
            </div>

            <div className="container relative z-10 mx-auto px-4 md:px-8">

                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-10 md:mb-12 flex flex-col items-start gap-4"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-1.5 h-10 md:h-12 bg-orange-500 rounded-none shadow-[0_0_15px_rgba(249,115,22,0.5)]"></div>
                        <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-wide text-white">
                            Bring your games to life
                        </h2>
                    </div>
                    <p className="text-gray-400 max-w-2xl text-lg pl-6 md:pl-6 leading-relaxed">
                        Experience the next generation of visual fidelity with our latest display technology and immersive features.
                    </p>
                </motion.div>

                {/* THE STACK CONTAINER 
                    This is the magic part:
                    1. flex-col: Stacks children vertically.
                    2. rounded-sm + border: Creates the "Monolith" frame.
                    3. overflow-hidden: Clips the corners.
                    4. space-y-0: Removes ALL gaps between images/slideshows.
                */}
                <div className="flex flex-col rounded-sm border border-white/10 overflow-hidden bg-gray-900 shadow-2xl">
                    {sections.map((section, index) => {
                        if (section.type === 'standalone') {
                            return <StandaloneBanner key={`section-${index}`} item={section.data as BannerSectionItem} />
                        } else {
                            return <FeatureSlideshow key={`section-${index}`} items={section.data as BannerSectionItem[]} />
                        }
                    })}
                </div>
            </div>
        </section>
    )
}