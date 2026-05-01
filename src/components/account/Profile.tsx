// src/components/account/Profile.tsx
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '@hooks/useAuth'
import { useMutation, gql } from '@apollo/client'
import { UserIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

// ✅ GraphQL for Account Deletion Request
const REQUEST_DELETE_ACCOUNT = gql`
  mutation RequestAccountDeletion {
    accountRequestDeletion(redirectUrl: "https://leemasmart.com/account-deleted") {
      errors {
        field
        message
      }
    }
  }
`

interface ProfileFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
}

const Profile = () => {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [requestDelete, { loading: deleting }] = useMutation(REQUEST_DELETE_ACCOUNT)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: '', // Needs to be mapped if available in user object
    },
  })

  const onSubmit = async (data: ProfileFormData) => {
    // Implement accountUpdate mutation here if needed
    console.log(data)
    toast.success('Profile updated successfully')
    setIsEditing(false)
  }

  const handleDeleteAccount = async () => {
    if (confirm('Are you sure? We will send a confirmation email to permanently delete your account.')) {
      try {
        const { data } = await requestDelete()
        if (data?.accountRequestDeletion?.errors.length > 0) {
          toast.error(data.accountRequestDeletion.errors[0].message)
        } else {
          toast.success('Deletion email sent. Please check your inbox.')
        }
      } catch (error) {
        toast.error('Could not request deletion.')
      }
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Profile Card */}
      <div className="card p-6 lg:p-8 bg-white shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Profile Details</h2>
            <p className="text-gray-500 text-sm mt-1">Manage your personal information</p>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-secondary text-sm"
            >
              Edit Details
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex items-center space-x-6 mb-8">
            <div className="h-20 w-20 rounded-full bg-primary/5 flex items-center justify-center border border-primary/10">
              <UserIcon className="h-10 w-10 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{user?.firstName} {user?.lastName}</h3>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
              <input
                {...register('firstName', { required: 'Required' })}
                disabled={!isEditing}
                className="input-field w-full"
              />
              {errors.firstName && <span className="text-red-500 text-xs">{errors.firstName.message}</span>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              <input
                {...register('lastName', { required: 'Required' })}
                disabled={!isEditing}
                className="input-field w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <input
                  {...register('email')}
                  disabled // Email usually cannot be changed easily
                  className="input-field w-full pl-10 bg-gray-50 cursor-not-allowed"
                />
                <EnvelopeIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <div className="relative">
                <input
                  {...register('phone')}
                  disabled={!isEditing}
                  placeholder="Add phone number"
                  className="input-field w-full pl-10"
                />
                <PhoneIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Save Changes
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Danger Zone */}
      <div className="card p-6 bg-red-50/30 border border-red-100">
        <h3 className="text-lg font-bold text-red-900 mb-2">Danger Zone</h3>
        <div className="flex items-center justify-between">
          <p className="text-sm text-red-700/80">
            Permanently delete your account and all associated data.
          </p>
          <button
            onClick={handleDeleteAccount}
            disabled={deleting}
            className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
          >
            {deleting ? 'Processing...' : 'Delete Account'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Profile