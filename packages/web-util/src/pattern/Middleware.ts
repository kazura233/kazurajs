export type MiddlewareHandler<T> = (data: IMiddlewareCore<T>) => void

export interface IMiddlewareCore<T> {
  data: T
  next(): void
  abort(): void
  isAborted(): boolean
}

export class MiddlewareCore<T> implements IMiddlewareCore<T> {
  protected index = -1
  protected handlers: Array<MiddlewareHandler<T>>

  public data: T

  public constructor(data: T, handlers: Array<MiddlewareHandler<T>>) {
    this.data = data
    this.handlers = handlers
  }

  public next() {
    this.index++

    while (this.index < this.handlers.length) {
      const handler = this.handlers[this.index]
      if (handler) {
        handler(this)
        this.index++
      }
    }
  }

  public abort() {
    this.index = Number.POSITIVE_INFINITY
  }

  public isAborted() {
    return this.index >= Number.POSITIVE_INFINITY
  }
}

export interface IMiddleware<T> {
  use(handler: MiddlewareHandler<T>): void
  execute(data: T): void
}

export abstract class Middleware<T> implements IMiddleware<T> {
  protected handlers: Array<MiddlewareHandler<T>> = []

  public use(handler: MiddlewareHandler<T>) {
    this.handlers.push(handler)
  }

  public execute(data: T) {
    const core = new MiddlewareCore(data, this.handlers)
    core.next()
    if (!core.isAborted()) {
      this.handleProcess(core.data)
    }
  }

  protected abstract handleProcess(data: T): void
}
