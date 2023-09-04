import CryptoJS from 'crypto-js'

export class Aes128Ecb {
  public static encrypt(message: string, key: string) {
    return CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(message), CryptoJS.enc.Utf8.parse(key), {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    }).toString(CryptoJS.format.OpenSSL)
  }
  public static decrypt(ciphertext: string, key: string) {
    return CryptoJS.AES.decrypt(ciphertext.replace(/\s/g, ''), CryptoJS.enc.Utf8.parse(key), {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    }).toString(CryptoJS.enc.Utf8)
  }
}
