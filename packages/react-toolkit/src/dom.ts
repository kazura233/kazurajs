import type * as React from 'react'
import type { Container, Root, RootOptions } from 'react-dom/client'
import { createRoot } from 'react-dom/client'

const rootMap = new WeakMap<Container, Root>()

export function render(node: React.ReactNode, container: Container, options?: RootOptions) {
  let root = rootMap.get(container)
  if (!root) {
    root = createRoot(container, options)
    rootMap.set(container, root)
  }
  root.render(node)
}

export function unmount(container: Container) {
  const root = rootMap.get(container)
  if (root) {
    root.unmount()
    rootMap.delete(container)
  }
}
