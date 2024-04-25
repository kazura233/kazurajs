import { JSEncrypt } from 'jsencrypt/lib/JSEncrypt'

export interface Certificate {
  privkey: string
  pubkey: string
}

export class Rsa2048 {
  public static encrypt(str: string, pubkey: string) {
    const rsa = new JSEncrypt({ default_key_size: '2048' })
    rsa.setPublicKey(pubkey)
    return rsa.encrypt(str)
  }
  public static decrypt(str: string, privkey: string) {
    const rsa = new JSEncrypt({ default_key_size: '2048' })
    rsa.setPrivateKey(privkey)
    return rsa.decrypt(str)
  }
  public static createCertificate(): Certificate {
    const rsa = new JSEncrypt({ default_key_size: '2048' })
    const privkey: string = rsa.getPrivateKey()
    const pubkey: string = rsa.getPublicKey()
    return { privkey, pubkey }
  }
}
