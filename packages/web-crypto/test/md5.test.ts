import { describe, it, expect } from 'vitest'
import { md5 } from '../src/md5'

describe('md5', () => {
  it('空字符串应返回已知哈希值', () => {
    expect(md5('')).toBe('d41d8cd98f00b204e9800998ecf8427e')
  })

  it('"Hello, world!" 应返回已知哈希值', () => {
    expect(md5('Hello, world!')).toBe('6cd3556deb0da54bca060b4c39479839')
  })

  it('应能处理 UTF-8 中文', () => {
    expect(md5('你好')).toBe('7eca689f0d3389d9dea66ae112e5cfd7')
  })

  it('相同输入应产生相同哈希', () => {
    expect(md5('same input')).toBe(md5('same input'))
  })
})
