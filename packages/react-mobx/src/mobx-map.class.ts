export interface Type<T = any> extends Function {
  new (...args: any[]): T
}

export type InjectionToken<T = any> = string | symbol | Type<T>

export interface ClassProvider<T = any> {
  provide: InjectionToken
  useClass: Type<T>
}

export type Provider<T = any> = Type<any> | ClassProvider<T>

export class MobxMap {
  private isInitialized: boolean = false

  private raw: Map<InjectionToken, Type> = new Map()

  private map: Map<InjectionToken, InstanceType<Type>> = new Map()

  public constructor(providers?: Provider[]) {
    if (providers) {
      const iterable: [InjectionToken, Type][] = providers.map((provider) => {
        if (provider && 'useClass' in provider) {
          return [provider.provide, provider.useClass]
        }
        return [provider, provider]
      })
      this.raw = new Map(iterable)
    }
    this.init()
  }

  public init() {
    if (!this.isInitialized) {
      this.isInitialized = true
      const iterable: [InjectionToken, InstanceType<Type>][] = Array.from(this.raw.entries()).map(
        ([key, value]) => [key, new value()]
      )
      this.map = new Map(iterable)
    }
  }

  public get<TInput = any, TResult = TInput>(typeOrToken: Type<TInput> | string | symbol): TResult {
    if (!this.map.has(typeOrToken)) {
      throw new Error(`MobxMap: key ${String(typeOrToken)} not found`)
    }
    return this.map.get(typeOrToken) as TResult
  }

  public has(token: InjectionToken): boolean {
    return this.map.has(token)
  }

  public values(): IterableIterator<InstanceType<Type>> {
    return this.map.values()
  }

  public keys(): IterableIterator<InjectionToken> {
    return this.map.keys()
  }

  public entries(): IterableIterator<[InjectionToken, InstanceType<Type>]> {
    return this.map.entries()
  }

  public [Symbol.iterator](): IterableIterator<[InjectionToken, InstanceType<Type>]> {
    return this.map.entries()
  }

  public readonly [Symbol.toStringTag]: string = 'MobxMap'
}

export const createStores = (providers: Provider[]): MobxMap => {
  return new MobxMap()
}
