import { IEventListenerOptions, IEventListener, IEvent, Event } from './base'

export interface ITypeEventListenerOptions extends IEventListenerOptions {}
export interface ITypeEventListener extends IEventListener {
  (this: ITypeEventManager, event: ITypeEvent): void
}
export interface ITypeEvent extends IEvent {
  readonly type: string
}
export class TypeEvent extends Event implements ITypeEvent {
  constructor(public readonly type: string) {
    super()
  }
}

export interface ITypeEventManager {
  addEventListener(
    type: string,
    callback: ITypeEventListener,
    options?: ITypeEventListenerOptions
  ): void
  removeEventListener(type: string): void
  getEventListeners(): Map<string, ITypeEventListener[]>
  hasEventListener(callback: ITypeEventListener): boolean
  dispatchEvent(event: ITypeEvent): boolean
}

export class TypeEventManager implements ITypeEventManager {
  protected readonly listeners = new Map<
    string,
    Map<ITypeEventListener, ITypeEventListenerOptions>
  >()

  addEventListener(
    type: string,
    callback: ITypeEventListener,
    options?: ITypeEventListenerOptions
  ): void {
    if (!options) {
      options = {
        once: false,
      }
    }
    const listener = this.listeners.get(type)
    if (listener) {
      listener.set(callback, options)
    } else {
      this.listeners.set(type, new Map([[callback, options]]))
    }
  }

  removeEventListener(type: string): void {
    this.listeners.delete(type)
  }

  getEventListeners(): Map<string, ITypeEventListener[]> {
    const listeners = new Map<string, ITypeEventListener[]>()
    this.listeners.forEach((listener, type) => {
      listeners.set(type, Array.from(listener.keys()))
    })
    return listeners
  }

  hasEventListener(callback: ITypeEventListener): boolean {
    return [...this.listeners.values()].some((listener) => listener.has(callback))
  }

  dispatchEvent(event: ITypeEvent): boolean {
    let tag = false
    const listener = this.listeners.get(event.type)
    if (listener) {
      listener.forEach((options, callback) => {
        if (options.once) {
          listener.delete(callback)
        }
        callback.call(this, event)
        tag = true
      })
    }
    return tag
  }
}
