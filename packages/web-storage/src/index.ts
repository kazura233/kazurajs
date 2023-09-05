class WebStorage {
  private readonly type: Array<any> = [Array, Object, Boolean, Number, String, Map, Set, void 0]
  private storage: Storage
  private keyName: string
  private valueType: any

  public constructor(storage: Storage, keyName: string, valueType: any) {
    this.storage = storage
    this.keyName = keyName
    if (!this.type.includes(valueType)) {
      throw new Error('unknown type')
    }
    this.valueType = valueType
  }

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

  public getItem(): any {
    const value = this.storage.getItem(this.keyName)
    return value === null ? null : this.unserialize(value, this.valueType)
  }

  public setItem(value: any): void {
    this.storage.setItem(this.keyName, this.serialize(value, this.valueType))
  }

  public removeItem(): void {
    this.storage.removeItem(this.keyName)
  }

  public clear(): void {
    this.storage.clear()
  }

  public key(key: number): string | null {
    return this.storage.key(key)
  }

  public get length(): number {
    return this.storage.length
  }

  public set lenght(_: number) {
    throw new Error('readonly')
  }

  public all(): { [key: string]: string } {
    return { ...this.storage }
  }

  public getStorage(): Storage {
    return this.storage
  }

  public getKeyName(): string {
    return this.keyName
  }

  public getValueType(): any {
    return this.valueType
  }
}

export default WebStorage
