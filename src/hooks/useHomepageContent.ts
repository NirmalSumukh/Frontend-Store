import { useMemo, useEffect, useRef } from 'react'
import { useQuery, useLazyQuery } from '@apollo/client'
import {
  GET_PAGE_TYPE_IDS,
  GET_HOMEPAGE_CONTENT,
  GET_PRODUCT_VARIANTS_BY_IDS,
} from '@/lib/content-queries'
import { useChannel } from './useChannel'

// Interfaces
export interface CarouselSlide {
  id: string
  heading: string
  description: string
  image: string
  mobileImage: string
  link: string
  sortOrder: number
}

export interface BannerSectionItem {
  id: string
  heading: string
  description: string
  image: string
  link: string
  sortOrder: number
}

export interface BestProductCard {
  id: string
  heading: string
  description: string
  image: string
  link: string
}

export interface PopupBanner {
  id: string
  image: string
  couponCode: string
}

export interface HomepageContent {
  carouselSlides: CarouselSlide[]
  bannerSection: BannerSectionItem[]
  bestProducts: BestProductCard[]
  popupBanner: PopupBanner | null
}

// Helper to safely extract attribute values
const getAttrValue = (attributes: any[], key: string): any => {
  const attr = attributes?.find((a: any) => a?.attribute?.slug === key || a?.attribute?.name === key)
  const attrValue = attr?.values?.[0]

  if (!attrValue) return null

  return {
    value: attrValue.value || attrValue.name || '',
    name: attrValue.name || attrValue.value || '',
    file: attrValue.file || null,
    reference: attrValue.reference || null,
  }
}

