class WebStorage {
  /**
   * 支持的数据类型数组
   */
  private readonly type: Array<any> = [Array, Object, Boolean, Number, String, Map, Set, void 0]
  /**
   * 存储对象
   */
  private storage: Storage
  /**
   * 存储的键名
   */
  private keyName: string
  /**
   * 存储值的数据类型
   */
  private valueType: any

  /**
   * 构造函数
   * @param storage 存储对象，如localStorage或sessionStorage
   * @param keyName 存储的键名
   * @param valueType 存储值的数据类型
   */
  public constructor(storage: Storage, keyName: string, valueType: any) {
    this.storage = storage
    this.keyName = keyName
    // 检查数据类型是否合法
    if (!this.type.includes(valueType)) {
      throw new Error('Unknown value type')
    }
    this.valueType = valueType
  }

  /**
   * 序列化值为字符串
   * @param value 要序列化的值
   * @param type 数据类型
   * @returns 序列化后的字符串
   */
  public serialize(value: any, type: any): string {
    switch (type) {
      case void 0:
        return JSON.stringify(value)
      case Map:
      case Set:
        value = Array.from(value)
      case Array:
      case Object:
        return JSON.stringify(value)
      case Boolean:
      case Number:
      case String:
      default:
        return '' + value
    }
  }

  /**
   * 反序列化字符串为值
   * @param value 要反序列化的字符串
   * @param type 数据类型
   * @returns 反序列化后的值
   */
  public unserialize(value: string, type: any): any {
    switch (type) {
      case void 0:
        try {
          return JSON.parse(value)
        } catch (error) {
          console.error(error)
          this.removeItem()
          return null
        }
      case Map:
        return new Map(JSON.parse(value))
      case Set:
        return new Set(JSON.parse(value))
      case Array:
      case Object:
        return JSON.parse(value)
      case Boolean:
        return value === 'true'
      case Number:
        return +value
      case String:
      default:
        return value
    }
  }

  /**
   * 获取存储的值
   * @returns 存储的值，如果不存在则返回null
   */
  public getItem(): any {
    const value = this.storage.getItem(this.keyName)
    return value === null ? null : this.unserialize(value, this.valueType)
  }

  /**
   * 设置存储的值
   * @param value 要存储的值
   */
  public setItem(value: any): void {
    this.storage.setItem(this.keyName, this.serialize(value, this.valueType))
  }

  /**
   * 移除存储的值
   */
  public removeItem(): void {
    this.storage.removeItem(this.keyName)
  }

  /**
   * 清空存储
   */
  public clear(): void {
    this.storage.clear()
  }

  /**
   * 获取指定索引的键名
   * @param key 索引
   * @returns 键名，如果索引无效则返回null
   */
  public key(key: number): string | null {
    return this.storage.key(key)
  }

  /**
   * 获取存储的键值对个数
   */
  public get length(): number {
    return this.storage.length
  }

  /**
   * 设置存储的键值对个数（只读属性）
   */
  public set length(_: number) {
    throw new Error('Read-only property')
  }

  /**
   * 获取所有存储的键值对
   * @returns 所有存储的键值对
   */
  public all(): { [key: string]: string } {
    return { ...this.storage }
  }

  /**
   * 获取存储对象
   * @returns 存储对象
   */
  public getStorage(): Storage {
    return this.storage
  }

  /**
   * 获取存储的键名
   * @returns 键名
   */
  public getKeyName(): string {
    return this.keyName
  }

  /**
   * 获取存储值的数据类型
   * @returns 数据类型
   */
  public getValueType(): any {
    return this.valueType
  }
}

export default WebStorage
