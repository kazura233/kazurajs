/**
 * 创建并返回一个包含图像内容的 HTMLCanvasElement。
 * @param image - 要从中获取图像内容的 HTMLImageElement。
 * @returns 包含图像内容的 HTMLCanvasElement。
 */
const createCanvas = (image: HTMLImageElement): HTMLCanvasElement => {
  // 创建新的 canvas 元素。
  const canvas: HTMLCanvasElement = document.createElement('canvas')

  // 获取 2D 渲染上下文。
  const ctx = canvas.getContext('2d')!

  // 设置 canvas 的宽度和高度与图像相同。
  canvas.width = image.width
  canvas.height = image.height

  // 将图像绘制到 canvas 上。
  ctx.drawImage(image, 0, 0)

  // 返回包含图像内容的 canvas 元素。
  return canvas
}

/**
 * HTMLImageElement 转 Blob
 * @param image - 要压缩的图片
 * @param mimeType - mime 类型
 * @param quality - 质量 0~1 之间的小数，默认为 1（小数点后两位有效）
 * @returns - 返回一个 Promise，包含 Blob 或 null
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
 * @param image - 要压缩的图片
 * @param mimeType - mime 类型
 * @param quality - 质量 0~1 之间的小数，默认为 1（小数点后两位有效）
 * @returns - 返回 DataURL 字符串
 */
export const imageElementToDataURL = (
  image: HTMLImageElement,
  mimeType: string,
  quality: number = 1
): string => {
  return createCanvas(image).toDataURL(mimeType, quality)
}
