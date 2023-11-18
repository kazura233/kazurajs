/**
 * Base64 转 Uint8Array
 * @param data - Base64 字符串
 * @returns - Uint8Array
 */
export const base64ToArrayBufferView = (data: string): Uint8Array => {
  data = atob(data)
  let len = data.length
  const u8arr = new Uint8Array(len)

  while (len--) {
    u8arr[len] = data.charCodeAt(len)
  }

  return u8arr
}

/**
 * DataURL 转 Uint8Array
 * @param data - DataURL 字符串
 * @returns - Uint8Array
 */
export const dataURLToArrayBufferView = (data: string): Uint8Array => {
  const [, base64] = data.split(',')
  return base64ToArrayBufferView(base64)
}

/**
 * Uint8Array 转 Blob
 * @param u8arr - Uint8Array
 * @param mime - Blob 类型
 * @returns - Blob
 */
export const arrayBufferViewToBlob = (u8arr: Uint8Array, mime: string): Blob => {
  return new Blob([u8arr], { type: mime })
}

/**
 * Base64 转 Blob
 * @param data - Base64 字符串
 * @param mime - Blob 类型
 * @returns - Blob
 */
export const base64ToBlob = (data: string, mime: string): Blob => {
  return arrayBufferViewToBlob(base64ToArrayBufferView(data), mime)
}

/**
 * DataURL 转 Blob
 * @param data - DataURL 字符串
 * @returns - Blob
 */
export const dataURLToBlob = (data: string): Blob => {
  const match = data.match(/^data:(.*?);base64,(.*)$/)

  if (!match) {
    throw new Error('Invalid DataURL format')
  }

  const [, mime, base64] = match
  return base64ToBlob(base64, mime)
}

/**
 * Uint8Array 转 File
 * @param u8arr - Uint8Array
 * @param fileName - 文件名
 * @param mime - 文件类型
 * @returns - File
 */
export const arrayBufferViewToFile = (u8arr: Uint8Array, fileName: string, mime: string): File => {
  return new File([u8arr], fileName, { type: mime })
}

/**
 * Blob 转 File
 * @param blob - Blob
 * @param fileName - 文件名
 * @returns - File
 */
export const blobToFile = (blob: Blob, fileName: string): File => {
  return new File([blob], fileName, { type: blob.type })
}

/**
 * File 转 Blob
 * @param file - File
 * @returns - Blob
 */
export const fileToBlob = (file: File): Blob => {
  return new Blob([file], { type: file.type })
}

/**
 * Blob 转 Base64
 * @param blob - Blob
 * @returns - Promise 包装的 Base64 字符串
 */
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise<string>((resolve) => {
    const reader = new FileReader()
    reader.onloadend = (event: ProgressEvent<FileReader>) => resolve(event.target!.result as string)
    reader.readAsDataURL(blob)
  })
}

/**
 * File 转 Base64
 * @param file - File
 * @returns - Promise 包装的 Base64 字符串
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return blobToBase64(fileToBlob(file))
}
