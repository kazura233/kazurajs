const createCanvas = (image: HTMLImageElement): HTMLCanvasElement => {
  const canvas: HTMLCanvasElement = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  canvas.width = image.width
  canvas.height = image.height
  ctx.drawImage(image, 0, 0)
  return canvas
}

/**
 * HTMLImageElement 转 Blob
 * @param image 要压缩的图片
 * @param mimeType mime类型
 * @param quality 质量 0~1之间的小数 默认1 小数点后两位有效
 * @returns
 */
export const imageElementToBlob = (
  image: HTMLImageElement,
  mimeType: string,
  quality: number = 1
): Promise<Blob | null> => {
  return new Promise((resolve) => createCanvas(image).toBlob(resolve, mimeType, quality))
}

/**
 * HTMLImageElement 转 DataURL
 * @param image 要压缩的图片
 * @param mimeType mime类型
 * @param quality 质量 0~1之间的小数 默认1 小数点后两位有效
 * @returns
 */
export const imageElementToDataURL = (
  image: HTMLImageElement,
  mimeType: string,
  quality: number = 1
): string => {
  return createCanvas(image).toDataURL(mimeType, quality)
}
