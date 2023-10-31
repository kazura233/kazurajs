import _md5 from 'crypto-js/md5'
import _enc_utf8 from 'crypto-js/enc-utf8'
import _enc_hex from 'crypto-js/enc-hex'

export const md5 = (message: string) => {
  return _md5(_enc_utf8.parse(message)).toString(_enc_hex)
}
