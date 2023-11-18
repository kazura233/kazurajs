import { IEventListenerOptions, IEventListener, IEvent, Event } from './base'
export interface IBasicEventListenerOptions extends IEventListenerOptions {}
export interface IBasicEventListener extends IEventListener {
  (this: IBasicEventManager, event: IBasicEvent): void
}
export interface IBasicEvent extends IEvent {}
export class BasicEvent extends Event implements IBasicEvent {}

export interface IBasicEventManager {
  addEventListener(callback: IBasicEventListener, options?: IBasicEventListenerOptions): void
  removeEventListener(callback: IBasicEventListener): void
  getEventListeners(): IBasicEventListener[]
  hasEventListener(callback: IBasicEventListener): boolean
  dispatchEvent(event: IBasicEvent): boolean
}

export class BasicEventManager implements IBasicEventManager {
  protected readonly listeners = new Map<IBasicEventListener, IBasicEventListenerOptions>()

  addEventListener(callback: IBasicEventListener, options?: IBasicEventListenerOptions): void {
    if (!options) {
      options = {
        once: false,
      }
    }
    this.listeners.set(callback, options)
  }

  removeEventListener(callback: IBasicEventListener): void {
    this.listeners.delete(callback)
  }

  getEventListeners(): IBasicEventListener[] {
    return Array.from(this.listeners.keys())
  }

  hasEventListener(callback: IBasicEventListener): boolean {
    return this.listeners.has(callback)
  }

  dispatchEvent(event: IBasicEvent): boolean {
    let tag = false
    this.listeners.forEach((options, callback) => {
      if (options.once) this.listeners.delete(callback)
      callback.call(this, event)
      tag = true
    })
    return tag
  }
}
