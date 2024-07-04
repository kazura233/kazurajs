export interface Type<T = any> extends Function {
  new (...args: any[]): T
}

export type InjectionToken<T = any> = string | symbol | Type<T>

export enum Scope {
  DEFAULT = 0,
  LAZY = 1,
}

export interface ClassProvider<T = any> {
  provide: InjectionToken
  useClass: Type<T>
  scope?: Scope
}

export type Provider<T = any> = Type<any> | ClassProvider<T>

export class MobxMap {
  private isInitialized: boolean = false

  private raw: Map<InjectionToken, ClassProvider> = new Map()

  private map: Map<InjectionToken, InstanceType<Type>> = new Map()

  public constructor(providers?: Provider[]) {
    if (providers) {
      const iterable: [InjectionToken, ClassProvider][] = providers.map((provider) => {
        if (provider && 'useClass' in provider) {
          return [provider.provide, provider]
        }
        return [provider, { provide: provider, useClass: provider }]
      })
      this.raw = new Map(iterable)
    }
    this.init()
  }

  public init() {
    if (!this.isInitialized) {
      this.isInitialized = true
      const iterable: [InjectionToken, InstanceType<Type>][] = Array.from(this.raw.entries()).map(
        ([, provider]) => {
          if (provider.scope === Scope.LAZY) {
            return [provider.provide, undefined]
          }
          return [provider.provide, new provider.useClass()]
        }
      )
      this.map = new Map(iterable)
    }
  }

  public get<TInput = any, TResult = TInput>(typeOrToken: Type<TInput> | string | symbol): TResult {
    const result = this.map.get(typeOrToken)
    if (result) {
      return result as TResult
    }

    const provider = this.raw.get(typeOrToken)
    if (!provider) {
      throw new Error(`MobxMap: key ${String(typeOrToken)} not found`)
    }

    const instance = new provider.useClass()
    this.map.set(typeOrToken, instance)

    return instance as TResult
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
  return new MobxMap(providers)
}
