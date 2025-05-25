[npm]: https://img.shields.io/npm/v/@kazura/react-hooks
[npm-url]: https://www.npmjs.com/package/@kazura/react-hooks
[size]: https://packagephobia.now.sh/badge?p=@kazura/react-hooks
[size-url]: https://packagephobia.now.sh/result?p=@kazura/react-hooks
[license]: https://img.shields.io/badge/License-MIT-blue
[license-url]: https://github.com/kazura233/kazurajs/blob/master/LICENSE

[![npm][npm]][npm-url]
[![size][size]][size-url]
[![license][license]][license-url]

# @kazura/react-hooks

React Hooks 是一个提供常用 React Hooks 的工具包，它包含了一些在日常开发中经常使用的自定义 Hooks。

## 特性

- 提供常用的自定义 Hooks
- 类型安全的 Hook 实现
- 提供完整的 TypeScript 类型支持
- 轻量级，无依赖

## 安装

```bash
npm install @kazura/react-hooks
```

## 使用方法

### useQuery

用于获取 URL 查询参数。

```typescript
import { useQuery } from '@kazura/react-hooks'

function UserProfile() {
  const query = useQuery()
  const userId = query.get('userId')
  const token = query.get('token')

  return (
    <div>
      <h1>User Profile</h1>
      <p>User ID: {userId}</p>
      <p>Token: {token}</p>
    </div>
  )
}
```

### useSwitch

用于管理布尔状态的 Hook，提供了开、关、切换等操作。

```typescript
import { useSwitch } from '@kazura/react-hooks'

function ToggleButton() {
  const [isOn, { on, off, toggle }] = useSwitch(false)

  return (
    <div>
      <p>Current state: {isOn ? 'ON' : 'OFF'}</p>
      <button onClick={on}>Turn ON</button>
      <button onClick={off}>Turn OFF</button>
      <button onClick={toggle}>Toggle</button>
    </div>
  )
}
```

### useFileExtension

用于获取文件的扩展名。

```typescript
import { useFileExtension } from '@kazura/react-hooks'

function FileUploader() {
  const [file, setFile] = useState<File | null>(null)
  const extension = useFileExtension(file || '')

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {file && <p>File extension: {extension}</p>}
    </div>
  )
}
```

## API 参考

### useQuery

```typescript
function useQuery(): URLSearchParams
```

获取当前 URL 的查询参数。

返回值：

- URLSearchParams 对象，包含所有查询参数

### useSwitch

```typescript
function useSwitch(
  defaultValue?: boolean
): [boolean, { on: () => void; off: () => void; toggle: () => void }]
```

创建一个布尔状态开关。

参数：

- `defaultValue`: 初始状态值，默认为 false

返回值：

- 元组，包含：
  - 当前状态值
  - 包含 on、off、toggle 方法的对象

### useFileExtension

```typescript
function useFileExtension(file: File | string): string
```

获取文件的扩展名。

参数：

- `file`: File 对象或文件名字符串

返回值：

- 文件扩展名字符串

## 注意事项

1. `useQuery` Hook 依赖于 react-router-dom 的 useLocation Hook
2. `useSwitch` Hook 返回的 actions 对象是稳定的，不会在重渲染时改变
3. `useFileExtension` Hook 内部使用 useMemo 优化性能

## 示例

### 使用 useQuery 处理分页

```typescript
import { useQuery } from '@kazura/react-hooks'

function UserList() {
  const query = useQuery()
  const page = Number(query.get('page')) || 1
  const pageSize = Number(query.get('pageSize')) || 10

  return (
    <div>
      <h1>User List</h1>
      <p>Current page: {page}</p>
      <p>Page size: {pageSize}</p>
      {/* 渲染用户列表 */}
    </div>
  )
}
```

### 使用 useSwitch 控制模态框

```typescript
import { useSwitch } from '@kazura/react-hooks'

function Modal() {
  const [isOpen, { on, off }] = useSwitch(false)

  return (
    <div>
      <button onClick={on}>Open Modal</button>
      {isOpen && (
        <div className="modal">
          <h2>Modal Title</h2>
          <p>Modal content...</p>
          <button onClick={off}>Close</button>
        </div>
      )}
    </div>
  )
}
```

### 使用 useFileExtension 验证文件类型

```typescript
import { useFileExtension } from '@kazura/react-hooks'

function ImageUploader() {
  const [file, setFile] = useState<File | null>(null)
  const extension = useFileExtension(file || '')

  const isValidImage = useMemo(() => {
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif']
    return validExtensions.includes(extension.toLowerCase())
  }, [extension])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  return (
    <div>
      <input type="file" onChange={handleFileChange} accept="image/*" />
      {file && (
        <div>
          <p>File extension: {extension}</p>
          {!isValidImage && <p className="error">Please upload a valid image file</p>}
        </div>
      )}
    </div>
  )
}
```

## 文档

更多详细信息请查看 [文档](https://kazura233.github.io/kazurajs/docs/react-hooks)。

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
