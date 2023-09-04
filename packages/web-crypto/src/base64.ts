import CryptoJS from 'crypto-js'

export class Base64 {
  public static stringify(str: string): string {
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(str))
  }
  public static parse(str: string): string {
    return CryptoJS.enc.Base64.parse(str.replace(/\s/g, '')).toString(CryptoJS.enc.Utf8)
  }
}
