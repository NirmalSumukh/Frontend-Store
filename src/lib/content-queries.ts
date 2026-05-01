import { gql } from '@apollo/client'

const PAGE_ATTRIBUTE_FIELDS = gql`
  fragment PageAttributeFields on Page {
    id
    title
    attributes {
      attribute {
        slug
        name
      }
      values {
        name
        slug
        value
        file {
          url
        }
        reference
      }
    }
  }
`

export const GET_PAGE_TYPE_IDS = gql`
  query GetPageTypeIds {
    pageTypes(first: 50) {
      edges {
        node {
          id
          slug
        }
      }
    }
  }
`

export const GET_HOMEPAGE_CONTENT = gql`
  ${PAGE_ATTRIBUTE_FIELDS}
  query GetHomepageContent(
    $carouselPageTypeIds: [ID!]
    $bannerSectionPageTypeIds: [ID!] # 👈 Renamed from partner
    $bestProductsPageTypeIds: [ID!]
    $popupBannerPageTypeIds: [ID!]
  ) {
    carouselPages: pages(
      first: 10
      filter: { pageTypes: $carouselPageTypeIds }
    ) {
      edges {
        node {
          ...PageAttributeFields
        }
      }
    }
    
    # 👈 Changed from partnerPages to bannerSectionPages
    bannerSectionPages: pages(
      first: 10
      filter: { pageTypes: $bannerSectionPageTypeIds }
    ) {
      edges {
        node {
          ...PageAttributeFields
        }
      }
    }
    
    bestProductPages: pages(
      first: 10
      filter: { pageTypes: $bestProductsPageTypeIds }
    ) {
      edges {
        node {
          ...PageAttributeFields
        }
      }
    }
    
    popupBannerPages: pages(
      first: 1
      filter: { pageTypes: $popupBannerPageTypeIds }
    ) {
      edges {
        node {
          ...PageAttributeFields
        }
      }
    }
  }
`

export const GET_PRODUCT_VARIANTS_BY_IDS = gql`
  query GetProductVariantsByIds($ids: [ID!]!, $channel: String) {
    productVariants(first: 50, ids: $ids, channel: $channel) {
      edges {
        node {
          id
          product {
            id
            slug
            name
          }
        }
      }
    }
  }
`

export const GET_PRODUCTS_BY_IDS = gql`
  query GetProductsByIds($ids: [ID!]!, $channel: String) {
    products(first: 50, filter: { ids: $ids }, channel: $channel) {
      edges {
        node {
          id
          slug
          name
        }
      }
    }
  }
`

export const GET_VOUCHER_PAGES = gql`
  query GetVoucherPages {
    pages(first: 10) {
      edges {
        node {
          id
          title
          metadata {
            key
            value
          }
          attributes {
            attribute {
              slug
            }
            values {
              name  # This acts as the actual Code (e.g., WELCOME10)
              value # Legacy description if populated
              richText # Description is stored as JSON here
            }
          }
        }
      }
    }
  }
`

export const GET_ANNOUNCEMENT_BAR = gql`
  query GetAnnouncementBar {
    pages(first: 1, filter: { search: "announcement" }) {
      edges {
        node {
          id
          attributes {
            attribute {
              slug
            }
            values {
              name
              value
            }
          }
        }
      }
    }
  }
`