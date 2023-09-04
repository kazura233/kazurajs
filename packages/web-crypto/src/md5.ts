import CryptoJS from 'crypto-js'

export const md5 = (message: string) => {
  return CryptoJS.MD5(CryptoJS.enc.Utf8.parse(message)).toString(CryptoJS.enc.Hex)
}
