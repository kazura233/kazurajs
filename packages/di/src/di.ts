import type { Dependency, DependencyIdentifier, Injector } from '@wendellhu/redi'

/**
 * 将依赖项注册到注入器中。
 * @param injector 要注册依赖项的注入器。
 * @param dependencies 要注册的依赖项。
 */
export function registerDependencies(injector: Injector, dependencies: Dependency[]): void {
  dependencies.forEach((d) => injector.add(d))
}

/**
 * 触发一组依赖项以确保它们被实例化。
 * @param injector 要触发依赖项的注入器。
 * @param dependencies 要触发的依赖项。
 */
export function touchDependencies(
  injector: Injector,
  dependencies: [DependencyIdentifier<unknown>][]
): void {
  dependencies.forEach(([d]) => {
    if (injector.has(d)) {
      injector.get(d)
    }
  })
}
