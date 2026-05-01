import { useState } from 'react'
import { useQuery, useMutation, gql } from '@apollo/client'
import { useForm } from 'react-hook-form'
import { PlusIcon, TrashIcon, MapPinIcon, XMarkIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

// --- GraphQL Queries & Mutations ---

const GET_ADDRESSES = gql`
  query GetAddresses {
    me {
      id
      addresses {
        id
        firstName
        lastName
        streetAddress1
        streetAddress2
        city
        postalCode
        country {
          code
          country
        }
        phone
      }
    }
  }
`

const CREATE_ADDRESS = gql`
  mutation CreateAddress($input: AddressInput!) {
    accountAddressCreate(input: $input, type: SHIPPING) {
      errors {
        field
        message
      }
      user {
        addresses {
          id
          firstName
          lastName
          streetAddress1
          city
          postalCode
          country {
            code
            country
          }
        }
      }
    }
  }
`

const DELETE_ADDRESS = gql`
  mutation DeleteAddress($id: ID!) {
    accountAddressDelete(id: $id) {
      errors {
        message
      }
      user {
        addresses {
          id
        }
      }
    }
  }
`

// --- Types ---

interface AddressFormData {
  firstName: string
  lastName: string
  streetAddress1: string
  streetAddress2?: string
  city: string
  postalCode: string
  phone: string
  country: string
}

const AddressBook = () => {
  const [isAdding, setIsAdding] = useState(false)

  // 1. Data Fetching
  const { data, loading } = useQuery(GET_ADDRESSES)

  // 2. Mutations
  const [deleteAddress] = useMutation(DELETE_ADDRESS, {
    refetchQueries: [{ query: GET_ADDRESSES }],
    onCompleted: () => toast.success('Address deleted')
  })

  const [createAddress, { loading: isCreating }] = useMutation(CREATE_ADDRESS, {
    refetchQueries: [{ query: GET_ADDRESSES }],
    onCompleted: (data) => {
      if (data.accountAddressCreate?.errors.length > 0) {
        toast.error(data.accountAddressCreate.errors[0].message)
      } else {
        toast.success('Address added successfully')
        setIsAdding(false)
        reset()
      }
    },
    onError: () => toast.error('Failed to add address')
  })

  // 3. Form Handling
  const { register, handleSubmit, reset, formState: { errors } } = useForm<AddressFormData>({
    defaultValues: { country: 'IN' } // Default to India
  })

  const onSubmit = async (formData: AddressFormData) => {
    await createAddress({
      variables: {
        input: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          streetAddress1: formData.streetAddress1,
          streetAddress2: formData.streetAddress2 || "",
          city: formData.city,
          postalCode: formData.postalCode,
          country: "IN", // Hardcoded to India for now, or map from formData.country
          phone: formData.phone
        }
      }
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return
    await deleteAddress({ variables: { id } })
  }

  const addresses = data?.me?.addresses || []

  // --- Render ---

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Address Book</h2>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="btn-primary flex items-center gap-2 text-sm"
          >
            <PlusIcon className="h-4 w-4" /> Add New
          </button>
        )}
      </div>

      {/* --- ADD NEW ADDRESS FORM --- */}
      {isAdding && (
        <div className="card p-6 border border-gray-200 bg-gray-50/50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">New Address</h3>
            <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-gray-600">
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">First Name</label>
                <input {...register('firstName', { required: 'Required' })} className="input-field w-full" />
                {errors.firstName && <span className="text-red-500 text-xs">Required</span>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Last Name</label>
                <input {...register('lastName', { required: 'Required' })} className="input-field w-full" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Address Line 1</label>
              <input {...register('streetAddress1', { required: 'Required' })} className="input-field w-full" />
              {errors.streetAddress1 && <span className="text-red-500 text-xs">Required</span>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Address Line 2 (Optional)</label>
              <input {...register('streetAddress2')} className="input-field w-full" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <input {...register('city', { required: 'Required' })} className="input-field w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Pincode</label>
                <input {...register('postalCode', { required: 'Required' })} className="input-field w-full" />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input {...register('phone', { required: 'Required' })} className="input-field w-full" placeholder="+91..." />
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button
                type="submit"
                disabled={isCreating}
                className="btn-primary px-6"
              >
                {isCreating ? 'Saving...' : 'Save Address'}
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* --- ADDRESS LIST --- */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map(i => <div key={i} className="h-40 bg-gray-100 rounded-lg animate-pulse" />)}
        </div>
      ) : addresses.length === 0 && !isAdding ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
          <MapPinIcon className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No addresses saved yet.</p>
        </div>
      ) : (
        !isAdding && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((addr: any) => (
              <div key={addr.id} className="card p-5 border border-gray-200 hover:border-primary/50 transition-colors relative group bg-white">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{addr.firstName} {addr.lastName}</p>
                    <div className="text-sm text-gray-600 mt-2 space-y-1">
                      <p>{addr.streetAddress1}</p>
                      {addr.streetAddress2 && <p>{addr.streetAddress2}</p>}
                      <p>{addr.city}, {addr.postalCode}</p>
                      <p>{addr.country.country}</p>
                      <p className="mt-2 text-gray-500 text-xs">Phone: {addr.phone}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    title="Delete Address"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  )
}

export default AddressBook