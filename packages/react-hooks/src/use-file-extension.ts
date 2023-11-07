import { getFileExtension } from '@kazura/web-util'
import { useMemo } from 'react'

/**
 * 获取文件取扩展名
 * @param file
 * @returns
 */
export const useFileExtension = (file: File | string) => {
  const fileType = useMemo(() => getFileExtension(file), [file])
  return fileType
}
