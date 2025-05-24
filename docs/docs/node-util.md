---
sidebar_position: 5
---

# Node Util

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
  constructor(repositoryPath: string)

  getBranchName(): Promise<string>
  getShortCommitId(): Promise<string>
  getCommitId(): Promise<string>
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
  pushOrigin(localBranch: string, remoteBranch?: string): Promise<void>
}
```

Git 仓库操作工具类。

### TOTP 验证

#### Totp

```typescript
class Totp {
  static readonly config: ValidTotpConfig
  static generateSecret(): string
  static generatePasscodes(secret: string): string
  static validate(passcode: string, secret: string): boolean
  static generateUrl(issuer: string, user: string, secret: string): string
}
```

TOTP 双因素认证工具类。

### Worker 线程池

#### Worker

```typescript
class Worker<Args extends any[], Ret = any> {
  constructor(filename: string | URL, options?: WorkerOptions)
  run(...args: Args): Promise<Ret>
  stop(): void
}
```

Worker 线程池管理类。

参数：

- `filename`: Worker 文件路径
- `options`: Worker 选项
  - `max`: 最大并发数（默认为 CPU 核心数 - 1）

### 任务工作者

#### TaskWorker

```typescript
abstract class TaskWorker<Args extends any[], Ret = any> {
  readonly workerData: any
  abstract doWork(...args: Args): Ret | Promise<Ret>
}
```

任务工作者基类。

## 注意事项

1. 文件操作函数都是同步的，可能会阻塞主线程
2. Git 操作需要安装 Git 命令行工具
3. TOTP 验证需要安装 time2fa 包
4. Worker 线程池会自动管理线程生命周期
5. 任务工作者需要在 Worker 线程中使用
