[npm]: https://img.shields.io/npm/v/@kazura/googleapis
[npm-url]: https://www.npmjs.com/package/@kazura/googleapis
[size]: https://packagephobia.now.sh/badge?p=@kazura/googleapis
[size-url]: https://packagephobia.now.sh/result?p=@kazura/googleapis
[license]: https://img.shields.io/badge/License-MIT-blue
[license-url]: https://github.com/kazura233/kazurajs/blob/master/LICENSE

[![npm][npm]][npm-url]
[![size][size]][size-url]
[![license][license]][license-url]

# @kazura/googleapis

Google APIs 是一个用于集成 Google 服务的工具包，目前支持 Google OAuth2 认证和 reCAPTCHA 验证。

## 特性

- 支持 Google OAuth2 认证
- 支持 reCAPTCHA 验证
- 提供完整的 TypeScript 类型支持
- 基于官方的 Google APIs 客户端库

## 安装

```bash
npm install @kazura/googleapis
```

## 使用方法

### Google OAuth2

```typescript
import { GoogleOAuth2 } from '@kazura/googleapis'

// 创建 OAuth2 客户端
const oauth2 = new GoogleOAuth2({
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret',
  redirectUri: 'your-redirect-uri',
})

// 生成认证 URL
const authUrl = oauth2.generateAuthUrl({
  scope: ['profile', 'email'],
  access_type: 'offline',
})

// 获取用户信息
const userInfo = await oauth2.getUserInfo({
  code: 'authorization-code',
})
```

### Google reCAPTCHA

```typescript
import { GoogleCaptcha } from '@kazura/googleapis'

// 创建 reCAPTCHA 验证器
const captcha = new GoogleCaptcha('your-secret-key')

// 验证 token
const result = await captcha.verify('user-response-token', 'user-ip-address')
if (result.success) {
  console.log('验证成功')
} else {
  console.log('验证失败:', result['error-codes'])
}
```

## API 参考

### GoogleOAuth2

#### 构造函数

```typescript
constructor(options: OAuth2ClientOptions)
```

参数：

- `options`: OAuth2 客户端配置
  - `clientId`: 客户端 ID
  - `clientSecret`: 客户端密钥
  - `redirectUri`: 重定向 URI

#### 方法

##### generateAuthUrl

```typescript
generateAuthUrl(opts?: GenerateAuthUrlOpts): string
```

生成 OAuth2 认证 URL。

参数：

- `opts`: 认证 URL 生成选项
  - `scope`: 请求的权限范围
  - `access_type`: 访问类型
  - `prompt`: 提示类型
  - 其他选项...

返回值：

- 认证 URL 字符串

##### getUserInfo

```typescript
async getUserInfo(options: GetTokenOptions): Promise<UserInfo>
```

获取用户信息。

参数：

- `options`: 获取令牌的选项
  - `code`: 授权码
  - `redirect_uri`: 重定向 URI

返回值：

- 用户信息对象

### GoogleCaptcha

#### 构造函数

```typescript
constructor(secret: string)
```

参数：

- `secret`: reCAPTCHA 密钥

#### 方法

##### verify

```typescript
async verify(token: string, remoteip?: string): Promise<VerifyResponse>
```

验证 reCAPTCHA token。

参数：

- `token`: 用户响应 token
- `remoteip`: 用户 IP 地址（可选）

返回值：

- 验证响应对象
  - `success`: 是否验证成功
  - `challenge_ts`: 挑战时间戳
  - `hostname`: 主机名
  - `error-codes`: 错误代码数组（如果验证失败）

## 类型定义

### VerifyResponseErrorCode

```typescript
type VerifyResponseErrorCode =
  | 'missing-input-secret' // 缺少密钥参数
  | 'invalid-input-secret' // 密钥参数无效或格式错误
  | 'missing-input-response' // 缺少响应参数
  | 'invalid-input-response' // 响应参数无效或格式错误
  | 'bad-request' // 请求无效或格式错误
  | 'timeout-or-duplicate' // 响应已过期或已被使用
```

### VerifyResponse

```typescript
interface VerifyResponse {
  success: boolean
  challenge_ts: string
  hostname: string
  'error-codes': VerifyResponseErrorCode[]
}
```

## 注意事项

1. 使用 OAuth2 时，需要先在 Google Cloud Console 创建项目并配置 OAuth2 凭据
2. 使用 reCAPTCHA 时，需要先在 Google reCAPTCHA 管理控制台注册站点
3. 请妥善保管客户端密钥和 reCAPTCHA 密钥
4. 建议在生产环境中使用环境变量存储敏感信息

## 示例

### OAuth2 登录流程

```typescript
import { GoogleOAuth2 } from '@kazura/googleapis'

const oauth2 = new GoogleOAuth2({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_REDIRECT_URI,
})

// 1. 生成认证 URL
const authUrl = oauth2.generateAuthUrl({
  scope: ['profile', 'email'],
  access_type: 'offline',
  prompt: 'consent',
})

// 2. 重定向用户到认证 URL
// window.location.href = authUrl

// 3. 处理回调
async function handleCallback(code: string) {
  try {
    const userInfo = await oauth2.getUserInfo({ code })
    console.log('用户信息:', userInfo)
    // 处理用户信息...
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
}
```

### reCAPTCHA 验证

```typescript
import { GoogleCaptcha } from '@kazura/googleapis'

const captcha = new GoogleCaptcha(process.env.RECAPTCHA_SECRET_KEY)

async function verifyCaptcha(token: string, ip: string) {
  try {
    const result = await captcha.verify(token, ip)
    if (result.success) {
      console.log('验证成功')
      return true
    } else {
      console.log('验证失败:', result['error-codes'])
      return false
    }
  } catch (error) {
    console.error('验证过程出错:', error)
    return false
  }
}
```

## 文档

更多详细信息请查看 [文档](https://kazura233.github.io/kazurajs/docs/googleapis)。

## 许可证

MIT

## Author

👤 **kazura233**

- Website: https://github.com/kazura233
- Github: [@kazura233](https://github.com/kazura233)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/kazura233/kazurajs/issues).

## Show your support

Give a ⭐️ if this project helped you!
