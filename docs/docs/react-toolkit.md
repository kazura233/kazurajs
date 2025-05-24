---
sidebar_position: 16
---

# React Toolkit

React Toolkit 是一个提供 React 组件定义工具的工具包，它提供了更简洁的 API 来定义函数组件和转发引用组件。

## 特性

- 提供简洁的组件定义 API
- 支持 TypeScript 类型推导
- 支持组件属性类型检查
- 支持默认属性值
- 支持组件显示名称
- 支持组件记忆化

## 安装

```bash
npm install @kazura/react-toolkit
```

## 使用方法

### 定义函数组件

```typescript
import { defineFunctionComponent } from '@kazura/react-toolkit'

interface ButtonProps {
  text: string
  onClick?: () => void
  disabled?: boolean
}

const Button = defineFunctionComponent<ButtonProps>(
  ({ text, onClick, disabled = false }) => {
    return (
      <button onClick={onClick} disabled={disabled}>
        {text}
      </button>
    )
  },
  {
    displayName: 'Button',
    defaultProps: {
      disabled: false,
    },
    memo: true,
  }
)

export { Button }
```

### 定义转发引用组件

```typescript
import { defineForwardRefRenderFunction } from '@kazura/react-toolkit'

interface InputProps {
  value: string
  onChange?: (value: string) => void
  placeholder?: string
}

const Input = defineForwardRefRenderFunction<HTMLInputElement, InputProps>(
  ({ value, onChange, placeholder }, ref) => {
    return (
      <input
        ref={ref}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
      />
    )
  },
  {
    displayName: 'Input',
    defaultProps: {
      placeholder: '',
    },
  }
)

export { Input }
```

## API 参考

### defineFunctionComponent

```typescript
function defineFunctionComponent<P = {}>(
  render: FC<P>,
  options?: IFunctionComponentOptions<P>
): MemoExoticComponent<FC<P>> | FC<P>
```

定义一个函数组件。

参数：

- `render`: 组件渲染函数
- `options`: 组件选项
  - `propTypes`: 属性类型定义
  - `contextTypes`: 上下文类型定义
  - `defaultProps`: 默认属性值
  - `displayName`: 组件显示名称
  - `memo`: 是否使用 memo 包装组件

返回值：

- 函数组件或记忆化函数组件

### defineForwardRefRenderFunction

```typescript
function defineForwardRefRenderFunction<T, P = {}>(
  render: ForwardRefRenderFunction<T, PropsWithoutRef<P>>,
  options?: IForwardRefRenderFunctionOptions<PropsWithoutRef<P> & RefAttributes<T>>
): ForwardRefExoticComponent<PropsWithoutRef<P> & RefAttributes<T>>
```

定义一个转发引用组件。

参数：

- `render`: 组件渲染函数
- `options`: 组件选项
  - `propTypes`: 属性类型定义
  - `defaultProps`: 默认属性值
  - `displayName`: 组件显示名称

返回值：

- 转发引用组件

## 类型定义

### IFunctionComponentOptions

```typescript
interface IFunctionComponentOptions<P> {
  propTypes?: WeakValidationMap<P>
  contextTypes?: ValidationMap<any>
  defaultProps?: Partial<P>
  displayName?: string
  memo?: boolean
}
```

函数组件选项接口。

### IForwardRefRenderFunctionOptions

```typescript
interface IForwardRefRenderFunctionOptions<P> {
  propTypes?: WeakValidationMap<P>
  defaultProps?: Partial<P>
  displayName?: string
}
```

转发引用组件选项接口。

## 注意事项

1. 使用 TypeScript 来获得更好的类型提示
2. 建议使用 memo 选项来优化性能
3. 使用 displayName 来方便调试
4. 使用 defaultProps 来设置默认属性值

## 示例

### 创建表单组件

```typescript
import { defineFunctionComponent } from '@kazura/react-toolkit'

interface FormProps {
  onSubmit: (data: any) => void
  children: React.ReactNode
  className?: string
}

const Form = defineFunctionComponent<FormProps>(
  ({ onSubmit, children, className = '' }) => {
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      const formData = new FormData(e.target as HTMLFormElement)
      const data = Object.fromEntries(formData)
      onSubmit(data)
    }

    return (
      <form onSubmit={handleSubmit} className={className}>
        {children}
      </form>
    )
  },
  {
    displayName: 'Form',
    memo: true,
  }
)

export { Form }
```

### 创建模态框组件

```typescript
import { defineForwardRefRenderFunction } from '@kazura/react-toolkit'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

const Modal = defineForwardRefRenderFunction<HTMLDivElement, ModalProps>(
  ({ isOpen, onClose, title, children }, ref) => {
    if (!isOpen) return null

    return (
      <div ref={ref} className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>{title}</h2>
            <button onClick={onClose}>×</button>
          </div>
          <div className="modal-body">{children}</div>
        </div>
      </div>
    )
  },
  {
    displayName: 'Modal',
  }
)

export { Modal }
```

### 创建列表组件

```typescript
import { defineFunctionComponent } from '@kazura/react-toolkit'

interface ListProps<T> {
  items: T[]
  renderItem: (item: T) => React.ReactNode
  keyExtractor: (item: T) => string | number
  className?: string
}

const List = defineFunctionComponent<ListProps<any>>(
  ({ items, renderItem, keyExtractor, className = '' }) => {
    return (
      <ul className={className}>
        {items.map((item) => (
          <li key={keyExtractor(item)}>{renderItem(item)}</li>
        ))}
      </ul>
    )
  },
  {
    displayName: 'List',
    memo: true,
  }
)

export { List }
```

### 创建卡片组件

```typescript
import { defineForwardRefRenderFunction } from '@kazura/react-toolkit'

interface CardProps {
  title: string
  content: React.ReactNode
  footer?: React.ReactNode
  onClick?: () => void
}

const Card = defineForwardRefRenderFunction<HTMLDivElement, CardProps>(
  ({ title, content, footer, onClick }, ref) => {
    return (
      <div ref={ref} className="card" onClick={onClick}>
        <div className="card-header">
          <h3>{title}</h3>
        </div>
        <div className="card-body">{content}</div>
        {footer && <div className="card-footer">{footer}</div>}
      </div>
    )
  },
  {
    displayName: 'Card',
  }
)

export { Card }
```
