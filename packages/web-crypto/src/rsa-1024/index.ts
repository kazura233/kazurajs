import { JSEncrypt } from 'jsencrypt'

export interface Certificate {
  privkey: string
  pubkey: string
}

export class Rsa1024 {
  public static encrypt(str: string, pubkey: string) {
    const rsa = new JSEncrypt({})
    rsa.setPublicKey(pubkey)
    return rsa.encrypt(str)
  }
  public static decrypt(str: string, privkey: string) {
    const rsa = new JSEncrypt({})
    rsa.setPrivateKey(privkey)
    return rsa.decrypt(str)
  }
  public static createCertificate(): Certificate {
    const rsa = new JSEncrypt({})
    const privkey: string = rsa.getPrivateKey()
    const pubkey: string = rsa.getPublicKey()
    return { privkey, pubkey }
  }
}
