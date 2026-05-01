import { useState } from 'react'
import toast from 'react-hot-toast'

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false)

  const uploadImage = async (file: File): Promise<string> => {
    try {
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select an image file')
      }

      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        throw new Error('Image must be less than 5MB')
      }

      setUploading(true)

      const operations = {
        query: `
          mutation FileUpload($file: Upload!) {
            fileUpload(file: $file) {
              uploadedFile {
                url
                contentType
              }
              uploadErrors {
                field
                message
                code
              }
            }
          }
        `,
        variables: { file: null },
      }

      const map = { '0': ['variables.file'] }
      const formData = new FormData()
      formData.append('operations', JSON.stringify(operations))
      formData.append('map', JSON.stringify(map))
      formData.append('0', file)

      const token = localStorage.getItem('saleor_token')

      const response = await fetch(
        import.meta.env.VITE_SALEOR_API_URL || 'http://localhost:8000/graphql/',
        {
          method: 'POST',
          headers: {
            authorization: token ? `JWT ${token}` : '',
          },
          body: formData,
          credentials: 'include',
        }
      )

      const result = await response.json()

      if (result.errors) {
        throw new Error(result.errors[0].message || 'Upload failed')
      }

      if (result.data?.fileUpload?.uploadErrors?.length > 0) {
        throw new Error(result.data.fileUpload.uploadErrors[0].message)
      }

      const uploadedUrl = result.data?.fileUpload?.uploadedFile?.url

      if (!uploadedUrl) {
        throw new Error('Upload failed - no URL returned')
      }

      toast.success('Image uploaded successfully')
      return uploadedUrl

    } catch (error: any) {
      console.error('Upload error:', error)
      toast.error(error.message || 'Failed to upload image')
      throw error
    } finally {
      setUploading(false)
    }
  }

  return { uploadImage, uploading }
}
