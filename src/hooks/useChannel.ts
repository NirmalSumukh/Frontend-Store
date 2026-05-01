import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ✅ Define your channel slugs here (must match Saleor Dashboard > Channels)
export const CHANNELS = {
  B2C: 'customer-channel',
  B2B: 'b2b-channel',
} as const

export type ChannelType = typeof CHANNELS[keyof typeof CHANNELS]

interface ChannelState {
  currentChannel: ChannelType
  setChannel: (channel: ChannelType) => void
  resetChannel: () => void
  isB2BChannel: () => boolean
}

export const useChannel = create<ChannelState>()(
  persist(
    (set, get) => ({
      currentChannel: CHANNELS.B2C, // Default to B2C

      setChannel: (channel) => {
        console.log(`🔄 Channel switching to: ${channel}`)
        set({ currentChannel: channel })
      },

      resetChannel: () => {
        console.log('🔄 Channel reset to B2C')
        set({ currentChannel: CHANNELS.B2C })
      },

      isB2BChannel: () => {
        return get().currentChannel === CHANNELS.B2B
      },
    }),
    {
      name: 'saleor-channel',
    }
  )
)
