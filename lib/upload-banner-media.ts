import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { getFirebaseStorage } from '@/lib/firebase'

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime']

export function validateBannerImageFile(file: File): string | null {
  if (!IMAGE_TYPES.includes(file.type)) return 'Invalid image type'
  if (file.size > 10 * 1024 * 1024) return 'Image max 10MB'
  return null
}

export function validateBannerVideoFile(file: File): string | null {
  if (!VIDEO_TYPES.includes(file.type)) return 'Invalid video type'
  if (file.size > 25 * 1024 * 1024) return 'Video max 25MB'
  return null
}

async function uploadFile(file: File, userId: string, folder: 'images' | 'videos'): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'bin'
  const path = `banners/${userId}/${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const storageRef = ref(getFirebaseStorage(), path)
  await uploadBytes(storageRef, file, { contentType: file.type })
  return getDownloadURL(storageRef)
}

export async function uploadBannerImage(file: File, userId: string): Promise<string> {
  const error = validateBannerImageFile(file)
  if (error) throw new Error(error)
  try {
    const { compressAndWatermarkImage } = await import('@/lib/image-optimize')
    const optimized = await compressAndWatermarkImage(file)
    const path = `banners/${userId}/images/${Date.now()}-${Math.random().toString(36).slice(2)}.webp`
    const storageRef = ref(getFirebaseStorage(), path)
    await uploadBytes(storageRef, optimized, { contentType: 'image/webp' })
    return getDownloadURL(storageRef)
  } catch {
    return uploadFile(file, userId, 'images')
  }
}

export async function uploadBannerVideo(file: File, userId: string): Promise<string> {
  const error = validateBannerVideoFile(file)
  if (error) throw new Error(error)
  return uploadFile(file, userId, 'videos')
}
