// ===== ===== ===== ===== ===== DataURL To ===== ===== ===== ===== ===== //

/**
 * DataURL 转 Uint8Array
 * @param data - DataURL 字符串
 * @returns - Uint8Array
 */
export const dataURLToArrayBufferView = (data: string): Uint8Array => {
  return base64ToArrayBufferView(dataURLToBase64(data))
}

/**
 * DataURL 转 Blob
 * @param data - DataURL 字符串
 * @returns - Blob
 */
export const dataURLToBlob = (data: string): Blob => {
  const [head, base64] = data.split(',')

  const match = head.match(/^data:(.*?);base64$/)

  if (!match) {
    throw new Error('Invalid DataURL format')
  }

  const [, mime] = match
  return base64ToBlob(base64, mime)
}

/**
 * DataURL 转 File
 * @param data
 * @param fileName
 * @returns
 */
export const dataURLToFile = (data: string, fileName: string): File => {
  return blobToFile(dataURLToBlob(data), fileName)
}

/**
 * DataURL 转 Base64
 * @param data
 * @returns
 */
export const dataURLToBase64 = (data: string): string => {
  const [, base64] = data.split(',')
  return base64
}

// ===== ===== ===== ===== ===== Base64 To ===== ===== ===== ===== ===== //

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
 * Base64 转 Blob
 * @param data - Base64 字符串
 * @param mime - Blob 类型
 * @returns - Blob
 */
export const base64ToBlob = (data: string, mime: string): Blob => {
  return arrayBufferViewToBlob(base64ToArrayBufferView(data), mime)
}

/**
 * Base64 转 File
 * @param data
 * @param fileName
 * @param mime
 * @returns
 */
export const base64ToFile = (data: string, fileName: string, mime: string): File => {
  return arrayBufferViewToFile(base64ToArrayBufferView(data), fileName, mime)
}

/**
 * Base64 转 DataURL
 * @param data
 * @param mime
 * @returns
 */
export const base64ToDataURL = (data: string, mime: string): string => {
  return `data:${mime};base64,${data}`
}

// ===== ===== ===== ===== ===== ArrayBufferView To ===== ===== ===== ===== ===== //

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
 * Uint8Array 转 Base64
 * @param u8arr
 * @returns
 */
export const arrayBufferViewBase64 = (u8arr: Uint8Array): string => {
  const buffer = u8arr.buffer
  const base64String = btoa(String.fromCharCode(...new Uint8Array(buffer)))
  return base64String
}

// ===== ===== ===== ===== ===== File To ===== ===== ===== ===== ===== //

/**
 * File 转 Blob
 * @param file - File
 * @returns - Blob
 */
export const fileToBlob = (file: File): Blob => {
  return new Blob([file], { type: file.type })
}

/**
 * File 转 Base64
 * @param file - File
 * @returns - Promise 包装的 Base64 字符串
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return blobToBase64(fileToBlob(file))
}

/**
 * File 转 Uint8Array
 * @param file
 * @returns
 */
export const fileToArrayBufferView = (file: File): Promise<Uint8Array> => {
  return blobToArrayBufferView(fileToBlob(file))
}

// ===== ===== ===== ===== ===== Blob To ===== ===== ===== ===== ===== //

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
 * Blob 转 Uint8Array
 * @param blob
 * @returns
 */
export const blobToArrayBufferView = (blob: Blob): Promise<Uint8Array> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = function () {
      const { result } = reader

      if (result instanceof ArrayBuffer) {
        resolve(new Uint8Array(result))
      } else {
        reject(new Error('Failed to read Blob as ArrayBuffer.'))
      }
    }

    reader.onerror = function (event) {
      reject(new Error('Failed to read Blob: ' + event.target?.error))
    }

    reader.readAsArrayBuffer(blob)
  })
}
