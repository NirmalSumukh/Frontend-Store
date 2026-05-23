import toast from 'react-hot-toast'

// Define Window interface for Shiprocket's global object
declare global {
    interface Window {
        HeadlessCheckout: {
            addToCart: (
                event: any,
                token: string,
                config: { fallbackUrl: string }
            ) => void
        }
    }
}

interface CartItem {
    variantId: string
    quantity: number
}

/**
 * 1. Calls YOUR backend to generate the Shiprocket Token
 */
const getShiprocketToken = async (items: CartItem[]) => {
    const endpoint = `/api/shiprocket/checkout/authorize`

    const requestPayload = {
        cart_data: {
            items: items.map(item => ({
                variant_id: item.variantId,
                quantity: item.quantity
            }))
        },
        redirect_url: window.location.origin + '/account/orders',
    }

    console.log('[Shiprocket] Step 1: Requesting token from:', endpoint)
    console.log('[Shiprocket] Payload:', JSON.stringify(requestPayload, null, 2))

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload),
    })

    const data = await response.json()
    console.log('[Shiprocket] Token Response Status:', response.status)
    console.log('[Shiprocket] Token Response Data:', JSON.stringify(data, null, 2))

    if (!data.success || !data.token) {
        throw new Error(data.error || `Token generation failed with status ${response.status}`)
    }

    return data.token
}

/**
 * 2. Triggers the Shiprocket Popup
 */
export const initiateShiprocketCheckout = async (
    event: any,
    cartItems: any[]
) => {
    console.log('[Shiprocket] Checkout initiated. Cart items:', cartItems.length)
    console.log('[Shiprocket] window.HeadlessCheckout available:', !!window.HeadlessCheckout)
    console.log('[Shiprocket] window.HeadlessCheckout value:', window.HeadlessCheckout)

    const toastId = toast.loading('Securing checkout...')

    try {
        // Step A: Verify SDK is loaded
        if (!window.HeadlessCheckout) {
            console.error('[Shiprocket] SDK NOT loaded. window.HeadlessCheckout is undefined.')
            console.error('[Shiprocket] Available window keys (shiprocket-related):', 
                Object.keys(window).filter(k => k.toLowerCase().includes('checkout') || k.toLowerCase().includes('shiprocket') || k.toLowerCase().includes('headless'))
            )
            throw new Error('Shiprocket checkout script is not loaded. Please refresh the page and try again.')
        }

        // Step B: Get the token from your backend
        console.log('[Shiprocket] Step 2: Getting token...')
        const token = await getShiprocketToken(cartItems)
        console.log('[Shiprocket] Step 3: Token received. Calling addToCart...')

        // Step C: Launch Shiprocket Headless Checkout
        window.HeadlessCheckout.addToCart(event, token, {
            fallbackUrl: window.location.origin + '/cart',
        })

        console.log('[Shiprocket] Step 4: addToCart called successfully.')
        toast.dismiss(toastId)

    } catch (error: any) {
        toast.dismiss(toastId)
        toast.error(error?.message || 'Checkout failed. Please try again.')
        console.error('[Shiprocket] Checkout Error:', error)
    }
}