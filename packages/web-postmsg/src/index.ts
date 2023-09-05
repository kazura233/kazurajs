import { random } from '@kazura/web-util'

export interface MessageData<T = any> {
  tag: typeof WebPostMsg.MESSAGE_TAG
  type: string
  resources: T
  channel: string
  uuid: string
}

export interface IPostMsgAPI {}

export type Listener = (resources: any, event: MessageEvent<MessageData>) => any

export type executor = { resolve: (value: any) => void; reject: (reason?: any) => void }

export interface PostMsgAPIOptions {
  listeners?: Map<string, Listener>
  receiver: Window
  channel: string
  receiveAllChannel?: boolean
}

export default class WebPostMsg implements IPostMsgAPI {
  /**
   * 消息标签
   */
  public static readonly MESSAGE_TAG = 'application/x-web-postmsg-v2'

  public static readonly PREFIX_DEFAULT = 'CALL__'
  public static readonly PREFIX_INTERNAL = 'INTERNAL__'
  public static readonly REPLY_TYPE = WebPostMsg.PREFIX_INTERNAL + 'REPLY__MSG'

  /**
   * 频道
   */
  public readonly channel: string

  /**
   * 发送者(自身)
   */
  public readonly self: Window = window

  /**
   * 接收者
   */
  public get receiver(): Window {
    return this.options.receiver
  }
  public set receiver(value: Window) {
    this.receiver = value
  }

  /**
   * 监听函数集合
   */
  private listeners: Map<string, Listener> = new Map()

  /**
   * 执行者事件池
   */
  private executorPool: Map<string, executor> = new Map()

  /**
   * 是否接收所有渠道的消息
   */
  public receiveAllChannel: boolean = false

  private options: PostMsgAPIOptions

  public constructor(options: PostMsgAPIOptions) {
    this.options = options
    this.channel = options.channel

    if (options.receiveAllChannel) this.receiveAllChannel = options.receiveAllChannel

    if (options.listeners) {
      for (const [type, listener] of options.listeners) {
        this.on(type, listener)
      }
    }
    this.self.addEventListener('message', this.eventHandler)
  }

  /**
   * 生成一个随机的id
   * @returns
   */
  public static generateUUID() {
    return '' + random(10000, 99999) + new Date().getTime()
  }

  public generateUUID() {
    return WebPostMsg.generateUUID()
  }

  /**
   * 生成一条消息
   * @param type
   * @param resources
   * @param replyMessageId
   * @returns
   */
  public generateMessage(type: string, resources: any, replyMessageId?: string): MessageData {
    return {
      tag: WebPostMsg.MESSAGE_TAG,
      type,
      resources,
      channel: this.channel,
      uuid: replyMessageId ?? WebPostMsg.generateUUID(),
    }
  }

  /**
   * 事件处理
   * @param event
   * @returns
   */
  private eventHandler = (event: MessageEvent<MessageData>) => {
    const { data } = event
    if (typeof data === 'object' && 'tag' in data && data.tag === WebPostMsg.MESSAGE_TAG) {
      if (this.channel === data.channel || this.receiveAllChannel) {
        /**
         * 收到一条事件回应，根据uuid将回应数据交给对应的事件发起者。
         */
        if (data.type === WebPostMsg.REPLY_TYPE) {
          const p = this.executorPool.get(data.uuid)
          this.executorPool.delete(data.uuid)
          if (p) p.resolve(data.resources)
          return
        }

        const listener = this.listeners.get(data.type)
        if (listener) {
          const reply = (resources: any) => this.replyMessage(resources, data.uuid)
          const result = listener(data.resources, event)
          if (typeof result === 'object' && 'then' in result && typeof result.then === 'function') {
            result.then((resources: any) => reply(resources))
          } else {
            reply(result)
          }
        }
      }
    }
  }

  /**
   * 回复一条消息
   * @param resources
   * @param replyMessageId
   */
  public replyMessage(resources: any, replyMessageId: string) {
    const message = this.generateMessage(WebPostMsg.REPLY_TYPE, resources, replyMessageId)
    this.postMessage(message)
  }

  /**
   * 发送一条消息
   * @param message
   * @param targetOrigin
   */
  public postMessage(message: MessageData, targetOrigin: string = '*') {
    this.receiver.postMessage(message, targetOrigin)
  }

  /**
   * 事件派发
   * @param resolve
   * @param reject
   * @param event
   * @param resources
   */
  public eventDispatcher(
    resolve: (value: any) => void,
    reject: (reason?: any) => void,
    event: string,
    resources: any
  ) {
    // 生成消息
    const msg = this.generateMessage(WebPostMsg.PREFIX_DEFAULT + event, resources)
    this.executorPool.set(msg.uuid, { resolve, reject })
    // 派发消息给子窗口
    this.postMessage(msg, '*')
    // 超时处理
    this.self.setTimeout(() => {
      if (this.executorPool.has(msg.uuid)) {
        this.executorPool.delete(msg.uuid)
        reject(new Error(`eventDispatcher: message type ${msg.type} timeout`))
      }
    }, 5000)
  }

  /**
   * 注册一个监听函数
   * @param type
   * @param listener
   */
  public on(type: string, listener: Listener) {
    this.listeners.set(WebPostMsg.PREFIX_DEFAULT + type, listener)
  }

  /**
   * 移除一个监听函数
   * @param type
   */
  public off(type: string) {
    this.listeners.delete(WebPostMsg.PREFIX_DEFAULT + type)
  }

  /**
   * 派发一个监听函数
   * @param type
   * @param resources
   * @returns
   */
  public emit(type: string, resources: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.eventDispatcher(resolve, reject, type, resources)
    })
  }

  /**
   * 析构方法，移除所有副作用。
   */
  public destroy() {
    this.self.removeEventListener('message', this.eventHandler)
  }
}
