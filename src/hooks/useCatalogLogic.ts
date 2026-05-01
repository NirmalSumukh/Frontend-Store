import { useState, useMemo, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useCart } from '@/hooks/useCart'
import toast from 'react-hot-toast'

export const useCatalogLogic = (
    productsData: any,
    dealsOnly: boolean = false
) => {
    const [, setSearchParams] = useSearchParams()
    const { addItem, toggleCart } = useCart()
    const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})

    // 1. Transform Raw Data into Flat Variants
    const rawProducts = useMemo(
        () => productsData?.products?.edges?.map((edge: any) => edge.node) || [],
        [productsData]
    )

    const allVariants = useMemo(() => {
        const variants: any[] = []

        for (const p of rawProducts) {
            if (!p.variants || p.variants.length === 0) continue

            for (const v of p.variants) {
                const price = v.pricing?.price?.gross?.amount ?? 0
                const currency = v.pricing?.price?.gross?.currency ?? 'INR'
                const undiscountedPrice = v.pricing?.priceUndiscounted?.gross?.amount ?? undefined

                // ✅ LOGIC: If dealsOnly is true, skip items with no discount
                if (dealsOnly) {
                    const hasDiscount = undiscountedPrice && undiscountedPrice > price
                    if (!hasDiscount) continue;
                }

                const thumbnail =
                    v.media?.[0]?.url ||
                    v.thumbnail?.url ||
                    v.images?.[0]?.url ||
                    p.thumbnail?.url ||
                    p.images?.[0]?.url ||
                    p.media?.[0]?.url ||
                    ''

                const specs =
                    v.attributes?.map((attr: any) => ({
                        label: attr.attribute.name,
                        value: attr.values[0]?.name || 'N/A',
                    })) || []

                variants.push({
                    id: v.id,
                    productId: p.id,
                    variantId: v.id,
                    variantName: v.name,
                    name: p.name,
                    slug: p.slug,
                    price,
                    undiscountedPrice,
                    currency,
                    thumbnail,
                    specs,
                    quantityAvailable: v.quantityAvailable,
                    _rawAttributes: v.attributes || [],
                })
            }
        }

        return variants
    }, [rawProducts, dealsOnly])

    // 2. Generate Dynamic Filters based on the available variants
    const { dynamicFilters, attributeMap } = useMemo(() => {
        const attributeValuesMap = new Map<
            string,
            {
                name: string
                values: Map<string, { name: string; slug: string; count: number }>
            }
        >()

        for (const variant of allVariants) {
            for (const attr of variant._rawAttributes) {
                const attrSlug = attr.attribute.slug
                const attrName = attr.attribute.name

                if (!attributeValuesMap.has(attrSlug)) {
                    attributeValuesMap.set(attrSlug, {
                        name: attrName,
                        values: new Map(),
                    })
                }

                const attrData = attributeValuesMap.get(attrSlug)!

                for (const value of attr.values) {
                    const existing = attrData.values.get(value.slug)
                    if (existing) {
                        existing.count++
                    } else {
                        attrData.values.set(value.slug, {
                            name: value.name,
                            slug: value.slug,
                            count: 1,
                        })
                    }
                }
            }
        }

        const filters = Array.from(attributeValuesMap.entries())
            .filter(([, data]) => data.values.size > 0)
            .map(([slug, data]) => ({
                label: data.name,
                value: slug,
                options: Array.from(data.values.values()).map((v) => v.name),
            }))

        const map = new Map<string, { slug: string; name: string }>()
        for (const [attrSlug, data] of attributeValuesMap) {
            for (const value of data.values.values()) {
                map.set(`${attrSlug}:${value.name}`, { slug: value.slug, name: value.name })
                map.set(`${attrSlug}:${value.slug}`, { slug: value.slug, name: value.name })
            }
        }

        return { dynamicFilters: filters, attributeMap: map }
    }, [allVariants])

    // 3. Apply Active Filters
    const filteredVariants = useMemo(() => {
        if (Object.keys(activeFilters).length === 0) {
            return allVariants
        }

        return allVariants.filter((variant: any) => {
            return Object.entries(activeFilters).every(([attributeSlug, valueSlug]) => {
                if (!valueSlug) return true

                const attribute = variant._rawAttributes.find(
                    (attr: any) => attr.attribute.slug === attributeSlug
                )
                if (!attribute) return false

                return attribute.values.some((v: any) => v.slug === valueSlug)
            })
        })
    }, [allVariants, activeFilters])

    // 4. Helpers
    const getSlugForChoice = useCallback(
        (attributeSlug: string, choiceName: string): string => {
            if (!choiceName) return ''
            return attributeMap.get(`${attributeSlug}:${choiceName}`)?.slug || ''
        },
        [attributeMap]
    )

    const getNameForChoice = useCallback(
        (attributeSlug: string, choiceSlug: string): string => {
            if (!choiceSlug) return ''
            return attributeMap.get(`${attributeSlug}:${choiceSlug}`)?.name || ''
        },
        [attributeMap]
    )

    const handleToggleFilter = useCallback(
        (attributeSlug: string, optionName: string) => {
            const optionSlug = getSlugForChoice(attributeSlug, optionName)

            setActiveFilters((prev) => {
                if (prev[attributeSlug] === optionSlug) {
                    const { [attributeSlug]: _, ...rest } = prev
                    return rest
                }
                return { ...prev, [attributeSlug]: optionSlug }
            })

            setSearchParams((params) => {
                if (optionSlug) {
                    params.set(attributeSlug, optionSlug)
                } else {
                    params.delete(attributeSlug)
                }
                return params
            })
        },
        [getSlugForChoice, setSearchParams]
    )

    const handleClearFilters = useCallback(() => {
        setActiveFilters({})
        setSearchParams((params) => {
            // Keep category if it exists, clear others
            const category = params.get('category')
            const newParams = new URLSearchParams()
            if (category) newParams.set('category', category)
            return newParams
        })
    }, [setSearchParams])

    const handleAddToCart = useCallback(
        (product: any) => {
            addItem({
                id: product.variantId || product.id,
                variantId: product.variantId || product.id,
                productId: product.productId || product.id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                quantity: 1,
                thumbnail: product.thumbnail,
                variant: {
                    name: product.variantName || 'Default',
                    attributes: product.specs?.reduce(
                        (acc: Record<string, string>, spec: any) => {
                            acc[spec.label] = spec.value
                            return acc
                        },
                        {}
                    ) || {},
                },
            })

            toast.success(`${product.name} added to cart`, {
                icon: '🛒',
                duration: 2000,
            })
            toggleCart()
        },
        [addItem, toggleCart]
    )

    return {
        filteredVariants,
        dynamicFilters,
        activeFilters,
        handleToggleFilter,
        handleClearFilters,
        handleAddToCart,
        getNameForChoice
    }
}