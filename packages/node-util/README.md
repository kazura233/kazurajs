[npm]: https://img.shields.io/npm/v/@kazura/node-util
[npm-url]: https://www.npmjs.com/package/@kazura/node-util
[size]: https://packagephobia.now.sh/badge?p=@kazura/node-util
[size-url]: https://packagephobia.now.sh/result?p=@kazura/node-util
[license]: https://img.shields.io/badge/License-MIT-blue
[license-url]: https://github.com/kazura233/kazurajs/blob/master/LICENSE

[![npm][npm]][npm-url]
[![size][size]][size-url]
[![license][license]][license-url]

# @kazura/node-util

Node Util 是一个提供常用工具函数的 Node.js 工具包，包括文件操作、Git 操作、TOTP 验证、Worker 线程等功能。

## 特性

- 文件系统操作
- Git 仓库操作
- TOTP 双因素认证
- Worker 线程池管理
- 任务工作者基类
- 类型安全

## 安装

```bash
npm install @kazura/node-util
```

## 使用方法

### 文件操作

```typescript
import { lookupFile, writeFile, md5, getHash, getPkgJson, getPkgName } from '@kazura/node-util'

// 查找文件
const config = lookupFile(process.cwd(), ['config.json', 'config.js'])

// 写入文件
writeFile('output.txt', 'Hello, World!')

// 生成 MD5 哈希
const hash = md5('Hello, World!')

// 生成短哈希
const shortHash = getHash('Hello, World!')

// 获取 package.json
const pkg = getPkgJson(process.cwd())

// 获取包名
const name = getPkgName('@kazura/node-util')
```

### Git 操作

```typescript
import { GitUtil } from '@kazura/node-util'

const git = new GitUtil(process.cwd())

// 获取分支名
const branch = await git.getBranchName()

// 获取提交 ID
const commitId = await git.getCommitId()

// 获取短提交 ID
const shortCommitId = await git.getShortCommitId()

// 获取用户名和邮箱
const username = await git.getUserName()
const email = await git.getUserEmail()

// 添加文件
await git.add('file.txt')
await git.addAll()

// 提交更改
await git.commit('feat: add new feature')
await git.commitAll('feat: add new feature')

// 更新子模块
await git.submodulesUpdateInit()

// 拉取更新
await git.pullRebaseOrigin()
await git.pullNoRebaseOrigin()

// 切换分支
await git.checkout('main')
await git.checkoutOrigin('feature')

// 推送更改
await git.pushOrigin('main')
```

### TOTP 验证

```typescript
import { Totp } from '@kazura/node-util'

// 生成密钥
const secret = Totp.generateSecret()

// 生成验证码
const passcode = Totp.generatePasscodes(secret)

// 验证验证码
const isValid = Totp.validate(passcode, secret)

// 生成 TOTP URL
const url = Totp.generateUrl('MyApp', 'user@example.com', secret)
```

### Worker 线程池

```typescript
import { Worker } from '@kazura/node-util'

// 创建 Worker 实例
const worker = new Worker('./worker.js', {
  max: 4, // 最大并发数
})

// 运行任务
const result = await worker.run(1, 2)

// 停止所有工作线程
worker.stop()
```

### 任务工作者

```typescript
import { TaskWorker } from '@kazura/node-util'

// 创建任务工作者
class MyWorker extends TaskWorker<[number, number], number> {
  public async doWork(a: number, b: number): Promise<number> {
    return a + b
  }
}

new MyWorker()
```

## API 参考

### 文件操作

#### lookupFile

```typescript
function lookupFile(dir: string, formats: string[], options?: LookupFileOptions): string | undefined
```

在文件系统中查找特定文件。

参数：

- `dir`: 起始目录
- `formats`: 要查找的文件格式数组
- `options`: 查找选项
  - `pathOnly`: 是否只返回文件路径
  - `rootDir`: 根目录
  - `predicate`: 文件条件检查函数

返回值：

- 文件内容或路径，如果未找到则返回 undefined

#### writeFile

```typescript
function writeFile(filename: string, content: string | Uint8Array): void
```

将内容写入文件。

参数：

- `filename`: 文件名
- `content`: 文件内容

#### md5

```typescript
function md5(text: string): string
```

生成 MD5 哈希。

参数：

- `text`: 要哈希的文本

返回值：

- MD5 哈希字符串

#### getHash

```typescript
function getHash(text: string): string
```

