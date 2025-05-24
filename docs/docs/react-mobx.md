---
sidebar_position: 14
---

# React MobX

React MobX 是一个用于 React 应用的 MobX 状态管理工具包，它提供了依赖注入式的状态管理方案。

## 特性

- 支持依赖注入式的状态管理
- 支持懒加载状态
- 提供完整的 TypeScript 类型支持
- 基于 MobX 的响应式状态管理
- 支持状态观察和自动更新
- 支持非响应式状态管理

## 安装

```bash
npm install @kazura/react-mobx
```

## 使用方法

### 创建 Store

```typescript
import { makeAutoObservable } from 'mobx'

class UserStore {
  name: string = ''
  age: number = 0

  constructor() {
    makeAutoObservable(this)
  }

  setName(name: string) {
    this.name = name
  }

  setAge(age: number) {
    this.age = age
  }
}

export { UserStore }
```

### 配置 Provider

```typescript
import { MobxProvider, createStores } from '@kazura/react-mobx'
import { UserStore } from './stores/user.store'

const stores = createStores([
  UserStore,
  {
    provide: 'ConfigStore',
    useClass: ConfigStore,
    scope: Scope.LAZY, // 懒加载
  },
])

function App() {
  return (
    <MobxProvider stores={stores}>
      <YourApp />
    </MobxProvider>
  )
}
```

### 在组件中使用 Store

```typescript
import { useStore } from '@kazura/react-mobx'
import { UserStore } from './stores/user.store'

function UserProfile() {
  const userStore = useStore(UserStore)

  return (
    <div>
      <h1>User Profile</h1>
      <p>Name: {userStore.name}</p>
      <p>Age: {userStore.age}</p>
      <button onClick={() => userStore.setName('John')}>Change Name</button>
      <button onClick={() => userStore.setAge(30)}>Change Age</button>
    </div>
  )
}
```

## API 参考

### MobxProvider

```typescript
interface MobxProviderProps {
  children: React.ReactNode
  stores: IStores
}

const MobxProvider: React.FC<React.PropsWithChildren<MobxProviderProps>>
```

MobX Provider 组件，用于提供状态管理上下文。会自动观察状态变化并触发更新。

参数：

- `children`: 子组件
- `stores`: MobX 状态存储实例

### MobxInactiveProvider

```typescript
const MobxInactiveProvider: React.FC<React.PropsWithChildren<MobxProviderProps>>
```

非响应式的 MobX Provider 组件，不会自动观察状态变化，只在 stores 引用变化时更新。

参数：

- `children`: 子组件
- `stores`: MobX 状态存储实例

### useStore

```typescript
function useStore<TInput = any, TResult = TInput>(
  typeOrToken: Type<TInput> | string | symbol
): TResult
```

用于获取 Store 实例的 Hook。如果 Store 未提供，会抛出错误。

参数：

- `typeOrToken`: Store 类型或注入令牌

返回值：

- Store 实例

### MobxMap

```typescript
class MobxMap {
  constructor(providers?: Provider[])
  init(): void
  get<TInput = any, TResult = TInput>(typeOrToken: Type<TInput> | string | symbol): TResult
  has(token: InjectionToken): boolean
  values(): IterableIterator<InstanceType<Type>>
  keys(): IterableIterator<InjectionToken>
  entries(): IterableIterator<[InjectionToken, InstanceType<Type>]>
  [Symbol.iterator](): IterableIterator<[InjectionToken, InstanceType<Type>]>
}
```

MobX 状态存储映射类，实现了 Map 接口。

### createStores

```typescript
function createStores(providers: Provider[]): MobxMap
```

创建 MobX 状态存储实例。

参数：

- `providers`: 提供者数组

返回值：

- MobX 状态存储实例

## 类型定义

### Type

```typescript
interface Type<T = any> extends Function {
  new (...args: any[]): T
}
```

类型定义接口。

### InjectionToken

```typescript
type InjectionToken<T = any> = string | symbol | Type<T>
```

注入令牌类型。

### Scope

```typescript
enum Scope {
  DEFAULT = 0,
  LAZY = 1,
}
```

作用域枚举。

### ClassProvider

```typescript
interface ClassProvider<T = any> {
  provide: InjectionToken
  useClass: Type<T>
  scope?: Scope
}
```

类提供者接口。

### Provider

```typescript
type Provider<T = any> = Type<any> | ClassProvider<T>
```

提供者类型。

## 注意事项

1. 确保在使用 Store 之前配置了 MobxProvider
2. 使用 makeAutoObservable 或 makeObservable 来使 Store 可观察
3. 懒加载的 Store 会在第一次使用时初始化
4. 建议使用 TypeScript 来获得更好的类型提示
5. MobxProvider 会自动观察状态变化并触发更新
6. MobxInactiveProvider 不会自动观察状态变化，适合不需要响应式更新的场景
7. Store 未提供时会抛出错误，请确保正确配置了 Provider

## 示例

### 创建多个 Store

```typescript
import { makeAutoObservable } from 'mobx'

class UserStore {
  name: string = ''
  age: number = 0

  constructor() {
    makeAutoObservable(this)
  }

  setName(name: string) {
    this.name = name
  }

  setAge(age: number) {
    this.age = age
  }
}

class ConfigStore {
  theme: string = 'light'
  language: string = 'en'

  constructor() {
    makeAutoObservable(this)
  }

  setTheme(theme: string) {
    this.theme = theme
  }

  setLanguage(language: string) {
    this.language = language
  }
}

export { UserStore, ConfigStore }
```

### 使用懒加载 Store

```typescript
import { MobxProvider, createStores, Scope } from '@kazura/react-mobx'
import { UserStore, ConfigStore } from './stores'

const stores = createStores([
  UserStore,
  {
    provide: 'ConfigStore',
    useClass: ConfigStore,
    scope: Scope.LAZY,
  },
])

function App() {
  return (
    <MobxProvider stores={stores}>
      <YourApp />
    </MobxProvider>
  )
}
```

### 使用非响应式 Provider

```typescript
import { MobxInactiveProvider, createStores } from '@kazura/react-mobx'
import { UserStore } from './stores'

const stores = createStores([UserStore])

function App() {
  return (
    <MobxInactiveProvider stores={stores}>
      <YourApp />
    </MobxInactiveProvider>
  )
}
```
