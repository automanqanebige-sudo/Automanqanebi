import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { getFirebaseStorage } from '@/lib/firebase'

const MAX_BYTES = 5 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']

export function validateCarImageFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'invalidType'
  }
  if (file.size > MAX_BYTES) {
    return 'tooLarge'
  }
  return null
}

export async function uploadCarImage(file: File, userId: string): Promise<string> {
  const error = validateCarImageFile(file)
  if (error) throw new Error(error)

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const safeExt = ['jpg', 'jpeg', 'png', 'webp'].includes(ext) ? ext : 'jpg'
  const path = `cars/${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${safeExt}`

  const storageRef = ref(getFirebaseStorage(), path)
  await uploadBytes(storageRef, file, { contentType: file.type })
  return getDownloadURL(storageRef)
}
