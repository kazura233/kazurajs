import { describe, it, expect } from 'vitest'
import { Base64 } from '../src/base64'

describe('Base64', () => {
  it('应能对 ASCII 字符串进行编码', () => {
    expect(Base64.stringify('Hello, world!')).toBe('SGVsbG8sIHdvcmxkIQ==')
  })

  it('应能解码回原始字符串', () => {
    expect(Base64.parse('SGVsbG8sIHdvcmxkIQ==')).toBe('Hello, world!')
  })

  it('应能处理 UTF-8 中文', () => {
    const plaintext = '你好，世界'
    expect(Base64.parse(Base64.stringify(plaintext))).toBe(plaintext)
  })

  it('解码时应能忽略空白字符', () => {
    expect(Base64.parse('SGVsbG8s\n IHdvcmxk IQ==')).toBe('Hello, world!')
  })
})
