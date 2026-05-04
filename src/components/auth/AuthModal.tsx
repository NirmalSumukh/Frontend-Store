import { useState } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'
import { useChannel, CHANNELS } from '@/hooks/useChannel'
import AuthModalLayout from '@/components/layout/templates/AuthModalLayout'
import { validateGSTNumber, validateGSTFormat } from '@/lib/gst-validation'

interface AuthModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [gstValidating, setGstValidating] = useState(false)

    const { login, register } = useAuth()
    const { setChannel } = useChannel()

    const [formData, setFormData] = useState({
        email: '',
        pass: '',
        name: '',
        gst: '',
    })

    const [regType, setRegType] = useState<'customer' | 'b2b'>('customer')

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    // --- LOGIN LOGIC ---
    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            await login(formData.email, formData.pass)

            // Channel switching handled by useUserChannel hook
            const currentUser = useAuth.getState().user
            const isB2BUser = currentUser?.metadata?.some(
                (m) => m.key === 'user_type' && m.value === 'B2B'
            )

            if (isB2BUser) {
                setChannel(CHANNELS.B2B)
                toast.success('Welcome back! (B2B Account)')
            } else {
                setChannel(CHANNELS.B2C)
                toast.success('Welcome back!')
            }

            onClose()
        } catch (error: any) {
            toast.error(error.message || 'Login failed')
        } finally {
            setIsLoading(false)
        }
    }

    // --- GOOGLE LOGIN ---
    const handleGoogleLogin = async () => {
        toast.error('Google Login configuration required')
    }

    // ✅ GST VALIDATION
    const handleGSTBlur = async () => {
        if (!formData.gst || regType !== 'b2b') return

        setGstValidating(true)
        try {
            // First check format
            const formatCheck = validateGSTFormat(formData.gst)
            if (!formatCheck.isValid) {
                toast.error(formatCheck.message)
                setGstValidating(false)
                return
            }

            // Then validate against API (when ready)
            const result = await validateGSTNumber(formData.gst)
            if (result.isValid) {
                toast.success('GST number verified!')
            } else {
                toast.error(result.message)
            }
        } catch (error) {
            toast.error('GST validation failed')
        } finally {
            setGstValidating(false)
        }
    }

    // --- REGISTER LOGIC ---
    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            // 1. Validation
            if (regType === 'b2b') {
                if (!formData.gst || formData.gst.length !== 15) {
                    toast.error('Please enter a valid 15-character GST number')
                    setIsLoading(false)
                    return
                }

                // Validate GST format
                const gstCheck = validateGSTFormat(formData.gst)
                if (!gstCheck.isValid) {
                    toast.error(gstCheck.message)
                    setIsLoading(false)
                    return
                }
            }

            if (!formData.name) {
                toast.error('Please enter your full name')
                setIsLoading(false)
                return
            }

            // 2. Parse name
            const nameParts = formData.name.trim().split(' ')
            const firstName = nameParts[0]
            const lastName = nameParts.slice(1).join(' ') || firstName

            // 3. Select channel
            const targetChannel = regType === 'b2b' ? CHANNELS.B2B : CHANNELS.B2C

            // 4. Register
            await register({
                email: formData.email,
                password: formData.pass,
                redirectUrl: window.location.origin + '/account-confirm',
                channel: targetChannel,
                firstName,
                lastName,
                gstNumber: regType === 'b2b' ? formData.gst : undefined,
            })

            // 5. Success
            toast.success(
                'Registration successful! Please check your email to activate your account.'
            )

            onClose()
        } catch (error: any) {
            toast.error(error.message || 'Registration failed')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <AuthModalLayout
            isOpen={isOpen}
            onClose={onClose}
            isLoading={isLoading}
            onLoginSubmit={handleLoginSubmit}
            onGoogleLogin={handleGoogleLogin}
            onRegisterSubmit={handleRegisterSubmit}
            regType={regType}
            setRegType={setRegType}
            formData={formData}
            handleInputChange={handleInputChange}
            gstValidating={gstValidating}
            onGSTBlur={handleGSTBlur}
        />
    )
}
