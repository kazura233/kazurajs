/**
 * 定义一个泛型类型T，该类型扩展Record<string, any>，用于创建观察者的接口。
 * 观察者监控目标对象的变化并通知其订阅者。
 */
export interface IObserver<T extends Record<string, any>> {
  /**
   * 被观察的目标对象。
   */
  __target: T

  /**
   * 存储被通知目标对象变化的监听器数组。
   */
  listeners: Array<(data: T) => void>

  /**
   * 观察目标对象并返回用于跟踪变化的代理的方法。
   * @param target - 要观察的目标对象。
   * @returns 一个代理对象，用于跟踪目标对象的变化。
   */
  observer(target: T): T

  /**
   * 订阅一个监听器，以便在目标对象发生变化时接收通知。
   * @param listener - 要订阅的监听器函数。
   */
  subscribe(listener: (data: T) => void): void

  /**
   * 取消订阅一个监听器，停止在目标对象发生变化时接收通知。
   * @param listener - 要取消订阅的监听器函数。
   */
  unsubscribe(listener: (data: T) => void): void

  /**
   * 通知所有订阅者目标对象发生变化。
   */
  notify(): void
}

/**
 * 实现IObserver接口的观察者类。
 * 观察目标对象（仅观察第一层），并通知所有订阅者其变化。
 */
export class Observer<T extends Record<string, any>> implements IObserver<T> {
  /**
   * 被观察的目标对象。
   */
  public __target: T

  /**
   * 存储被通知目标对象变化的监听器数组。
   */
  public listeners: Array<(data: T) => void> = []

  /**
   * 观察者类的构造函数。
   * @param target - 要观察的初始目标对象。
   */
  public constructor(target: T) {
    // 初始化目标对象并使用observer方法设置观察。
    this.__target = this.observer(target)
  }

  /**
   * 观察目标对象并返回用于跟踪变化的代理的方法。
   * @param target - 要观察的目标对象。
   * @returns 一个代理对象，用于跟踪目标对象的变化。
   */
  public observer(target: T): T {
    return new Proxy<T>(target, {
      get: (target, propKey, receiver) => {
        // 代理获取操作而不进行任何修改。
        return Reflect.get(target, propKey, receiver)
      },
      set: (target, propKey, value, receiver) => {
        // 代理设置操作，通知订阅者，并返回结果。
        const result = Reflect.set(target, propKey, value, receiver)
        this.notify()
        return result
      },
    })
  }

  /**
   * 订阅一个监听器，以便在目标对象发生变化时接收通知。
   * @param listener - 要订阅的监听器函数。
   */
  public subscribe(listener: (data: T) => void) {
    this.listeners.push(listener)
  }

  /**
   * 取消订阅一个监听器，停止在目标对象发生变化时接收通知。
   * @param listener - 要取消订阅的监听器函数。
   */
  public unsubscribe(listener: (data: T) => void) {
    // 从监听器数组中删除指定的监听器。
    this.listeners = this.listeners.filter((l) => l !== listener)
  }

  /**
   * 通知所有订阅者目标对象发生变化。
   */
  public notify() {
    // 遍历所有监听器并使用更新后的目标对象调用它们。
    this.listeners.forEach((listener) => listener(this.__target))
  }
}
