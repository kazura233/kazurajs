import { saveAs } from 'file-saver'

export const saveFile = (data: Blob | string, filename?: string) => {
  saveAs(data, filename)
}
