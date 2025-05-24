---
sidebar_position: 7
---

# Web Crypto

Web Crypto 是一个提供常用加密算法的工具包，基于 crypto-js 和 jsencrypt 实现，支持 Base64、MD5、SHA256、RSA 和 AES 加密。

## 特性

- 支持 Base64 编码和解码
- 支持 MD5 哈希计算
- 支持 SHA256 哈希计算
- 支持 RSA-1024 和 RSA-2048 加密
- 支持 AES-128-ECB 加密
- 提供密钥生成功能

## 安装

```bash
npm install @kazura/web-crypto
```

## 使用方法

### Base64 编码

```typescript
import { Base64 } from '@kazura/web-crypto'

// 编码
const encoded = Base64.stringify('Hello, World!')
console.log(encoded) // 'SGVsbG8sIFdvcmxkIQ=='

// 解码
const decoded = Base64.parse('SGVsbG8sIFdvcmxkIQ==')
console.log(decoded) // 'Hello, World!'
```

### MD5 哈希

```typescript
import { md5 } from '@kazura/web-crypto'

// 计算 MD5 哈希
const hash = md5('Hello, World!')
console.log(hash) // '65a8e27d8879283831b664bd8b7f0ad4'
```

### SHA256 哈希

```typescript
import { sha256 } from '@kazura/web-crypto'

// 计算 SHA256 哈希
const hash = sha256('Hello, World!')
console.log(hash) // 'dffd6021bb2bd5b0af676290809ec3a53191dd81c7f70a4b28688a362182986f'
```

### RSA 加密

```typescript
import { Rsa1024, Rsa2048 } from '@kazura/web-crypto'

// 生成 RSA-1024 密钥对
const cert1024 = Rsa1024.createCertificate()
console.log('Private Key:', cert1024.privkey)
console.log('Public Key:', cert1024.pubkey)

// 使用 RSA-1024 加密
const encrypted1024 = Rsa1024.encrypt('Secret message', cert1024.pubkey)
console.log('Encrypted:', encrypted1024)

// 使用 RSA-1024 解密
const decrypted1024 = Rsa1024.decrypt(encrypted1024, cert1024.privkey)
console.log('Decrypted:', decrypted1024)

// 生成 RSA-2048 密钥对
const cert2048 = Rsa2048.createCertificate()
console.log('Private Key:', cert2048.privkey)
console.log('Public Key:', cert2048.pubkey)

// 使用 RSA-2048 加密
const encrypted2048 = Rsa2048.encrypt('Secret message', cert2048.pubkey)
console.log('Encrypted:', encrypted2048)

// 使用 RSA-2048 解密
const decrypted2048 = Rsa2048.decrypt(encrypted2048, cert2048.privkey)
console.log('Decrypted:', decrypted2048)
```

### AES 加密

```typescript
import { Aes128Ecb } from '@kazura/web-crypto'

// 生成 AES 密钥
const key = Aes128Ecb.generateBase64Key()
console.log('AES Key:', key)

// 使用普通密钥加密
const encrypted = Aes128Ecb.encrypt('Secret message', 'your-secret-key')
console.log('Encrypted:', encrypted)

// 使用普通密钥解密
const decrypted = Aes128Ecb.decrypt(encrypted, 'your-secret-key')
console.log('Decrypted:', decrypted)

// 使用 Base64 密钥加密
const encryptedWithBase64 = Aes128Ecb.encryptWithBase64Key('Secret message', key)
console.log('Encrypted with Base64 key:', encryptedWithBase64)

// 使用 Base64 密钥解密
const decryptedWithBase64 = Aes128Ecb.decryptWithBase64Key(encryptedWithBase64, key)
console.log('Decrypted with Base64 key:', decryptedWithBase64)
```

## API 参考

### Base64

- `static stringify(str: string): string` - 将字符串编码为 Base64
- `static parse(str: string): string` - 将 Base64 解码为字符串

### md5

- `md5(message: string): string` - 计算字符串的 MD5 哈希值

### sha256

- `sha256(message: string): string` - 计算字符串的 SHA256 哈希值

### Rsa1024/Rsa2048

- `static encrypt(str: string, pubkey: string): string` - 使用公钥加密
- `static decrypt(str: string, privkey: string): string` - 使用私钥解密
- `static createCertificate(): Certificate` - 生成密钥对
  - 返回 `{ privkey: string, pubkey: string }`

### Aes128Ecb

- `static encrypt(message: string, key: string): string` - 使用普通密钥加密
- `static decrypt(ciphertext: string, key: string): string` - 使用普通密钥解密
- `static generateBase64Key(): string` - 生成 Base64 编码的密钥
- `static encryptWithBase64Key(plaintext: string, key: string): string` - 使用 Base64 密钥加密
- `static decryptWithBase64Key(ciphertext: string, key: string): string` - 使用 Base64 密钥解密

## 注意事项

1. RSA-1024 密钥长度较短，建议使用 RSA-2048
2. AES-128-ECB 模式安全性较低，建议使用更安全的加密模式
3. 密钥需要安全存储，不要硬编码在代码中
4. 使用 Base64 密钥时，确保密钥格式正确
5. 加密数据时注意处理特殊字符和编码问题

## 示例

### 文件加密

```typescript
import { Aes128Ecb } from '@kazura/web-crypto'

// 生成密钥
const key = Aes128Ecb.generateBase64Key()

// 加密文件内容
const fileContent = 'File content to encrypt'
const encrypted = Aes128Ecb.encryptWithBase64Key(fileContent, key)

// 解密文件内容
const decrypted = Aes128Ecb.decryptWithBase64Key(encrypted, key)
```

### 密码哈希

```typescript
import { sha256 } from '@kazura/web-crypto'

// 计算密码哈希
const password = 'user-password'
const salt = 'random-salt'
const hashedPassword = sha256(password + salt)
```

### 安全通信

```typescript
import { Rsa2048, Aes128Ecb } from '@kazura/web-crypto'

// 生成 RSA 密钥对
const cert = Rsa2048.createCertificate()

// 生成 AES 密钥
const aesKey = Aes128Ecb.generateBase64Key()

// 使用 RSA 加密 AES 密钥
const encryptedKey = Rsa2048.encrypt(aesKey, cert.pubkey)

// 使用 AES 加密消息
const message = 'Secret message'
const encryptedMessage = Aes128Ecb.encryptWithBase64Key(message, aesKey)

// 解密过程
const decryptedKey = Rsa2048.decrypt(encryptedKey, cert.privkey)
const decryptedMessage = Aes128Ecb.decryptWithBase64Key(encryptedMessage, decryptedKey)
```
