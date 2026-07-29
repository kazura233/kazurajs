import { describe, it, expect } from 'vitest'
import { sha256 } from '../src/sha256'

describe('sha256', () => {
  it('空字符串应返回已知哈希值', () => {
    expect(sha256('')).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855')
  })

  it('"Hello, world!" 应返回已知哈希值', () => {
    expect(sha256('Hello, world!')).toBe(
      '315f5bdb76d078c43b8ac0064e4a0164612b1fce77c869345bfc94c75894edd3'
    )
  })

  it('应能处理 UTF-8 中文', () => {
    expect(sha256('你好')).toBe(
      '670d9743542cae3ea7ebe36af56bd53648b0a1126162e78d81a32934a711302e'
    )
  })

  it('相同输入应产生相同哈希', () => {
    expect(sha256('same input')).toBe(sha256('same input'))
  })
})
