---
sidebar_position: 15
---

# React Store

React Store 是一个基于 Redux Toolkit 的状态管理工具包，它提供了更简洁的 API 来创建和管理 Redux store。

## 特性

- 基于 Redux Toolkit 的状态管理
- 提供简洁的 API 来创建和管理 store
- 支持 TypeScript 类型推导
- 支持函数式和对象式的状态更新
- 支持状态合并和部分更新
- 轻量级，无依赖

## 安装

```bash
npm install @kazura/react-store
```

## 使用方法

### 创建 Store

```typescript
import { createSlice } from '@kazura/react-store'

// 定义状态类型
interface UserState {
  name: string
  age: number
  isLoggedIn: boolean
}

// 创建初始状态
const initialState: UserState = {
  name: '',
  age: 0,
  isLoggedIn: false,
}

// 创建 slice
const { reducer, action } = createSlice<UserState>('user', initialState)

// 创建 actions
export const userActions = {
  setName: action((name: string) => ({ name })),
  setAge: action((age: number) => ({ age })),
  login: action(() => ({ isLoggedIn: true })),
  logout: action(() => ({ isLoggedIn: false })),
  updateProfile: action((name: string, age: number) => ({ name, age })),
  reset: action(() => initialState),
}

export { reducer as userReducer }
```

### 配置 Store

```typescript
import { configureStore } from '@reduxjs/toolkit'
import { userReducer, userActions } from './user.slice'

const store = configureStore({
  reducer: {
    user: userReducer,
  },
})

export { store, userActions }
```

### 在组件中使用

```typescript
import { useSelector, useDispatch } from 'react-redux'
import { userActions } from './user.slice'

function UserProfile() {
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.user)

  return (
    <div>
      <h1>User Profile</h1>
      <p>Name: {user.name}</p>
      <p>Age: {user.age}</p>
      <p>Status: {user.isLoggedIn ? 'Logged In' : 'Logged Out'}</p>
      <button onClick={() => dispatch(userActions.setName('John'))}>Change Name</button>
      <button onClick={() => dispatch(userActions.setAge(30))}>Change Age</button>
      <button onClick={() => dispatch(userActions.login())}>Login</button>
      <button onClick={() => dispatch(userActions.logout())}>Logout</button>
    </div>
  )
}
```

## API 参考

### createSlice

```typescript
function createSlice<T>(
  name: string,
  initialState: T
): {
  reducer: Reducer<T>
  action: <Handel extends (...args: any[]) => Partial<T> | ((state: T) => Partial<T> | void)>(
    handel: Handel
  ) => (...args: Parameters<Handel>) => PayloadAction<(state: T) => T | void>
}
```

创建一个 Redux slice。

参数：

- `name`: slice 名称
- `initialState`: 初始状态

返回值：

- 包含 reducer 和 action 创建器的对象

## 类型定义

### Draft

```typescript
type Draft<T> = {
  -readonly [P in keyof T]: Draft<T[P]>
}
```

用于创建可变的类型。

### PayloadAction

```typescript
interface PayloadAction<P = void, T extends string = string> {
  payload: P
  type: T
}
```

Redux action 类型。

## 注意事项

1. 确保在使用 store 之前配置了 Redux store
2. 使用 TypeScript 来获得更好的类型提示
3. 可以使用函数式或对象式的状态更新
4. 建议将相关的 actions 组织在一起
5. 函数式更新可以访问完整的状态
6. 对象式更新会自动合并状态
7. 返回 undefined 的函数式更新不会改变状态

## 示例

### 创建复杂的 Store

```typescript
import { createSlice } from '@kazura/react-store'

interface TodoState {
  todos: { id: number; text: string; completed: boolean }[]
  filter: 'all' | 'active' | 'completed'
}

const initialState: TodoState = {
  todos: [],
  filter: 'all',
}

const { reducer, action } = createSlice<TodoState>('todo', initialState)

export const todoActions = {
  addTodo: action((text: string) => (state) => ({
    todos: [...state.todos, { id: Date.now(), text, completed: false }],
  })),
  toggleTodo: action((id: number) => (state) => ({
    todos: state.todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ),
  })),
  removeTodo: action((id: number) => (state) => ({
    todos: state.todos.filter((todo) => todo.id !== id),
  })),
  setFilter: action((filter: TodoState['filter']) => ({ filter })),
  clearCompleted: action((state) => ({
    todos: state.todos.filter((todo) => !todo.completed),
  })),
}

export { reducer as todoReducer }
```

### 使用函数式更新

```typescript
import { createSlice } from '@kazura/react-store'

interface CounterState {
  count: number
  history: number[]
}

const initialState: CounterState = {
  count: 0,
  history: [],
}

const { reducer, action } = createSlice<CounterState>('counter', initialState)

export const counterActions = {
  increment: action(() => (state) => ({
    count: state.count + 1,
    history: [...state.history, state.count + 1],
  })),
  decrement: action(() => (state) => ({
    count: state.count - 1,
    history: [...state.history, state.count - 1],
  })),
  reset: action(() => initialState),
  setCount: action((count: number) => (state) => ({
    count,
    history: [...state.history, count],
  })),
}

export { reducer as counterReducer }
```

### 使用对象式更新

```typescript
import { createSlice } from '@kazura/react-store'

interface SettingsState {
  theme: 'light' | 'dark'
  language: string
  notifications: boolean
}

const initialState: SettingsState = {
  theme: 'light',
  language: 'en',
  notifications: true,
}

const { reducer, action } = createSlice<SettingsState>('settings', initialState)

export const settingsActions = {
  setTheme: action((theme: SettingsState['theme']) => ({ theme })),
  setLanguage: action((language: string) => ({ language })),
  toggleNotifications: action(() => (state) => ({
    notifications: !state.notifications,
  })),
  reset: action(() => initialState),
}

export { reducer as settingsReducer }
```

### 组合多个 Store

```typescript
import { configureStore } from '@reduxjs/toolkit'
import { userReducer, userActions } from './user.slice'
import { todoReducer, todoActions } from './todo.slice'
import { counterReducer, counterActions } from './counter.slice'
import { settingsReducer, settingsActions } from './settings.slice'

const store = configureStore({
  reducer: {
    user: userReducer,
    todo: todoReducer,
    counter: counterReducer,
    settings: settingsReducer,
  },
})

export { store, userActions, todoActions, counterActions, settingsActions }
```
