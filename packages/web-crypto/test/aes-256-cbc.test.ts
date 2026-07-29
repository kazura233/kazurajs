import { describe, it, expect } from 'vitest'
import { Aes256Cbc } from '../src/aes-256-cbc'

describe('Aes256Cbc', () => {
  describe('encrypt / decrypt (UTF-8 密钥)', () => {
    const key = '0123456789abcdef0123456789abcdef' // 32 字节
    const iv = '0123456789abcdef' // 16 字节

    it('加密后解密应还原原文', () => {
      const plaintext = 'Hello, world!'
      const ciphertext = Aes256Cbc.encrypt(plaintext, key, iv)
      expect(Aes256Cbc.decrypt(ciphertext, key, iv)).toBe(plaintext)
    })

    it('应能加解密 UTF-8 中文', () => {
      const plaintext = '你好，世界'
      expect(Aes256Cbc.decrypt(Aes256Cbc.encrypt(plaintext, key, iv), key, iv)).toBe(plaintext)
    })

    it('使用错误的 IV 解密应不能还原原文', () => {
      const plaintext = 'Hello, world!'
      const ciphertext = Aes256Cbc.encrypt(plaintext, key, iv)
      const wrongIv = 'abcdef0123456789'
      expect(Aes256Cbc.decrypt(ciphertext, key, wrongIv)).not.toBe(plaintext)
    })
  })

  describe('generateBase64Key', () => {
    it('应返回长度为 44 的 base64 字符串（32 字节）', () => {
      const key = Aes256Cbc.generateBase64Key()
      expect(key).toHaveLength(44)
      expect(key).toMatch(/^[A-Za-z0-9+/]+={0,2}$/)
    })

    it('每次调用应产生不同的密钥', () => {
      expect(Aes256Cbc.generateBase64Key()).not.toBe(Aes256Cbc.generateBase64Key())
    })
  })

  describe('generateBase64Iv', () => {
    it('应返回长度为 24 的 base64 字符串（16 字节）', () => {
      const iv = Aes256Cbc.generateBase64Iv()
      expect(iv).toHaveLength(24)
      expect(iv).toMatch(/^[A-Za-z0-9+/]+={0,2}$/)
    })

    it('每次调用应产生不同的 IV', () => {
      expect(Aes256Cbc.generateBase64Iv()).not.toBe(Aes256Cbc.generateBase64Iv())
    })
  })

  describe('encryptWithBase64Key / decryptWithBase64Key', () => {
    it('加密后解密应还原原文', () => {
      const key = Aes256Cbc.generateBase64Key()
      const iv = Aes256Cbc.generateBase64Iv()
      const plaintext = 'Hello, world!'
      const ciphertext = Aes256Cbc.encryptWithBase64Key(plaintext, key, iv)
      expect(Aes256Cbc.decryptWithBase64Key(ciphertext, key, iv)).toBe(plaintext)
    })

    it('相同明文配不同 IV 应产生不同密文（CBC 的语义安全特征）', () => {
      const key = Aes256Cbc.generateBase64Key()
      const plaintext = 'Hello, world!'
      const c1 = Aes256Cbc.encryptWithBase64Key(plaintext, key, Aes256Cbc.generateBase64Iv())
      const c2 = Aes256Cbc.encryptWithBase64Key(plaintext, key, Aes256Cbc.generateBase64Iv())
      expect(c1).not.toBe(c2)
    })

    it('解密时应能忽略密文中的空白字符', () => {
      const key = Aes256Cbc.generateBase64Key()
      const iv = Aes256Cbc.generateBase64Iv()
      const plaintext = 'Hello, world!'
      const ciphertext = Aes256Cbc.encryptWithBase64Key(plaintext, key, iv)
      const spaced = ciphertext.replace(/(.{4})/g, '$1 ')
      expect(Aes256Cbc.decryptWithBase64Key(spaced, key, iv)).toBe(plaintext)
    })
  })
})