生成短哈希。

参数：

- `text`: 要哈希的文本

返回值：

- 8 位十六进制哈希字符串

#### getPkgJson

```typescript
function getPkgJson(root: string): PackageJson
```

获取 package.json 内容。

参数：

- `root`: 项目根目录

返回值：

- package.json 对象

#### getPkgName

```typescript
function getPkgName(name: string): string
```

获取包名。

参数：

- `name`: 完整包名

返回值：

- 包名（不含作用域）

### Git 操作

#### GitUtil

```typescript
class GitUtil {
  constructor(cwd: string)
  getBranchName(): Promise<string>
  getCommitId(): Promise<string>
  getShortCommitId(): Promise<string>
  getUserName(): Promise<string>
  getUserEmail(): Promise<string>
  add(file: string): Promise<void>
  addAll(): Promise<void>
  commit(message: string): Promise<void>
  commitAll(message: string): Promise<void>
  submodulesUpdateInit(): Promise<void>
  pullRebaseOrigin(): Promise<void>
  pullNoRebaseOrigin(): Promise<void>
  checkout(branch: string): Promise<void>
  checkoutOrigin(branch: string): Promise<void>
  pushOrigin(branch: string): Promise<void>
}
```

Git 工具类，提供 Git 仓库操作功能。

### TOTP 验证

#### Totp

```typescript
class Totp {
  static generateSecret(): string
  static generatePasscodes(secret: string): string[]
  static validate(passcode: string, secret: string): boolean
  static generateUrl(issuer: string, accountName: string, secret: string): string
}
```

TOTP 工具类，提供双因素认证功能。

### Worker 线程池

#### Worker

```typescript
class Worker {
  constructor(filename: string, options?: WorkerOptions)
  run(...args: any[]): Promise<any>
  stop(): void
}
```

Worker 线程池类，提供多线程任务处理功能。

### 任务工作者

#### TaskWorker

```typescript
abstract class TaskWorker<TArgs extends any[], TResult> {
  abstract doWork(...args: TArgs): Promise<TResult>
}
```

任务工作者基类，用于创建自定义任务处理类。

## 注意事项

1. 文件操作函数都是同步的
2. Git 操作需要 Git 命令行工具
3. TOTP 验证需要时间同步
4. Worker 线程池需要合理设置并发数
5. 任务工作者需要实现 doWork 方法

## 示例

### 文件操作示例

```typescript
import { lookupFile, writeFile, md5 } from '@kazura/node-util'

// 查找配置文件
const config = lookupFile(process.cwd(), ['config.json', 'config.js'], {
  pathOnly: true,
})

if (config) {
  // 读取配置
  const content = require(config)

  // 修改配置
  content.version = '1.0.0'

  // 写入配置
  writeFile(config, JSON.stringify(content, null, 2))
}

// 生成文件哈希
const fileHash = md5('file.txt')
```

### Git 操作示例

```typescript
import { GitUtil } from '@kazura/node-util'

async function updateGitRepo() {
  const git = new GitUtil(process.cwd())

  // 获取当前分支
  const branch = await git.getBranchName()
  console.log('Current branch:', branch)

  // 拉取更新
  await git.pullRebaseOrigin()

  // 添加所有更改
  await git.addAll()

  // 提交更改
  await git.commit('chore: update dependencies')

  // 推送更改
  await git.pushOrigin(branch)
}
```

### TOTP 验证示例

```typescript
import { Totp } from '@kazura/node-util'

function setupTOTP() {
  // 生成密钥
  const secret = Totp.generateSecret()

  // 生成验证码
  const passcodes = Totp.generatePasscodes(secret)

  // 生成 TOTP URL
  const url = Totp.generateUrl('MyApp', 'user@example.com', secret)

  // 验证验证码
  const isValid = Totp.validate(passcodes[0], secret)

  return { secret, url, isValid }
}
```

### Worker 线程池示例

```typescript
import { Worker } from '@kazura/node-util'

async function processTasks() {
  const worker = new Worker('./worker.js', { max: 4 })

  try {
    // 并行处理多个任务
    const results = await Promise.all([worker.run(1, 2), worker.run(3, 4), worker.run(5, 6)])

    console.log('Results:', results)
  } finally {
    // 停止所有工作线程
    worker.stop()
  }
}
```

## 文档

更多详细信息请查看 [文档](https://kazura233.github.io/kazurajs/docs/node-util)。

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
