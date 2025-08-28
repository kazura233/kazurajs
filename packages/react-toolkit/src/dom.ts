import type * as React from 'react'
import type { Root } from 'react-dom/client'
import { createRoot } from 'react-dom/client'

const rootMap = new WeakMap<Element | DocumentFragment, Root>()

export function render(node: React.ReactElement, container: Element | DocumentFragment) {
  let root = rootMap.get(container)
  if (!root) {
    root = createRoot(container)
    rootMap.set(container, root)
  }
  root.render(node)
}

export function unmount(container: Element | DocumentFragment) {
  const root = rootMap.get(container)
  if (root) {
    root.unmount()
    rootMap.delete(container)
  }
}
