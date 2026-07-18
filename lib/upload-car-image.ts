import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { getFirebaseStorage } from '@/lib/firebase'
import { compressAndWatermarkImage } from '@/lib/image-optimize'

const MAX_BYTES = 5 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']

export function validateCarImageFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type) && file.type !== 'image/webp') {
    // after compress always webp; allow original types for validation before compress
    if (!file.type.startsWith('image/')) return 'invalidType'
  }
  if (file.size > MAX_BYTES * 4) {
    // allow larger originals; we compress first
    return 'tooLarge'
  }
  return null
}

export async function uploadCarImage(file: File, userId: string): Promise<string> {
  const optimized = await compressAndWatermarkImage(file)
  if (optimized.size > MAX_BYTES) throw new Error('tooLarge')

  const path = `cars/${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.webp`
  const storageRef = ref(getFirebaseStorage(), path)
  await uploadBytes(storageRef, optimized, { contentType: 'image/webp' })
  return getDownloadURL(storageRef)
}

export async function uploadCarImages(files: File[], userId: string): Promise<string[]> {
  const urls: string[] = []
  for (const file of files) {
    urls.push(await uploadCarImage(file, userId))
  }
  return urls
}
