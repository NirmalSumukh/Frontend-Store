import { useQuery } from '@apollo/client'
import { gql } from '@apollo/client'
import { useChannel } from './useChannel'
import { useMemo } from 'react'

// ============================================================
// GRAPHQL QUERIES
// ============================================================

export const GET_CATEGORY_BY_SLUG = gql`
  query GetCategoryBySlug($slug: String!) {
    category(slug: $slug) {
      id
      name
      slug
    }
  }
`

// ✅ ENHANCED: Products query with full discount info
export const GET_PRODUCTS = gql`
  query GetProducts(
    $first: Int!
    $after: String
    $filter: ProductFilterInput
    $channel: String
  ) {
    products(
      first: $first
      after: $after
      filter: $filter
      channel: $channel
    ) {
      edges {
        node {
          id
          name
          slug
          description
          thumbnail {
            url
            alt
          }
          pricing {
            onSale
            discount {
              gross {
                amount
                currency
              }
            }
            priceRange {
              start {
                gross {
                  amount
                  currency
                }
              }
              stop {
                gross {
                  amount
                  currency
                }
              }
            }
            priceRangeUndiscounted {
              start {
                gross {
                  amount
                  currency
                }
              }
              stop {
                gross {
                  amount
                  currency
                }
              }
            }
          }
          category {
            id
            name
            slug
          }
          variants {
            id
            name
            sku
            quantityAvailable
            attributes {
              attribute {
                id
                name
                slug
              }
              values {
                id
                name
                slug
              }
            }
            pricing {
              onSale
              discount {
                gross {
                  amount
                  currency
                }
              }
              price {
                gross {
                  amount
                  currency
                }
              }
              priceUndiscounted {
                gross {
                  amount
                  currency
                }
              }
            }
            media {
              url
              alt
              type
            }
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`

// ✅ ENHANCED: Single Product Query with full discount data
export const GET_PRODUCT = gql`
  query GetProduct($slug: String!, $channel: String) {
    product(slug: $slug, channel: $channel) {
      id
      name
      slug
      description
      seoTitle
      seoDescription
      images {
        id
        url
        alt
      }
      pricing {
        onSale
        discount {
          gross {
            amount
            currency
          }
        }
        priceRange {
          start {
            gross {
              amount
              currency
            }
          }
        }
        priceRangeUndiscounted {
          start {
            gross {
              amount
              currency
            }
          }
        }
      }
      variants {
        id
        name
        sku
        quantityAvailable
        # 👇 THIS WAS MISSING
        metadata {
          key
          value
        }
        pricing {
          onSale
          discount {
            gross {
              amount
              currency
            }
          }
          price {
            gross {
              amount
              currency
            }
          }
          priceUndiscounted {
            gross {
              amount
              currency
            }
          }
        }
        attributes {
          attribute {
            name
          }
          values {
            name
          }
        }
        media {
          url
          alt
          type
        }
      }
      metadata {
        key
        value
      }
      category {
        id
        name
        slug
      }
    }
  }
`

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories(first: 100) {
      edges {
        node {
          id
          name
          slug
          backgroundImage {
            url
            alt
          }
        }
      }
    }
  }
`

// ✅ ENHANCED: Search Query with discount data
export const GET_ALL_PRODUCTS_FOR_SEARCH = gql`
  query GetAllProductsForSearch($channel: String) {
    products(
      first: 100
      channel: $channel
      filter: {
        isPublished: true
        isAvailable: true
        isVisibleInListing: true
      }
    ) {
      edges {
        node {
          id
          name
          slug
          thumbnail {
            url
            alt
          }
          pricing {
            onSale
            discount {
              gross {
                amount
                currency
              }
            }
            priceRange {
              start {
                gross {
                  amount
                  currency
                }
              }
            }
            priceRangeUndiscounted {
              start {
                gross {
                  amount
                  currency
                }
              }
            }
          }
          category {
            name
            slug
          }
        }
      }
    }
  }
`
// ============================================================
// CONTENT QUERIES  
// ============================================================

export const GET_PAGE_BY_SLUG = gql`
  query GetPageBySlug($slug: String!) {
    page(slug: $slug) {
      id
      title
      content
      seoTitle
      seoDescription
    }
  }
`

// ============================================================
// HOOKS
// ============================================================

export const useCategoryBySlug = (slug: string | null) => {
  return useQuery(GET_CATEGORY_BY_SLUG, {
    variables: { slug: slug || '' },
    skip: !slug,
    fetchPolicy: 'cache-and-network',
  })
}

export const useProducts = (
  variables: { first: number; after?: string; filter?: any } = { first: 12 }
) => {
  const { currentChannel } = useChannel()
  return useQuery(GET_PRODUCTS, {
    variables: {
      first: variables.first || 12,
      after: variables.after || null,
      filter: variables.filter,
      channel: currentChannel,
    },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  })
}

export const useProduct = (slug: string) => {
  const { currentChannel } = useChannel()
  return useQuery(GET_PRODUCT, {
    variables: {
      slug,
      channel: currentChannel,
    },
    skip: !slug,
    fetchPolicy: 'cache-first',
  })
}

export const useCategories = () => {
  return useQuery(GET_CATEGORIES, {
    fetchPolicy: 'cache-first',
  })
}

export const useProductSearch = (query: string) => {
  const { currentChannel } = useChannel()

  const { data, loading, error } = useQuery(GET_ALL_PRODUCTS_FOR_SEARCH, {
    variables: {
      channel: currentChannel || "customer-channel",
    },
    skip: !query || query.length < 2,
    fetchPolicy: 'cache-first',
  })

  const searchResults = useMemo(() => {
    if (!data?.products?.edges || !query) {
      return []
    }

    const lowerQuery = query.toLowerCase().trim()
    return data.products.edges
      .filter((edge: any) => {
        const product = edge.node
        const searchableText = [
          product.name || '',
          product.slug || '',
          product.category?.name || '',
        ].join(' ').toLowerCase()
        return searchableText.includes(lowerQuery)
      })
      .map((edge: any) => edge.node)
  }, [data, query])

  return {
    data: {
      products: {
        edges: searchResults.map((node: any) => ({ node }))
      }
    },
    loading,
    error,
  }
}

// ============================================================
// CONTENT HOOKS
// ============================================================

export const useStaticPage = (slug: string) => {
  return useQuery(GET_PAGE_BY_SLUG, {
    variables: { slug },
    skip: !slug,
    fetchPolicy: 'cache-and-network',
  })
}