import { describe, it, expect } from 'vitest'
import { Rsa1024 } from '../src/rsa-1024'

describe('Rsa1024', () => {
  describe('createCertificate', () => {
    it('应返回包含 privkey 与 pubkey 的证书', () => {
      const cert = Rsa1024.createCertificate()
      expect(cert.privkey).toMatch(/BEGIN RSA PRIVATE KEY/)
      expect(cert.pubkey).toMatch(/BEGIN PUBLIC KEY/)
    })
  })

  describe('encrypt / decrypt', () => {
    it('加密后解密应还原原文', () => {
      const cert = Rsa1024.createCertificate()
      const plaintext = 'Hello, world!'
      const ciphertext = Rsa1024.encrypt(plaintext, cert.pubkey)
      expect(typeof ciphertext).toBe('string')
      expect(Rsa1024.decrypt(ciphertext as string, cert.privkey)).toBe(plaintext)
    })

    it('应能加解密 UTF-8 中文', () => {
      const cert = Rsa1024.createCertificate()
      const plaintext = '你好，世界'
      const ciphertext = Rsa1024.encrypt(plaintext, cert.pubkey) as string
      expect(Rsa1024.decrypt(ciphertext, cert.privkey)).toBe(plaintext)
    })

    it('使用其他证书的私钥解密应失败', () => {
      const a = Rsa1024.createCertificate()
      const b = Rsa1024.createCertificate()
      const ciphertext = Rsa1024.encrypt('Hello, world!', a.pubkey) as string
      const decrypted = Rsa1024.decrypt(ciphertext, b.privkey)
      expect(decrypted === false || decrypted === null || decrypted !== 'Hello, world!').toBe(
        true
      )
    })
  })
})
