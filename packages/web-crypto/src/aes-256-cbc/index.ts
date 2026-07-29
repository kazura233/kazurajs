import _core from 'crypto-js/core'
import _aes from 'crypto-js/aes'
import _enc_utf8 from 'crypto-js/enc-utf8'
import _pad_pkcs7 from 'crypto-js/pad-pkcs7'
import _format_openssl from 'crypto-js/format-openssl'
import _enc_base64 from 'crypto-js/enc-base64'

export class Aes256Cbc {
  /**
   * 加密
   * @param message
   * @param key 32 字节密钥
   * @param iv 16 字节初始化向量
   * @returns
   */
  public static encrypt(message: string, key: string, iv: string) {
    return _aes
      .encrypt(_enc_utf8.parse(message), _enc_utf8.parse(key), {
        iv: _enc_utf8.parse(iv),
        padding: _pad_pkcs7,
      })
      .toString(_format_openssl)
  }

  /**
   * 解密
   * @param ciphertext
   * @param key 32 字节密钥
   * @param iv 16 字节初始化向量
   * @returns
   */
  public static decrypt(ciphertext: string, key: string, iv: string) {
    return _aes
      .decrypt(ciphertext.replace(/\s/g, ''), _enc_utf8.parse(key), {
        iv: _enc_utf8.parse(iv),
        padding: _pad_pkcs7,
      })
      .toString(_enc_utf8)
  }

  /**
   * 生成 base64 编码的 密钥
   * @returns
   */
  public static generateBase64Key() {
    const randomBytes = _core.lib.WordArray.random(32)
    return _enc_base64.stringify(randomBytes)
  }

  /**
   * 生成 base64 编码的 IV
   * @returns
   */
  public static generateBase64Iv() {
    const randomBytes = _core.lib.WordArray.random(16)
    return _enc_base64.stringify(randomBytes)
  }

  /**
   * 加密
   * @param plaintext
   * @param key base64 编码的 密钥
   * @param iv base64 编码的 IV
   * @returns
   */
  public static encryptWithBase64Key(plaintext: string, key: string, iv: string): string {
    return _aes
      .encrypt(plaintext, _enc_base64.parse(key), {
        iv: _enc_base64.parse(iv),
        padding: _pad_pkcs7,
      })
      .toString()
  }

  /**
   * 解密
   * @param ciphertext
   * @param key base64 编码的 密钥
   * @param iv base64 编码的 IV
   * @returns
   */
  public static decryptWithBase64Key(ciphertext: string, key: string, iv: string): string {
    return _aes
      .decrypt(ciphertext.replace(/\s/g, ''), _enc_base64.parse(key), {
        iv: _enc_base64.parse(iv),
        padding: _pad_pkcs7,
      })
      .toString(_enc_utf8)
  }
}
