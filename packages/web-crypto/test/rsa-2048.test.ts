import { describe, it, expect } from 'vitest'
import { Rsa2048 } from '../src/rsa-2048'

describe('Rsa2048', { timeout: 30000 }, () => {
  describe('createCertificate', () => {
    it('应返回包含 privkey 与 pubkey 的证书', () => {
      const cert = Rsa2048.createCertificate()
      expect(cert.privkey).toMatch(/BEGIN RSA PRIVATE KEY/)
      expect(cert.pubkey).toMatch(/BEGIN PUBLIC KEY/)
    })
  })

  describe('encrypt / decrypt', () => {
    it('加密后解密应还原原文', () => {
      const cert = Rsa2048.createCertificate()
      const plaintext = 'Hello, world!'
      const ciphertext = Rsa2048.encrypt(plaintext, cert.pubkey)
      expect(typeof ciphertext).toBe('string')
      expect(Rsa2048.decrypt(ciphertext as string, cert.privkey)).toBe(plaintext)
    })

    it('应能加解密 UTF-8 中文', () => {
      const cert = Rsa2048.createCertificate()
      const plaintext = '你好，世界'
      const ciphertext = Rsa2048.encrypt(plaintext, cert.pubkey) as string
      expect(Rsa2048.decrypt(ciphertext, cert.privkey)).toBe(plaintext)
    })

    it('使用其他证书的私钥解密应失败', () => {
      const a = Rsa2048.createCertificate()
      const b = Rsa2048.createCertificate()
      const ciphertext = Rsa2048.encrypt('Hello, world!', a.pubkey) as string
      const decrypted = Rsa2048.decrypt(ciphertext, b.privkey)
      expect(decrypted === false || decrypted === null || decrypted !== 'Hello, world!').toBe(
        true
      )
    })
  })
})
