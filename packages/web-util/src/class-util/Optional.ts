/**
 * 一个可能包含或不包含非空值的容器对象。
 * 如果包含值，`isPresent()` 返回 `true`。如果不包含值，
 * 对象被认为是空的，`isPresent()` 返回 `false`。
 */
export class Optional<T> {
  /**
   * `empty()` 方法返回的常见实例。
   * @private
   */
  private static EMPTY = new Optional<any>(null)

  /**
   * 构造一个包含描述值的实例。
   * @param value - 描述的值，调用者有责任确保该值非空，
   *                除非创建的是 `empty()` 方法返回的单例实例。
   */
  private constructor(private value: T | null) {}

  /**
   * 返回一个空的 `Optional` 实例。
   *
   * @returns 一个空的 `Optional` 实例
   */
  static empty<T>(): Optional<T> {
    return Optional.EMPTY
  }

  /**
   * 返回一个描述给定非空值的 `Optional`。
   *
   * @param value - 描述的值，必须非空
   * @returns 一个包含给定值的 `Optional`
   * @throws Error - 如果值为空或未定义
   */
  static of<T>(value: T): Optional<T> {
    if (value === null || value === undefined) {
      throw new Error('Value must not be null or undefined')
    }
    return new Optional(value)
  }

  /**
   * 返回一个描述给定值的 `Optional`，如果值为空，返回一个空的 `Optional`。
   *
   * @param value - 可能为空的值
   * @returns 一个包含给定值的 `Optional`，如果值为空则返回一个空的 `Optional`
   */
  static ofNullable<T>(value: T | null | undefined): Optional<T> {
    return value === null || value === undefined ? Optional.empty() : new Optional(value)
  }

  /**
   * 如果包含值，返回该值，否则抛出错误。
   *
   * @returns 包含的值
   * @throws Error - 如果值不存在
   */
  get(): T {
    if (this.value === null || this.value === undefined) {
      throw new Error('No value present')
    }
    return this.value
  }

  /**
   * 如果包含值，返回 `true`，否则返回 `false`。
   *
   * @returns 如果包含值返回 `true`，否则返回 `false`
   */
  isPresent(): boolean {
    return this.value !== null && this.value !== undefined
  }

  /**
   * 如果不包含值，返回 `true`，否则返回 `false`。
   *
   * @returns 如果不包含值返回 `true`，否则返回 `false`
   */
  isEmpty(): boolean {
    return this.value === null || this.value === undefined
  }

  /**
   * 如果包含值，执行给定的操作，否则不执行任何操作。
   *
   * @param action - 包含值时要执行的操作
   */
  ifPresent(action: (value: T) => void): void {
    if (this.value !== null && this.value !== undefined) {
      action(this.value)
    }
  }

  /**
   * 如果包含值，执行给定的操作，否则执行给定的空操作。
   *
   * @param action - 包含值时要执行的操作
   * @param emptyAction - 不包含值时要执行的空操作
   */
  ifPresentOrElse(action: (value: T) => void, emptyAction: () => void): void {
    if (this.value !== null && this.value !== undefined) {
      action(this.value)
    } else {
      emptyAction()
    }
  }

  /**
   * 如果包含值并且值匹配给定的谓词，返回描述该值的 `Optional`，否则返回一个空的 `Optional`。
   *
   * @param predicate - 用于测试值的谓词
   * @returns 如果包含值并且值匹配谓词，返回一个包含该值的 `Optional`，否则返回一个空的 `Optional`
   */
  filter(predicate: (value: T) => boolean): Optional<T> {
    if (this.isEmpty()) {
      return this
    }
    return predicate(this.value!) ? this : Optional.empty()
  }

  /**
   * 如果包含值，返回一个描述应用给定映射函数结果的 `Optional`，否则返回一个空的 `Optional`。
   *
   * @param mapper - 映射函数
   * @returns 一个包含映射函数结果的 `Optional`，如果不包含值则返回一个空的 `Optional`
   */
  map<U>(mapper: (value: T) => U): Optional<U> {
    if (this.isEmpty()) {
      return Optional.empty()
    }
    return Optional.ofNullable(mapper(this.value!))
  }

  /**
   * 如果包含值，返回应用给定 `Optional` 映射函数结果的 `Optional`，否则返回一个空的 `Optional`。
   *
   * @param mapper - 返回 `Optional` 的映射函数
   * @returns 应用映射函数结果的 `Optional`，如果不包含值则返回一个空的 `Optional`
   */
  flatMap<U>(mapper: (value: T) => Optional<U>): Optional<U> {
    if (this.isEmpty()) {
      return Optional.empty()
    }
    return mapper(this.value!)
  }

  /**
   * 如果包含值，返回描述该值的 `Optional`，否则返回由给定供应函数生成的 `Optional`。
   *
   * @param supplier - 生成 `Optional` 的供应函数
   * @returns 包含值的 `Optional`，如果不包含值则返回供应函数生成的 `Optional`
   */
  or(supplier: () => Optional<T>): Optional<T> {
    if (this.isPresent()) {
      return this
    }
    return supplier()
  }

  /**
   * 如果包含值，返回该值，否则返回 `other`。
   *
   * @param other - 如果不包含值要返回的值，可以为 `null`
   * @returns 包含的值，如果不包含值则返回 `other`
   */
  orElse(other: T): T {
    return this.value !== null && this.value !== undefined ? this.value : other
  }

  /**
   * 如果包含值，返回该值，否则返回由供应函数生成的结果。
   *
   * @param supplier - 生成值的供应函数
   * @returns 包含的值，如果不包含值则返回供应函数生成的值
   */
  orElseGet(supplier: () => T): T {
    return this.value !== null && this.value !== undefined ? this.value : supplier()
  }

  /**
   * 如果包含值，返回该值，否则抛出由给定异常供应函数生成的异常。
   *
   * @param exceptionSupplier - 生成异常的供应函数
   * @returns 包含的值
   * @throws X - 如果不包含值则抛出供应函数生成的异常
   */
  orElseThrow<X extends Error>(exceptionSupplier: () => X): T {
    if (this.value !== null && this.value !== undefined) {
      return this.value
    }
    throw exceptionSupplier()
  }

  /**
   * 判断另一个对象是否 "等于" 这个 `Optional`。
   *
   * @param other - 要测试是否相等的对象
   * @returns 如果另一个对象等于这个对象返回 `true`，否则返回 `false`
   */
  equals(other: any): boolean {
    if (this === other) {
      return true
    }
    if (other instanceof Optional) {
      return this.value === other.value
    }
    return false
  }
}
