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
    // ✅ Always use a relative URL.
    // In development: Vite proxy (vite.config.ts) forwards /api/shiprocket/ → shiprocket app
    // In production:  Nginx proxy (nginx.conf) forwards /api/shiprocket/ → shiprocket app
    // This avoids all CORS issues since the request stays on the same origin.
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

    console.log("🚀 Requesting Shiprocket Token from:", endpoint)
    console.log("📦 Request Payload:", JSON.stringify(requestPayload, null, 2))

    try {
        // Calling your specific Next.js backend endpoint
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestPayload),
        })

        const data = await response.json()
        console.log("📥 Response Status:", response.status)
        console.log("📥 Response Data:", JSON.stringify(data, null, 2))

        if (!data.success || !data.token) {
            const errorMsg = data.error || 'Failed to generate token'
            throw new Error(errorMsg)
        }

        return data.token
    } catch (error) {
        console.error('Token Generation Error:', error)
        throw error
    }
}

/**
 * 2. Triggers the Shiprocket Popup
 */
export const initiateShiprocketCheckout = async (
    event: any,
    cartItems: any[]
) => {
    const toastId = toast.loading('Securing checkout...')

    try {
        // Step A: Get the token from your backend
        const token = await getShiprocketToken(cartItems)

        // Step B: Launch Shiprocket Headless Checkout
        if (window.HeadlessCheckout) {
            toast.dismiss(toastId)

            window.HeadlessCheckout.addToCart(event, token, {
                fallbackUrl: window.location.origin + '/cart',
            })
        } else {
            throw new Error('Checkout script not loaded')
        }
    } catch (error) {
        toast.dismiss(toastId)
        toast.error('Checkout failed. Please try again.')
        console.error(error)
    }
}