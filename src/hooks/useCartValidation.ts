import { useEffect } from 'react'
import { gql, useLazyQuery } from '@apollo/client'
import { useCart } from './useCart'
import { useChannel } from './useChannel'
import { useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'

export const GET_VARIANTS_STOCK = gql`
  query GetVariantsStock($ids: [ID!]!, $channel: String) {
    productVariants(first: 50, ids: $ids, channel: $channel) {
      edges {
        node {
          id
          name
          quantityAvailable
        }
      }
    }
  }
`

export const useCartValidation = () => {
  const { items, removeItem, isOpen } = useCart()
  const { currentChannel } = useChannel()
  const [fetchStock] = useLazyQuery(GET_VARIANTS_STOCK)
  const location = useLocation()

  useEffect(() => {
    if (items.length === 0) return

    const validateCart = async () => {
      const variantIds = items.map((i) => i.variantId)
      
      try {
        const { data } = await fetchStock({
          variables: { ids: variantIds, channel: currentChannel },
          fetchPolicy: 'network-only' // Always get fresh data on check
        })

        if (data?.productVariants?.edges) {
          const variants = data.productVariants.edges.map((e: any) => e.node)
          
          items.forEach((item) => {
            const variant = variants.find((v: any) => v.id === item.variantId)
            
            // Only remove if strictly out of stock
            if (!variant || variant.quantityAvailable === 0) {
              removeItem(item.variantId)
              toast.error(`"${item.name}" was automatically removed because it is out of stock.`, {
                duration: 5000,
                position: 'top-center' // Or bottom-center
              })
            }
          })
        }
      } catch (error) {
        console.error("Failed to validate cart stock:", error)
      }
    }
    
    validateCart()
    
    // Dependencies: trigger when items count changes, drawer is opened, or route changes
  }, [items.length, isOpen, location.pathname, currentChannel, fetchStock, removeItem])
}
