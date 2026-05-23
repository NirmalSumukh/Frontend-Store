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

// Helper to generate UUIDs
const generateUUID = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
})

/**
 * Build the Shiprocket checkout URL directly.
 * 
 * From the SDK source code (shopify.js), the checkout UI URL is:
 *   https://fastrr-boost-ui.pickrr.com/?{params}#cart={base64Cart}
 */
const buildCheckoutUrl = (token: string): string => {
    const baseUrl = 'https://fastrr-boost-ui.pickrr.com/'
    const sellerDomain = document.getElementById('sellerDomain')?.getAttribute('value') || window.location.host

    const fastrrUuid = localStorage.getItem('fastrr_uuid') || generateUUID()
    const fastrrUsid = localStorage.getItem('fastrr_usid') || `${fastrrUuid}-${Date.now()}`
    
    // Save these just in case Shiprocket requires them across sessions
    localStorage.setItem('fastrr_uuid', fastrrUuid)
    localStorage.setItem('fastrr_usid', fastrrUsid)

    const shortUuid = generateUUID().slice(0, 8)

    // Channel data expected by the checkout UI
    const channelData = {
        shop_name: 'company-logo',
        shop_url: sellerDomain,
        redirectUrl: window.location.origin + '/account/orders',
        credInstalled: false,
        gpayInstalled: 'YES'
    }

    const channelEncoded = window.btoa(encodeURIComponent(JSON.stringify(channelData)))
    const emptyCartEncoded = window.btoa(encodeURIComponent(JSON.stringify([])))

    const params = new URLSearchParams({
        customCheckoutToken: token,
        type: 'cart',
        platform: 'CUSTOM',
        channel: channelEncoded,
        uuid: shortUuid,
        userDeviceId: fastrrUuid,
        userSessionId: fastrrUsid,
    })

    // The SDK specifically adds the 'cart' param as a hash fragment!
    // "cart"===t?(o="#".concat(t,"=").concat(i),null)
    return `${baseUrl}?${params.toString()}#cart=${emptyCartEncoded}`
}

/**
 * 2. Triggers the Shiprocket Checkout
 */
export const initiateShiprocketCheckout = async (
    event: any,
    cartItems: any[]
) => {
    // Prevent any default navigation synchronously
    if (event?.preventDefault) event.preventDefault()
    if (event?.stopPropagation) event.stopPropagation()

    console.log('[Shiprocket] Checkout initiated. Cart items:', cartItems.length)

    const toastId = toast.loading('Securing checkout...')

    try {
        // Step 1: Get the token from our backend
        const token = await getShiprocketToken(cartItems)
        console.log('[Shiprocket] Token received:', token)

        // Step 2: Build the checkout URL and navigate directly
        const checkoutUrl = buildCheckoutUrl(token)
        console.log('[Shiprocket] Opening checkout URL:', checkoutUrl)

        toast.dismiss(toastId)

        // Navigate to Shiprocket's hosted checkout page directly
        window.location.href = checkoutUrl

    } catch (error: any) {
        toast.dismiss(toastId)
        toast.error(error?.message || 'Checkout failed. Please try again.')
        console.error('[Shiprocket] Checkout Error:', error)
    }
}