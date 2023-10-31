import _enc_base64 from 'crypto-js/enc-base64'
import _enc_utf8 from 'crypto-js/enc-utf8'

export class Base64 {
  public static stringify(str: string): string {
    return _enc_base64.stringify(_enc_utf8.parse(str))
  }
  public static parse(str: string): string {
    return _enc_base64.parse(str.replace(/\s/g, '')).toString(_enc_utf8)
  }
}
