// src/utils/cloudinary.ts
export interface CloudinaryUploadResult {
  imageUrl: string
  publicId: string
}

export const uploadToCloudinary = async (file: File): Promise<CloudinaryUploadResult> => {
  const cloudName = 'dfibid2nb'
  const uploadPreset = 'swp392'

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    const msg = errorData?.error?.message || 'Tải ảnh lên Cloudinary thất bại'
    throw new Error(msg)
  }

  const data = await response.json()
  return {
    imageUrl: data.secure_url,
    publicId: data.public_id,
  }
}
