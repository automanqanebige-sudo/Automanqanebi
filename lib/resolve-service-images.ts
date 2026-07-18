import type { ImageSlot } from '@/components/CarImagesUpload'
import { uploadServiceImages } from '@/lib/upload-service-image'

/** Upload new files in slot order; keep existing remote URLs. */
export async function resolveServiceImageSlots(
  slots: ImageSlot[],
  userId: string
): Promise<string[]> {
  const filesToUpload = slots.filter((s) => s.file).map((s) => s.file as File)
  const uploaded = filesToUpload.length > 0 ? await uploadServiceImages(filesToUpload, userId) : []

  let uploadIndex = 0
  const urls: string[] = []
  for (const slot of slots) {
    if (slot.file) {
      urls.push(uploaded[uploadIndex++])
    } else {
      const url = slot.url.trim()
      if (url && !url.startsWith('blob:')) urls.push(url)
    }
  }
  return urls
}
