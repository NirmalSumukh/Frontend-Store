import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import toast from 'react-hot-toast'
import { CheckCircleIcon, XCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline'

const AccountConfirmPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { confirmAccount } = useAuth()
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')

  const email = searchParams.get('email')
  const token = searchParams.get('token')

  useEffect(() => {
    if (!email || !token) {
      setStatus('error')
      setErrorMessage('Invalid confirmation link. Missing email or token.')
      return
    }

    const verifyAccount = async () => {
      try {
        await confirmAccount(email, token)
        setStatus('success')
        toast.success('Account successfully confirmed!')
        
        // Auto-redirect to home after 3 seconds
        setTimeout(() => {
          navigate('/')
        }, 3000)
      } catch (error: any) {
        setStatus('error')
        setErrorMessage(error.message || 'Failed to confirm account. The link may have expired.')
      }
    }

    verifyAccount()
  }, [email, token, confirmAccount, navigate])

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
        {status === 'loading' && (
          <div className="flex flex-col items-center justify-center space-y-4">
            <ArrowPathIcon className="h-16 w-16 text-primary animate-spin" />
            <h2 className="text-2xl font-bold text-gray-900">Verifying your account...</h2>
            <p className="text-gray-500">Please wait while we confirm your email address.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center justify-center space-y-4">
            <CheckCircleIcon className="h-16 w-16 text-green-500" />
            <h2 className="text-2xl font-bold text-gray-900">Account Confirmed!</h2>
            <p className="text-gray-500">Your email has been successfully verified.</p>
            <p className="text-sm text-gray-400">Redirecting to homepage...</p>
            <div className="pt-4">
              <Link 
                to="/"
                className="btn btn-primary w-full"
              >
                Go to Homepage
              </Link>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center justify-center space-y-4">
            <XCircleIcon className="h-16 w-16 text-red-500" />
            <h2 className="text-2xl font-bold text-gray-900">Verification Failed</h2>
            <p className="text-red-600 bg-red-50 p-3 rounded-lg text-sm w-full border border-red-100">
              {errorMessage}
            </p>
            <div className="pt-4 flex flex-col space-y-3 w-full">
              <Link 
                to="/"
                className="btn btn-outline w-full"
              >
                Back to Homepage
              </Link>
              <Link 
                to="/contact-us"
                className="text-sm text-primary hover:underline"
              >
                Contact Support
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AccountConfirmPage
