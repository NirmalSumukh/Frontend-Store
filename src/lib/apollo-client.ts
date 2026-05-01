import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  createHttpLink,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_SALEOR_API_URL || 'http://localhost:8000/graphql/',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
})

// ✅ Enhanced Auth + Channel Link
const authLink = setContext((_, { headers }) => {
  const authStorage = localStorage.getItem('auth-storage')
  const channelStorage = localStorage.getItem('saleor-channel')

  let token = null
  let channel = 'customer-channel' // Default fallback

  // Parse auth token
  if (authStorage) {
    try {
      const parsed = JSON.parse(authStorage)
      token = parsed.state?.token || null
    } catch (error) {
      console.error('Failed to parse auth storage:', error)
    }
  }

  // Parse active channel
  if (channelStorage) {
    try {
      const parsed = JSON.parse(channelStorage)
      channel = parsed.state?.currentChannel || 'customer-channel'
    } catch (error) {
      console.error('Failed to parse channel storage:', error)
    }
  }

  return {
    headers: {
      ...headers,
      authorization: token ? `JWT ${token}` : '',
      // ✅ Critical: Saleor uses 'saleor-channel' header for multi-channel
      'saleor-channel': channel,
    },
  }
})

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, extensions }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Extensions: ${JSON.stringify(extensions)}`
      )

      const isAuthError =
        message === 'Signature has expired' ||
        message === 'Invalid token' ||
        message === 'You must be logged in' ||
        extensions?.code === 'UNAUTHENTICATED'

      if (isAuthError) {
        console.warn('⚠️ Authentication expired, logging out...')
        localStorage.removeItem('auth-storage')
        localStorage.removeItem('saleor-channel') // Reset channel on auth error
        window.location.href = '/login'
        return
      }

      const isPermissionError =
        extensions?.code === 'FORBIDDEN' ||
        extensions?.code === 'PermissionDenied' ||
        message.includes('permission') ||
        message.includes('MANAGE_SETTINGS')

      if (isPermissionError) {
        console.warn('⚠️ Permission denied:', message)
        return
      }
    })
  }

  if (networkError) {
    console.error(`[Network error]:`, networkError)
    if ('statusCode' in networkError && networkError.statusCode === 401) {
      console.warn('⚠️ 401 Unauthorized, logging out...')
      localStorage.removeItem('auth-storage')
      localStorage.removeItem('saleor-channel')
      window.location.href = '/login'
    }
  }
})

const link = ApolloLink.from([errorLink, authLink, httpLink])

export const apolloClient = new ApolloClient({
  link: link,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          products: {
            keyArgs: ['filter', 'sortBy', 'first', 'after', 'channel'],
            merge(incoming) {
              return incoming
            },
          },
          categories: {
            keyArgs: ['first'],
            merge(incoming) {
              return incoming
            },
          },
          shop: {
            merge(existing, incoming) {
              return { ...existing, ...incoming }
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-first',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'cache-first',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
})