export const useHomepageContent = () => {
  const { currentChannel } = useChannel()
  const hasTriggeredProductFetch = useRef(false)

  // STEP 1: Fetch page type IDs
  const { data: pageTypeData, loading: pageTypeLoading } = useQuery(GET_PAGE_TYPE_IDS)

  // Extract page type IDs
  const pageTypeIds = useMemo(() => {
    if (!pageTypeData?.pageTypes?.edges) return null

    const typeMap = new Map<string, string>()
    pageTypeData.pageTypes.edges.forEach((edge: { node?: { id?: string; slug?: string } }) => {
      if (edge?.node?.slug && edge?.node?.id) {
        typeMap.set(edge.node.slug, edge.node.id)
      }
    })

    return {
      carouselSlide: typeMap.get('carousel') || typeMap.get('carousel-slide'),
      bannerSection: typeMap.get('banner') || typeMap.get('banner-section'),
      bestProducts: typeMap.get('best-products') || typeMap.get('best-product'),
      popupBanner: typeMap.get('pop-up-banner') || typeMap.get('popup-banner'),
    }
  }, [pageTypeData])

  // STEP 2: Fetch pages
  const {
    data: pagesData,
    loading: pagesLoading,
    error: pagesError,
  } = useQuery(GET_HOMEPAGE_CONTENT, {
    variables: {
      carouselPageTypeIds: pageTypeIds?.carouselSlide ? [pageTypeIds.carouselSlide] : ["UGFnZVR5cGU6OTk5OTk5"],
      bannerSectionPageTypeIds: pageTypeIds?.bannerSection ? [pageTypeIds.bannerSection] : ["UGFnZVR5cGU6OTk5OTk5"],
      bestProductsPageTypeIds: pageTypeIds?.bestProducts ? [pageTypeIds.bestProducts] : ["UGFnZVR5cGU6OTk5OTk5"],
      popupBannerPageTypeIds: pageTypeIds?.popupBanner ? [pageTypeIds.popupBanner] : ["UGFnZVR5cGU6OTk5OTk5"],
    },
    skip: !pageTypeIds || pageTypeLoading,
  })

  // STEP 3: Extract product variant IDs from carousel
  const productVariantIDs = useMemo(() => {
    if (!pagesData?.carouselPages?.edges) return []

    const ids = pagesData.carouselPages.edges
      .map((edge: { node?: { attributes?: any[] } }) => {
        if (!edge?.node?.attributes) return null
        const attrValue = getAttrValue(edge.node.attributes, 'carousel-link')
        return attrValue?.reference || null
      })
      .filter((id: string | null): id is string => id !== null && id !== undefined)
      .filter((id: string) => id.trim() !== '')

    return ids
  }, [pagesData])

  // STEP 4: Lazy query for product variants
  const [fetchProductVariants, { data: productVariantsData, loading: productsLoading }] = useLazyQuery(
    GET_PRODUCT_VARIANTS_BY_IDS
  )

  // STEP 5: Trigger product variant fetch
  useEffect(() => {
    if (
      !pagesLoading &&
      !pageTypeLoading &&
      productVariantIDs.length > 0 &&
      currentChannel &&
      !hasTriggeredProductFetch.current
    ) {
      hasTriggeredProductFetch.current = true

      fetchProductVariants({
        variables: {
          ids: productVariantIDs,
          channel: currentChannel,
        },
      })
    }
  }, [productVariantIDs, currentChannel, pagesLoading, pageTypeLoading, fetchProductVariants])

  // STEP 6: Build product slug map
  const productSlugMap = useMemo(() => {
    const map = new Map<string, string>()
    if (!productVariantsData?.productVariants?.edges) return map

    productVariantsData.productVariants.edges.forEach((edge: { node?: { id?: string; product?: { slug?: string } } }) => {
      if (edge?.node?.id && edge?.node?.product?.slug) {
        map.set(edge.node.id, edge.node.product.slug)
      }
    })

    return map
  }, [productVariantsData])

  // STEP 7: Parse all content
  const content: HomepageContent = useMemo(() => {
    // Parse Carousel
    const carouselSlides =
      pagesData?.carouselPages?.edges
        ?.map((edge: { node?: { id?: string; title?: string; attributes?: any[] } }) => {
          const node = edge?.node
          if (!node?.id || !node?.attributes) return null

          const attributes = node.attributes
          const linkRef = getAttrValue(attributes, 'carousel-link')?.reference
          const productSlug = linkRef ? productSlugMap.get(linkRef) : null
          const link = productSlug ? `/product/${productSlug}` : '#'

          const heading = getAttrValue(attributes, 'carousel-heading')
          const description = getAttrValue(attributes, 'carousel-description')
          const sortingOrder = getAttrValue(attributes, 'sorting-order')

          return {
            id: node.id,
            heading: heading?.value || heading?.name || '',
            description: description?.value || description?.name || '',
            image: getAttrValue(attributes, 'carousel-desktop-image')?.file?.url || getAttrValue(attributes, 'carousel-image')?.file?.url || getAttrValue(attributes, 'Carousel Desktop Image')?.file?.url || '',
            mobileImage: getAttrValue(attributes, 'carousel-mobile-image')?.file?.url || getAttrValue(attributes, 'Carousel Mobile Image')?.file?.url || '',
            link: link,
            sortOrder: parseInt(sortingOrder?.value || sortingOrder?.name || '0', 10),
          }
        })
        .filter((item: CarouselSlide | null): item is CarouselSlide => item !== null)
        .sort((a: CarouselSlide, b: CarouselSlide) => a.sortOrder - b.sortOrder) || []

    // Parse Banner Section
    const bannerSection =
      pagesData?.bannerSectionPages?.edges
        ?.map((edge: { node?: { id?: string; title?: string; attributes?: any[] } }) => {
          const node = edge?.node
          if (!node?.id || !node?.attributes) return null

          const attributes = node.attributes

          // ✅ FIX: We strictly use the attribute value. 
          // If 'banner-heading' attribute is empty, this returns "".
          // We do NOT fallback to node.title.
          const heading = getAttrValue(attributes, 'banner-heading')?.value || ''

          return {
            id: node.id,
            heading: heading,
            description: getAttrValue(attributes, 'banner-description')?.value || '',
            image: getAttrValue(attributes, 'banner-image')?.file?.url || '',
            link: getAttrValue(attributes, 'banner-link')?.value || '#',
            sortOrder: parseInt(getAttrValue(attributes, 'sorting-order')?.value || '0', 10),
          }
        })
        .filter((item: BannerSectionItem | null): item is BannerSectionItem => item !== null)
        .sort((a: BannerSectionItem, b: BannerSectionItem) => a.sortOrder - b.sortOrder) || []

    // Parse Best Products
    const bestProducts =
      pagesData?.bestProductPages?.edges
        ?.map((edge: { node?: { id?: string; attributes?: any[] } }) => {
          const node = edge?.node
          if (!node?.id || !node?.attributes) return null

          const attributes = node.attributes
          return {
            id: node.id,
            heading: getAttrValue(attributes, 'best-product-heading')?.value || '',
            description: getAttrValue(attributes, 'best-product-description')?.value || '',
            image: getAttrValue(attributes, 'best-product-image')?.file?.url || '',
            link: getAttrValue(attributes, 'best-product-link')?.value || '',
          }
        })
        .filter((item: BestProductCard | null): item is BestProductCard => item !== null) || []

    // Parse Popup Banner
    const popupNode = pagesData?.popupBannerPages?.edges?.[0]?.node
    const popupBanner = popupNode?.id && popupNode?.attributes
      ? {
        id: popupNode.id,
        image: getAttrValue(popupNode.attributes, 'pop-up-banner-image')?.file?.url || '',
        couponCode: getAttrValue(popupNode.attributes, 'coupon-code')?.value || '',
      }
      : null

    return { carouselSlides, bannerSection, bestProducts, popupBanner }
  }, [pagesData, productSlugMap])

  return {
    content,
    loading: pageTypeLoading || pagesLoading || productsLoading,
    error: pagesError,
  }
}