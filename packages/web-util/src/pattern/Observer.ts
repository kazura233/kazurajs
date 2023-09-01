export interface IObserver<T extends Record<string, any>> {
  __target: T
  observer(target: T): T
  listeners: Array<(data: T) => void>
  subscribe(listener: (data: T) => void): void
  unsubscribe(listener: (data: T) => void): void
  notify(): void
}

/**
 * 观察者
 *
 * 观察一个对象（只观察第一层）如果目标内容发生变化，那么就会通知所有订阅者
 */
export class Observer<T extends Record<string, any>> implements IObserver<T> {
  public __target: T

  public constructor(target: T) {
    this.__target = this.observer(target)
  }

  public observer(target: T): T {
    return new Proxy<T>(target, {
      get: (target, propKey, receiver) => {
        return Reflect.get(target, propKey, receiver)
      },
      set: (target, propKey, value, receiver) => {
        const ret = Reflect.set(target, propKey, value, receiver)
        this.notify()
        return ret
      },
    })
  }

  public listeners: Array<(data: T) => void> = []

  public subscribe(listener: (data: T) => void) {
    this.listeners.push(listener)
  }

  public unsubscribe(listener: (data: T) => void) {
    this.listeners = this.listeners.filter((l) => l !== listener)
  }

  public notify() {
    this.listeners.forEach((listener) => listener(this.__target))
  }
}
