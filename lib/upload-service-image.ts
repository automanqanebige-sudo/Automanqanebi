import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { getFirebaseStorage } from '@/lib/firebase'
import { validateCarImageFile } from '@/lib/upload-car-image'
import { compressAndWatermarkImage } from '@/lib/image-optimize'

export { validateCarImageFile as validateServiceImageFile }

export async function uploadServiceImage(file: File, userId: string): Promise<string> {
  const error = validateCarImageFile(file)
  if (error) throw new Error(error)

  const optimized = await compressAndWatermarkImage(file)
  const path = `services/${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.webp`
  const storageRef = ref(getFirebaseStorage(), path)
  await uploadBytes(storageRef, optimized, { contentType: 'image/webp' })
  return getDownloadURL(storageRef)
}

export async function uploadServiceImages(files: File[], userId: string): Promise<string[]> {
  const urls: string[] = []
  for (const file of files) {
    urls.push(await uploadServiceImage(file, userId))
  }
  return urls
}
