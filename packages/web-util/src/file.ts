/**
 * Base64转Uint8Array
 * @param data
 * @returns
 */
export const base64ToArrayBufferView = (data: string) => {
  data = atob(data) // 解base64
  let len = data.length
  const u8arr = new Uint8Array(len) // 8位无符号整型数组
  while (len--) {
    u8arr[len] = data.charCodeAt(len) // 返回0x00000~0xFFFF之间的Unicode码
  }
  return u8arr
}

/**
 * DataURL转Uint8Array
 * @param data
 * @returns
 */
export const dataURLToArrayBufferView = (data: string) => {
  const [, base64] = data.split(',')
  return base64ToArrayBufferView(base64)
}

/**
 * Uint8Array转Blob
 * @param u8arr
 * @param mime
 * @returns
 */
export const arrayBufferViewToBlob = (u8arr: Uint8Array, mime: string) => {
  return new Blob([u8arr], { type: mime })
}

/**
 * Base64转Blob
 * @param data
 * @param mime
 * @returns
 */
export const base64ToBlob = (data: string, mime: string) => {
  return arrayBufferViewToBlob(base64ToArrayBufferView(data), mime)
}

/**
 * DataURL转Blob
 * @param data
 * @returns
 */
export const dataURLToBlob = (data: string) => {
  const match = data.match(/^data:(.*?);base64,(.*)$/)

  if (!match) {
    // 处理错误情况，可以返回默认 MIME 类型或抛出异常
    throw new Error('Invalid DataURL format')
  }

  const [, mime, base64] = match
  return base64ToBlob(base64, mime)
}

/**
 * Uint8Array转File
 * @param u8arr
 * @param fileName
 * @param mime
 * @returns
 */
export const arrayBufferViewToFile = (u8arr: Uint8Array, fileName: string, mime: string) => {
  return new File([u8arr], fileName, { type: mime })
}

/**
 * Blob转File
 * @param blob
 * @param fileName
 * @returns
 */
export const blobToFile = (blob: Blob, fileName: string) => {
  return new File([blob], fileName, { type: blob.type })
}

/**
 * File转Blob
 * @param file
 * @returns
 */
export const fileToBlob = (file: File) => {
  return new Blob([file], {
    type: file.type,
  })
}

/**
 * Blob转Base64
 * @param blob
 * @returns
 */
export const blobToBase64 = (blob: Blob) => {
  return new Promise<string>((resolve) => {
    const reader = new FileReader()
    reader.onloadend = (event: ProgressEvent<FileReader>) => resolve(event.target!.result as string)
    reader.readAsDataURL(blob)
  })
}

/**
 * File转Base64
 * @param file
 * @returns
 */
export const fileToBase64 = (file: File) => {
  return blobToBase64(fileToBlob(file))
}
