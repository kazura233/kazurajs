import { IEventListenerOptions, IEventListener, IEvent, Event } from './base'

export interface ITypeEventListenerOptions extends IEventListenerOptions {}
export interface ITypeEventListener extends IEventListener {
  (this: ITypeEventManager, event: ITypeEvent): void
}
export interface ITypeEvent extends IEvent {
  readonly type: string
}
export class TypeEvent extends Event implements ITypeEvent {
  public readonly type: string
  constructor(type: string) {
    super()
    this.type = type
  }
}

export interface ITypeEventManager {
  addEventListener(
    type: string,
    callback: ITypeEventListener,
    options?: ITypeEventListenerOptions
  ): void
  removeEventListener(type: string): void
  getEventListeners(): Map<string, Array<ITypeEventListener>>
  hasEventListener(callback: ITypeEventListener): boolean
  dispatchEvent(event: ITypeEvent): boolean
}

export class TypeEventManager implements ITypeEventManager {
  protected readonly listeners = new Map<
    string,
    Map<ITypeEventListener, ITypeEventListenerOptions>
  >()
  public addEventListener(
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

  public removeEventListener(type: string): void {
    this.listeners.delete(type)
  }

  public getEventListeners(): Map<string, Array<ITypeEventListener>> {
    const listeners = new Map<string, Array<ITypeEventListener>>()
    this.listeners.forEach((listener, type) => {
      listeners.set(type, Array.from(listener.keys()))
    })
    return listeners
  }

  public hasEventListener(callback: ITypeEventListener): boolean {
    let has = false
    this.listeners.forEach((listener) => {
      if (listener.has(callback)) {
        has = true
      }
    })
    return has
  }

  public dispatchEvent(event: ITypeEvent): boolean {
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
