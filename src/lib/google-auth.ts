// Google Identity Services Script Loader
const GOOGLE_SCRIPT_SRC = 'https://accounts.google.com/gsi/client'

export const loadGoogleScript = () => {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${GOOGLE_SCRIPT_SRC}"]`)) {
            resolve(true)
            return
        }
        const script = document.createElement('script')
        script.src = GOOGLE_SCRIPT_SRC
        script.async = true
        script.defer = true
        script.onload = () => resolve(true)
        script.onerror = () => reject(new Error('Failed to load Google script'))
        document.body.appendChild(script)
    })
}

export const initializeGoogleAuth = async (
    clientId: string,
    callback: (response: any) => void
) => {
    try {
        await loadGoogleScript()

        if (!window.google) {
            throw new Error('Google client not loaded')
        }

        // Initialize the Google Login Client
        const client = window.google.accounts.oauth2.initTokenClient({
            client_id: clientId,
            scope: 'email profile openid',
            callback: (tokenResponse: any) => {
                if (tokenResponse && tokenResponse.access_token) {
                    callback(tokenResponse)
                }
            },
        })

        return client
    } catch (error) {
        console.error('Google Auth Init Error:', error)
        return null
    }
}

// Type declaration for window.google
declare global {
    interface Window {
        google: {
            accounts: {
                oauth2: {
                    initTokenClient: (config: any) => {
                        requestAccessToken: () => void
                    }
                }
            }
        }
    }
}