import { Type } from './shared'

export class MobxMap {
  private map: Map<Type, InstanceType<Type>> = new Map()

  constructor(entries?: readonly (readonly [Type, InstanceType<Type>])[]) {
    this.map = new Map(entries)
  }

  get<T extends Type>(key: T): InstanceType<T> {
    if (!this.map.has(key)) {
      throw new Error(`MobxMap: key ${key} not found`)
    }
    return this.map.get(key) as InstanceType<T>
  }

  has(key: Type): boolean {
    return this.map.has(key)
  }

  values(): IterableIterator<InstanceType<Type>> {
    return this.map.values()
  }

  keys(): IterableIterator<Type> {
    return this.map.keys()
  }

  entries(): IterableIterator<[Type, InstanceType<Type>]> {
    return this.map.entries()
  }

  [Symbol.iterator](): IterableIterator<[Type, InstanceType<Type>]> {
    return this.map.entries()
  }

  readonly [Symbol.toStringTag]: string = 'MobxMap'
}
