import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { getFirebaseStorage } from '@/lib/firebase'
import { validateCarImageFile } from '@/lib/upload-car-image'

export { validateCarImageFile as validateProfilePhotoFile }

export async function uploadProfilePhoto(file: File, userId: string): Promise<string> {
  const error = validateCarImageFile(file)
  if (error) throw new Error(error)

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const safeExt = ['jpg', 'jpeg', 'png', 'webp'].includes(ext) ? ext : 'jpg'
  const path = `profiles/${userId}/avatar-${Date.now()}.${safeExt}`

  const storageRef = ref(getFirebaseStorage(), path)
  await uploadBytes(storageRef, file, { contentType: file.type })
  return getDownloadURL(storageRef)
}
