import { saveAs } from 'file-saver'

/**
 * 保存 Blob 或文件 URL 为文件。
 * @param data - 要保存的 Blob 或文件 URL。
 * @param filename - 可选参数，保存的文件名。
 */
export const saveFile = (data: Blob | string, filename?: string) => {
  saveAs(data, filename)
}
