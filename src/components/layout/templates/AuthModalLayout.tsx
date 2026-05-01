import { Fragment } from 'react'
import { Dialog, Transition, Tab } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'

// Define purely visual props
interface AuthModalLayoutProps {
    isOpen: boolean
    onClose: () => void
    isLoading: boolean

    // Login Props
    onLoginSubmit: (e: React.FormEvent) => void
    onGoogleLogin: () => void

    // Register Props
    onRegisterSubmit: (e: React.FormEvent) => void
    regType: 'customer' | 'b2b'
    setRegType: (type: 'customer' | 'b2b') => void

    // Form Data Binding
    formData: {
        email: string
        pass: string
        name: string
        gst: string
    }
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void

    // GST Validation Props
    gstValidating?: boolean
    onGSTBlur?: () => void
}

export default function AuthModalLayout({
    isOpen,
    onClose,
    isLoading,
    onLoginSubmit,
    onGoogleLogin,
    onRegisterSubmit,
    regType,
    setRegType,
    formData,
    handleInputChange,
    gstValidating = false,
    onGSTBlur,
}: AuthModalLayoutProps) {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-[100]" onClose={onClose}>
                {/* Backdrop */}
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95 translate-y-4"
                            enterTo="opacity-100 scale-100 translate-y-0"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100 translate-y-0"
                            leaveTo="opacity-0 scale-95 translate-y-4"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-3xl bg-white p-8 text-left align-middle shadow-2xl transition-all border border-gray-100">
                                {/* Close Button */}
                                <button
                                    onClick={onClose}
                                    className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all focus:outline-none focus:ring-2 focus:ring-[#f97316]/50"
                                    aria-label="Close modal"
                                >
                                    <XMarkIcon className="h-5 w-5" />
                                </button>

                                {/* Header with Leema Branding */}
                                <div className="text-center mb-8 mt-2">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-2xl font-extrabold text-gray-900 flex justify-center items-center tracking-tight"
                                    >
                                        Welcome to{' '}
                                        <span className="ml-2 text-transparent bg-clip-text bg-gradient-to-br from-[#f97316] to-[#ffb07c]">
                                            Leema
                                        </span>
                                    </Dialog.Title>
                                    <p className="text-sm text-gray-500 font-medium mt-1.5">
                                        Sign in or create an account to continue
                                    </p>
                                </div>

                                {/* Tabs */}
                                <Tab.Group>
                                    <Tab.List className="flex space-x-1.5 rounded-xl bg-gray-100/80 p-1.5 mb-8">
                                        {['Login', 'Register'].map((category) => (
                                            <Tab
                                                key={category}
                                                className={({ selected }) =>
                                                    `w-full rounded-lg py-2.5 text-sm font-bold transition-all duration-200 ease-out
                                                    focus:outline-none focus:ring-2 ring-offset-2 ring-[#f97316]
                                                    ${selected
                                                        ? 'bg-white text-[#f97316] shadow-sm'
                                                        : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                                                    }`
                                                }
                                            >
                                                {category}
                                            </Tab>
                                        ))}
                                    </Tab.List>

                                    <Tab.Panels>
                                        {/* === LOGIN PANEL === */}
                                        <Tab.Panel>
                                            <form onSubmit={onLoginSubmit} className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">
                                                        Email Address
                                                    </label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleInputChange}
                                                        className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] bg-gray-50/50 hover:bg-white transition-colors"
                                                        placeholder="you@example.com"
                                                        required
                                                        disabled={isLoading}
                                                    />
                                                </div>

                                                <div>
                                                    <div className="flex items-center justify-between mb-1.5">
                                                        <label className="block text-sm font-bold text-gray-700">
                                                            Password
                                                        </label>
                                                        <button
                                                            type="button"
                                                            className="text-xs text-[#f97316] hover:text-[#ea580c] font-bold transition-colors"
                                                        >
                                                            Forgot password?
                                                        </button>
                                                    </div>
                                                    <input
                                                        type="password"
                                                        name="pass"
                                                        value={formData.pass}
                                                        onChange={handleInputChange}
                                                        className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] bg-gray-50/50 hover:bg-white transition-colors"
                                                        placeholder="••••••••"
                                                        required
                                                        disabled={isLoading}
                                                    />
                                                </div>

                                                <Button
                                                    type="submit"
                                                    className="w-full bg-[#f97316] hover:bg-[#ea580c] text-white font-bold py-6 rounded-xl shadow-[0_4px_14px_0_rgba(249,115,22,0.39)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.23)] hover:-translate-y-0.5 transition-all mt-2"
                                                    disabled={isLoading}
                                                >
                                                    {isLoading ? 'Authenticating...' : 'Sign In'}
                                                </Button>

                                                <div className="relative my-8">
                                                    <div className="absolute inset-0 flex items-center">
                                                        <div className="w-full border-t border-gray-200" />
                                                    </div>
                                                    <div className="relative flex justify-center text-xs font-bold uppercase tracking-wider">
                                                        <span className="px-4 bg-white text-gray-400">
                                                            Or continue with
                                                        </span>
                                                    </div>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={onGoogleLogin}
                                                    className="w-full flex items-center justify-center gap-3 px-4 py-3.5 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all font-bold text-gray-700 shadow-sm"
                                                    disabled={isLoading}
                                                >
                                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                                    </svg>
                                                    Google
                                                </button>
                                            </form>
                                        </Tab.Panel>

                                        {/* === REGISTER PANEL === */}
                                        <Tab.Panel>
                                            <form onSubmit={onRegisterSubmit} className="space-y-4">
                                                {/* Account Type Selection */}
                                                <div className="mb-2">
                                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                                        Account Type
                                                    </label>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <button
                                                            type="button"
                                                            onClick={() => setRegType('customer')}
                                                            className={`p-3 rounded-xl text-sm font-bold transition-all border-2 ${regType === 'customer'
                                                                ? 'border-[#f97316] bg-orange-50 text-[#f97316]'
                                                                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                                                                }`}
                                                        >
                                                            👤 Customer
                                                        </button>

                                                        {/* Disabled Business Option with Badge */}
                                                        <div className="relative group">
                                                            <button
                                                                type="button"
                                                                disabled
                                                                className="w-full h-full p-3 rounded-xl text-sm font-bold transition-all border-2 border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed flex items-center justify-center opacity-70"
                                                            >
                                                                🏢 Business
                                                            </button>
                                                            <div className="absolute -top-2.5 -right-2">
                                                                <span className="bg-gray-800 text-white text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full shadow-md">
                                                                    Coming Soon
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Full Name */}
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">
                                                        Full Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleInputChange}
                                                        className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] bg-gray-50/50 hover:bg-white transition-colors"
                                                        placeholder="John Doe"
                                                        required
                                                        disabled={isLoading}
                                                    />
                                                </div>

                                                {/* GST Field - Only visible for B2B (currently hidden by disabled regType) */}
                                                {regType === 'b2b' && (
                                                    <div>
                                                        <label className="block text-sm font-bold text-gray-700 mb-1.5">
                                                            GST Number (Required) *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="gst"
                                                            value={formData.gst}
                                                            onChange={handleInputChange}
                                                            onBlur={onGSTBlur}
                                                            maxLength={15}
                                                            placeholder="22AAAAA0000A1Z5"
                                                            className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] bg-gray-50/50 transition-colors uppercase"
                                                            required
                                                            disabled={isLoading || gstValidating}
                                                        />
                                                        {gstValidating && (
                                                            <div className="flex items-center gap-2 mt-2">
                                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#f97316]" />
                                                                <p className="text-sm text-[#f97316] font-medium">
                                                                    Validating GST number...
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Email */}
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">
                                                        Email Address
                                                    </label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleInputChange}
                                                        className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] bg-gray-50/50 hover:bg-white transition-colors"
                                                        placeholder="you@example.com"
                                                        required
                                                        disabled={isLoading}
                                                    />
                                                </div>

                                                {/* Password */}
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">
                                                        Create Password
                                                    </label>
                                                    <input
                                                        type="password"
                                                        name="pass"
                                                        value={formData.pass}
                                                        onChange={handleInputChange}
                                                        className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] bg-gray-50/50 hover:bg-white transition-colors"
                                                        placeholder="••••••••"
                                                        required
                                                        minLength={8}
                                                        disabled={isLoading}
                                                    />
                                                </div>

                                                {/* Submit Button */}
                                                <Button
                                                    type="submit"
                                                    className="w-full bg-[#f97316] hover:bg-[#ea580c] text-white font-bold py-6 rounded-xl shadow-[0_4px_14px_0_rgba(249,115,22,0.39)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.23)] hover:-translate-y-0.5 transition-all mt-4"
                                                    disabled={isLoading || gstValidating}
                                                >
                                                    {isLoading
                                                        ? 'Creating Account...'
                                                        : 'Create Account'}
                                                </Button>
                                            </form>
                                        </Tab.Panel>
                                    </Tab.Panels>
                                </Tab.Group>

                                {/* Footer */}
                                <p className="text-xs text-center text-gray-400 font-medium mt-8">
                                    By continuing, you agree to our{' '}
                                    <a href="/terms-conditions" className="text-gray-500 hover:text-[#f97316] transition-colors underline underline-offset-2">Terms of Service</a>{' '}
                                    and{' '}
                                    <a href="/privacy-policy" className="text-gray-500 hover:text-[#f97316] transition-colors underline underline-offset-2">Privacy Policy</a>.
                                </p>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}