import { IEventListenerOptions, IEventListener, IEvent, Event } from './base'

export interface IBasicTypeEventListenerOptions extends IEventListenerOptions {}
export interface IBasicTypeEventListener extends IEventListener {
  (this: IBasicTypeEventManager, event: IBasicTypeEvent): void
}
export interface IBasicTypeEvent extends IEvent {
  readonly type: string
}
export class BasicTypeEvent extends Event implements IBasicTypeEvent {
  constructor(public readonly type: string) {
    super()
  }
}

export interface IBasicTypeEventManager {
  addEventListener(
    type: string,
    callback: IBasicTypeEventListener,
    options?: IBasicTypeEventListenerOptions
  ): void
  removeEventListener(type: string): void
  getEventListeners(): Map<string, IBasicTypeEventListener>
  hasEventListener(callback: IBasicTypeEventListener): boolean
  dispatchEvent(event: IBasicTypeEvent): boolean
}

export class BasicTypeEventManager implements IBasicTypeEventManager {
  protected readonly listeners = new Map<
    string,
    { callback: IBasicTypeEventListener; options: IBasicTypeEventListenerOptions }
  >()

  addEventListener(
    type: string,
    callback: IBasicTypeEventListener,
    options?: IBasicTypeEventListenerOptions
  ): void {
    if (!options) {
      options = {
        once: false,
      }
    }
    this.listeners.set(type, { callback, options })
  }

  removeEventListener(type: string): void {
    this.listeners.delete(type)
  }

  getEventListeners(): Map<string, IBasicTypeEventListener> {
    const listeners = new Map<string, IBasicTypeEventListener>()
    this.listeners.forEach(({ callback }, type) => listeners.set(type, callback))
    return listeners
  }

  hasEventListener(callback: IBasicTypeEventListener): boolean {
    return [...this.listeners.values()].some(({ callback: cb }) => cb === callback)
  }

  dispatchEvent(event: IBasicTypeEvent): boolean {
    const { type } = event
    const listener = this.listeners.get(type)
    if (listener) {
      listener.callback.call(this, event)
      if (listener.options.once) {
        this.listeners.delete(type)
      }
      return true
    }
    return false
  }
}
