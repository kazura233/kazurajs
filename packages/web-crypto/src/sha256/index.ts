import _sha256 from 'crypto-js/sha256'
import _enc_utf8 from 'crypto-js/enc-utf8'
import _enc_hex from 'crypto-js/enc-hex'

export const sha256 = (message: string) => {
  return _sha256(_enc_utf8.parse(message)).toString(_enc_hex)
}
