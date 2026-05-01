import { useEffect } from 'react'
import { useAuth } from './useAuth'
import { useChannel, CHANNELS } from './useChannel'

/**
 * Centralized hook that syncs user authentication with channel state
 * 
 * This ensures:
 * - B2B users automatically get B2B channel
 * - Logged out users get default B2C channel
 * - Product cards show correct prices without modification
 * 
 * Usage: Call this in your root App.tsx or Layout component
 */
export const useUserChannel = () => {
    const { user, isAuthenticated } = useAuth()
    const { currentChannel, setChannel, resetChannel, isB2BChannel } = useChannel()

    useEffect(() => {
        if (!isAuthenticated || !user) {
            // Not logged in -> default to B2C
            if (currentChannel !== CHANNELS.B2C) {
                resetChannel()
            }
            return
        }

        // Check if user has B2B metadata
        const userType = user.metadata?.find((m) => m.key === 'user_type')?.value
        const isB2BUser = userType === 'B2B'

        // Sync channel based on user type
        if (isB2BUser && currentChannel !== CHANNELS.B2B) {
            console.log('🏭 Syncing to B2B channel for authenticated B2B user')
            setChannel(CHANNELS.B2B)
        } else if (!isB2BUser && currentChannel !== CHANNELS.B2C) {
            console.log('👤 Syncing to B2C channel for authenticated customer')
            setChannel(CHANNELS.B2C)
        }
    }, [user, isAuthenticated, currentChannel, setChannel, resetChannel])

    return {
        currentChannel,
        isB2BChannel: isB2BChannel(),
        user,
        isAuthenticated,
    }
}
