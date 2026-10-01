/** Client-side image compress + watermark before Firebase Storage upload */

const MAX_WIDTH = 1600
const QUALITY = 0.82
const WATERMARK = 'automanqanebi.ge'

export async function compressAndWatermarkImage(file: File): Promise<File> {
  if (typeof window === 'undefined') return file
  if (!file.type.startsWith('image/')) return file

  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, MAX_WIDTH / bitmap.width)
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return file

  ctx.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  const fontSize = Math.max(12, Math.round(width * 0.028))
  ctx.font = `600 ${fontSize}px system-ui, sans-serif`
  ctx.textAlign = 'right'
  ctx.textBaseline = 'bottom'
  const pad = Math.round(fontSize * 0.8)
  const text = WATERMARK

  ctx.fillStyle = 'rgba(0,0,0,0.45)'
  const metrics = ctx.measureText(text)
  const boxW = metrics.width + pad * 1.2
  const boxH = fontSize + pad
  ctx.fillRect(width - boxW - pad * 0.3, height - boxH - pad * 0.3, boxW, boxH)
  ctx.fillStyle = 'rgba(255,255,255,0.92)'
  ctx.fillText(text, width - pad, height - pad)

  const blob: Blob | null = await new Promise((resolve) =>
    canvas.toBlob(resolve, 'image/webp', QUALITY)
  )
  if (!blob) return file

  const name = file.name.replace(/\.\w+$/, '') + '.webp'
  return new File([blob], name, { type: 'image/webp', lastModified: Date.now() })
}
