import { useState } from 'react'
import { gql, useMutation } from '@apollo/client'
import { useCart } from './useCart'
import { useAuth } from './useAuth'
import { useChannel } from './useChannel'
import toast from 'react-hot-toast'

// --- GRAPHQL MUTATIONS ---

const CREATE_CHECKOUT = gql`
  mutation CreateCheckout($email: String, $channel: String!, $lines: [CheckoutLineInput!]!) {
    checkoutCreate(
      input: {
        email: $email
        channel: $channel
        lines: $lines
      }
    ) {
      checkout {
        id
        token
        totalPrice {
          gross {
            amount
            currency
          }
        }
      }
      errors {
        field
        message
      }
    }
  }
`

const ADD_PROMO_CODE = gql`
  mutation AddPromoCode($checkoutId: ID!, $promoCode: String!) {
    checkoutAddPromoCode(checkoutId: $checkoutId, promoCode: $promoCode) {
      checkout {
        id
        totalPrice {
          gross {
            amount
            currency
          }
        }
        discount {
          amount
        }
        giftCards {
          last4CodeChars
        }
      }
      errors {
        field
        message
      }
    }
  }
`

const REMOVE_PROMO_CODE = gql`
  mutation RemovePromoCode($checkoutId: ID!, $promoCode: String!) {
    checkoutRemovePromoCode(checkoutId: $checkoutId, promoCode: $promoCode) {
      checkout {
        id
        totalPrice {
          gross {
            amount
            currency
          }
        }
      }
      errors {
        field
        message
      }
    }
  }
`

// --- HOOK ---

export const useCheckoutLogic = () => {
  const { items, getTotalPrice } = useCart()
  const { user } = useAuth()
  const { currentChannel } = useChannel()

  const [checkoutToken, setCheckoutToken] = useState<string | null>(null)
  const [promoDiscount, setPromoDiscount] = useState(0)
  const [appliedVoucher, setAppliedVoucher] = useState<string | null>(null)
  const [isApplying, setIsApplying] = useState(false)

  const [createCheckoutMutation] = useMutation(CREATE_CHECKOUT)
  const [addPromoCodeMutation] = useMutation(ADD_PROMO_CODE)
  const [removePromoCodeMutation] = useMutation(REMOVE_PROMO_CODE)

  // 1. Initialize/Sync Checkout
  const initializeCheckout = async () => {
    // If we have no items, we can't create a checkout
    if (items.length === 0) return null

    // Prepare lines for Saleor
    const lines = items.map(item => ({
      variantId: item.variantId,
      quantity: item.quantity
    }))

    try {
      const { data } = await createCheckoutMutation({
        variables: {
          email: user?.email || 'guest@example.com', // Required by Saleor to calc shipping sometimes
          channel: currentChannel,
          lines
        }
      })

      if (data.checkoutCreate.errors.length > 0) {
        console.error("Checkout Create Error:", data.checkoutCreate.errors)
        return null
      }

      // Fix: Use the GraphQL 'id' (which maps to ID!) instead of the raw UUID 'token'
      const checkoutId = data.checkoutCreate.checkout.id
      setCheckoutToken(checkoutId)
      return checkoutId
    } catch (error) {
      console.error("Failed to init checkout:", error)
      return null
    }
  }

  // 2. Apply Voucher
  const applyVoucher = async (code: string) => {
    setIsApplying(true)

    let currentId = checkoutToken
    if (!currentId) {
      currentId = await initializeCheckout()
    }

    if (!currentId) {
      toast.error("Could not validate cart with server")
      setIsApplying(false)
      return false
    }

    try {
      const { data } = await addPromoCodeMutation({
        variables: {
          checkoutId: currentId, // Matches $checkoutId: ID!
          promoCode: code
        }
      })

      const errors = data.checkoutAddPromoCode.errors
      if (errors.length > 0) {
        toast.error(errors[0].message)
        setIsApplying(false)
        return false
      }

      const checkout = data.checkoutAddPromoCode.checkout

      // Calculate discount difference
      const serverTotal = checkout.totalPrice.gross.amount
      const localTotal = getTotalPrice()

      const discount = Math.max(0, localTotal - serverTotal)

      setPromoDiscount(discount)
      setAppliedVoucher(code)
      toast.success("Voucher applied successfully!")

      setIsApplying(false)
      return true

    } catch (error) {
      toast.error("Failed to apply voucher")
      console.error(error)
      setIsApplying(false)
      return false
    }
  }

  // 3. Remove Voucher
  const removeVoucher = async () => {
    if (!checkoutToken || !appliedVoucher) return

    try {
      await removePromoCodeMutation({
        variables: {
          checkoutId: checkoutToken, // Matches $checkoutId: ID!
          promoCode: appliedVoucher
        }
      })
      setPromoDiscount(0)
      setAppliedVoucher(null)
      toast.success("Voucher removed")
    } catch (error) {
      console.error(error)
    }
  }

  return {
    applyVoucher,
    removeVoucher,
    promoDiscount,
    appliedVoucher,
    checkoutToken,
    isApplying // Exposed for the CartSummary component
  }
}