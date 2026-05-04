import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CHANNELS } from './useChannel'

// --- TYPES ---
interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  isStaff: boolean
  permissions: string[]
  metadata: { key: string; value: string }[]
}

interface AddressInput {
  firstName: string
  lastName: string
  companyName?: string
  streetAddress1: string
  streetAddress2?: string
  city: string
  postalCode: string
  country: string
  phone: string
}

interface RegisterInput {
  email: string
  password: string
  redirectUrl: string
  channel: string
  firstName?: string
  lastName?: string
  gstNumber?: string // For B2B registration
}

interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean

  // Actions
  login: (email: string, password: string) => Promise<void>
  register: (input: RegisterInput) => Promise<{ userId: string }>
  updateUserMetadata: (userId: string, key: string, value: string) => Promise<void>
  addAddress: (userId: string, address: AddressInput, type?: 'BILLING' | 'SHIPPING') => Promise<void>
  confirmAccount: (email: string, token: string) => Promise<boolean>
  logout: () => void
  setUser: (user: User, token: string, refreshToken?: string) => void
  refreshAccessToken: () => Promise<void>
  getUserType: () => 'B2B' | 'B2C' | null
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,

      // ✅ LOGIN
      login: async (email: string, password: string) => {
        try {
          const response = await fetch(
            import.meta.env.VITE_SALEOR_API_URL || 'http://localhost:8000/graphql/',
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                query: `
                  mutation TokenCreate($email: String!, $password: String!) {
                    tokenCreate(email: $email, password: $password) {
                      token
                      refreshToken
                      user {
                        id
                        email
                        firstName
                        lastName
                        isStaff
                        metadata {
                          key
                          value
                        }
                      }
                      errors {
                        field
                        message
                      }
                    }
                  }
                `,
                variables: { email, password },
              }),
            }
          )

          const data = await response.json()
          if (!data.data?.tokenCreate) {
            throw new Error(data.errors?.[0]?.message || 'Login failed')
          }

          const { token, refreshToken, user, errors } = data.data.tokenCreate
          if (errors && errors.length > 0) {
            throw new Error(errors[0].message || 'Login failed')
          }

          // Set auth state first
          set({
            token,
            refreshToken: refreshToken || null,
            user: {
              ...user,
              permissions: [],
              metadata: user.metadata || [],
            },
            isAuthenticated: true,
          })

          // ✅ Check if this is first login after registration
          const pendingMetadata = localStorage.getItem('pending-user-metadata')

          if (pendingMetadata) {
            try {
              const metadata = JSON.parse(pendingMetadata)

              // Only apply if email matches and metadata not already set
              const hasUserType = user.metadata?.some((m: any) => m.key === 'user_type')

              if (metadata.email === email && !hasUserType) {
                console.log('🔄 Applying pending registration metadata...')

                // Update user_type
                await get().updateUserMetadata(user.id, 'user_type', metadata.userType)

                // Update GST if provided
                if (metadata.gstNumber) {
                  await get().updateUserMetadata(user.id, 'gst_number', metadata.gstNumber)
                }

                console.log('✅ Metadata applied successfully')

                // Clear pending metadata
                localStorage.removeItem('pending-user-metadata')

                // Refresh user data to include new metadata
                const updatedUser = {
                  ...user,
                  metadata: [
                    ...user.metadata,
                    { key: 'user_type', value: metadata.userType },
                    ...(metadata.gstNumber ? [{ key: 'gst_number', value: metadata.gstNumber }] : [])
                  ]
                }

                set({ user: updatedUser })
              } else {
                // Clear stale metadata if email doesn't match
                localStorage.removeItem('pending-user-metadata')
              }
            } catch (error) {
              console.error('Failed to apply pending metadata:', error)
              // Don't fail login if metadata update fails
              localStorage.removeItem('pending-user-metadata')
            }
          }
        } catch (error) {
          console.error('Login error:', error)
          throw error
        }
      },

      // ✅ REGISTER WITH B2B SUPPORT
      register: async (input: RegisterInput) => {
        console.log('🚀 Starting registration...', { email: input.email, channel: input.channel })

        try {
          // Step 1: Create account (ignore the returned user.id as it's deprecated)
          const registerResponse = await fetch(
            import.meta.env.VITE_SALEOR_API_URL || 'http://localhost:8000/graphql/',
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                query: `
                  mutation AccountRegister($input: AccountRegisterInput!) {
                    accountRegister(input: $input) {
                      requiresConfirmation
                      errors {
                        field
                        message
                        code
                      }
                    }
                  }
                `,
                variables: {
                  input: {
                    email: input.email,
                    password: input.password,
                    redirectUrl: input.redirectUrl,
                    channel: input.channel,
                    firstName: input.firstName || '',
                    lastName: input.lastName || '',
                  },
                },
              }),
            }
          )

          const registerData = await registerResponse.json()

          // Check for errors
          if (registerData.errors) {
            throw new Error(registerData.errors[0].message)
          }

          const result = registerData.data?.accountRegister
          if (result?.errors && result.errors.length > 0) {
            throw new Error(result.errors[0].message)
          }

          const requiresConfirmation = result.requiresConfirmation

          console.log('✅ Account created, requiresConfirmation:', requiresConfirmation)

          // Step 2: Login to get the REAL user ID and token
          if (!requiresConfirmation) {
            console.log('🔐 Auto-logging in to retrieve real user ID...')

            await get().login(input.email, input.password)

            // Now we have the real user object with ID
            const currentUser = get().user
            const realUserId = currentUser?.id

            if (!realUserId) {
              throw new Error('Failed to retrieve user ID after registration')
            }

            console.log('✅ Real user ID retrieved:', realUserId)

            // Step 3: Update metadata with the real user ID
            const userType = input.channel === CHANNELS.B2B ? 'B2B' : 'B2C'

            console.log('📝 Updating metadata...', { userId: realUserId, userType })

            await get().updateUserMetadata(realUserId, 'user_type', userType)

            if (input.gstNumber) {
              await get().updateUserMetadata(realUserId, 'gst_number', input.gstNumber)
            }

            console.log('✅ Metadata updated successfully')

            // Step 4: Update local state with metadata
            set({
              user: {
                ...currentUser,
                metadata: [
                  ...(currentUser.metadata || []),
                  { key: 'user_type', value: userType },
                  ...(input.gstNumber ? [{ key: 'gst_number', value: input.gstNumber }] : [])
                ]
              }
            })

            return { userId: realUserId, autoLoggedIn: true }
          } else {
            // Email verification required - store metadata for later
            console.log('📧 Email verification required')

            const registrationMetadata = {
              userType: input.channel === CHANNELS.B2B ? 'B2B' : 'B2C',
              gstNumber: input.gstNumber || null,
              email: input.email,
              registeredAt: new Date().toISOString(),
            }

            localStorage.setItem('pending-user-metadata', JSON.stringify(registrationMetadata))

            return { userId: '', autoLoggedIn: false }
          }
        } catch (error) {
          console.error('❌ Registration error:', error)
          throw error
        }
      },

      // ✅ UPDATE USER METADATA (Store B2B/B2C Type & GST)
      updateUserMetadata: async (userId: string, key: string, value: string) => {
        const token = get().token

        if (!token) {
          throw new Error('Authentication required to update metadata')
        }

        if (!userId || userId.trim() === '') {
          throw new Error('Valid user ID required to update metadata')
        }

        try {
          const response = await fetch(
            import.meta.env.VITE_SALEOR_API_URL || 'http://localhost:8000/graphql/',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `JWT ${token}`,
              },
              body: JSON.stringify({
                query: `
                  mutation UpdateMetadata($id: ID!, $input: [MetadataInput!]!) {
                    updateMetadata(id: $id, input: $input) {
                      item {
                        ... on User {
                          id
                          metadata {
                            key
                            value
                          }
                        }
                      }
                      errors {
                        field
                        message
                      }
                    }
                  }
                `,
                variables: {
                  id: userId,
                  input: [{ key, value }],
                },
              }),
            }
          )

          const data = await response.json()

          if (data.errors) {
            throw new Error(data.errors[0].message)
          }

          if (data.data?.updateMetadata?.errors?.length > 0) {
            throw new Error(data.data.updateMetadata.errors[0].message)
          }

          console.log(`✅ Metadata updated: ${key} = ${value}`)
        } catch (error) {
          console.error('Metadata update error:', error)
          throw error
        }
      },

      // ✅ ADD ADDRESS
      addAddress: async (userId: string, address: AddressInput, type = 'SHIPPING') => {
        const token = get().token
        if (!token) throw new Error('Not authenticated')

        const response = await fetch(
          import.meta.env.VITE_SALEOR_API_URL || 'http://localhost:8000/graphql/',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `JWT ${token}`,
            },
            body: JSON.stringify({
              query: `
                mutation CreateAddress($id: ID!, $input: AddressInput!, $type: AddressTypeEnum) {
                  accountAddressCreate(userId: $id, input: $input, type: $type) {
                    address {
                      id
                      companyName
                      streetAddress1
                    }
                    errors {
                      field
                      message
                    }
                  }
                }
              `,
              variables: { id: userId, input: address, type },
            }),
          }
        )

        const data = await response.json()
        if (data.data?.accountAddressCreate?.errors?.length > 0) {
          throw new Error(data.data.accountAddressCreate.errors[0].message)
        }
      },

      // ✅ LOGOUT
      logout: () => {
        set({ user: null, token: null, refreshToken: null, isAuthenticated: false })
        // Channel will be reset by useUserChannel hook
      },

      // ✅ CONFIRM ACCOUNT
      confirmAccount: async (email: string, token: string) => {
        try {
          const response = await fetch(
            import.meta.env.VITE_SALEOR_API_URL || 'http://localhost:8000/graphql/',
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                query: `
                  mutation ConfirmAccount($email: String!, $token: String!) {
                    confirmAccount(email: $email, token: $token) {
                      user {
                        id
                        isActive
                      }
                      errors {
                        field
                        message
                        code
                      }
                    }
                  }
                `,
                variables: { email, token },
              }),
            }
          )

          const data = await response.json()
          if (data.errors) {
            throw new Error(data.errors[0].message)
          }

          const result = data.data?.confirmAccount
          if (result?.errors && result.errors.length > 0) {
            throw new Error(result.errors[0].message)
          }

          return true
        } catch (error) {
          console.error('Account confirmation error:', error)
          throw error
        }
      },

      setUser: (user: User, token: string, refreshToken?: string) => {
        set({ user, token, refreshToken: refreshToken || null, isAuthenticated: true })
      },

      // ✅ GET USER TYPE HELPER
      getUserType: () => {
        const user = get().user
        if (!user) return null

        const userType = user.metadata?.find((m) => m.key === 'user_type')?.value
        return userType === 'B2B' ? 'B2B' : 'B2C'
      },

      refreshAccessToken: async () => {
        // Keep your existing implementation
      },
    }),
    { name: 'auth-storage' }
  )
)
