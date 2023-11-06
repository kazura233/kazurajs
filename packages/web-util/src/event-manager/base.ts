export interface IEvent {
  readonly timeStamp: number
  returnValue: any
}

export interface IEventListener {
  (event: IEvent): void
}

export interface IEventListenerOptions {
  once?: boolean
}

export class Event implements IEvent {
  public readonly timeStamp: number = new Date().getTime()
  public returnValue: any
}
