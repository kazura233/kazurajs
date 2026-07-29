import { describe, it, expect } from 'vitest'
import { Aes128Ecb } from '../src/aes-128-ecb'

describe('Aes128Ecb', () => {
  describe('encrypt / decrypt (UTF-8 密钥)', () => {
    const key = '0123456789abcdef' // 16 字节

    it('加密后解密应还原原文', () => {
      const plaintext = 'Hello, world!'
      const ciphertext = Aes128Ecb.encrypt(plaintext, key)
      expect(Aes128Ecb.decrypt(ciphertext, key)).toBe(plaintext)
    })

    it('相同明文与密钥应产生相同密文（ECB 的确定性特征）', () => {
      const plaintext = 'deterministic'
      expect(Aes128Ecb.encrypt(plaintext, key)).toBe(Aes128Ecb.encrypt(plaintext, key))
    })

    it('应能加解密 UTF-8 中文', () => {
      const plaintext = '你好，世界'
      expect(Aes128Ecb.decrypt(Aes128Ecb.encrypt(plaintext, key), key)).toBe(plaintext)
    })
  })

  describe('generateBase64Key', () => {
    it('应返回长度为 24 的 base64 字符串（16 字节）', () => {
      const key = Aes128Ecb.generateBase64Key()
      expect(key).toHaveLength(24)
      expect(key).toMatch(/^[A-Za-z0-9+/]+={0,2}$/)
    })

    it('每次调用应产生不同的密钥', () => {
      expect(Aes128Ecb.generateBase64Key()).not.toBe(Aes128Ecb.generateBase64Key())
    })
  })

  describe('encryptWithBase64Key / decryptWithBase64Key', () => {
    it('加密后解密应还原原文', () => {
      const key = Aes128Ecb.generateBase64Key()
      const plaintext = 'Hello, world!'
      const ciphertext = Aes128Ecb.encryptWithBase64Key(plaintext, key)
      expect(Aes128Ecb.decryptWithBase64Key(ciphertext, key)).toBe(plaintext)
    })

    it('解密时应能忽略密文中的空白字符', () => {
      const key = Aes128Ecb.generateBase64Key()
      const plaintext = 'Hello, world!'
      const ciphertext = Aes128Ecb.encryptWithBase64Key(plaintext, key)
      const spaced = ciphertext.replace(/(.{4})/g, '$1 ')
      expect(Aes128Ecb.decryptWithBase64Key(spaced, key)).toBe(plaintext)
    })
  })
})
