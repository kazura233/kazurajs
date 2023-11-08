import _aes from 'crypto-js/aes'
import _mode_ecb from 'crypto-js/mode-ecb'
import _enc_utf8 from 'crypto-js/enc-utf8'
import _pad_pkcs7 from 'crypto-js/pad-pkcs7'
import _format_openssl from 'crypto-js/format-openssl'

export class Aes128Ecb {
  public static encrypt(message: string, key: string) {
    return _aes
      .encrypt(_enc_utf8.parse(message), _enc_utf8.parse(key), {
        mode: _mode_ecb,
        padding: _pad_pkcs7,
      })
      .toString(_format_openssl)
  }
  public static decrypt(ciphertext: string, key: string) {
    return _aes
      .decrypt(ciphertext.replace(/\s/g, ''), _enc_utf8.parse(key), {
        mode: _mode_ecb,
        padding: _pad_pkcs7,
      })
      .toString(_enc_utf8)
  }
}
