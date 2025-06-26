import Big from 'big.js'

/**
 * 数字源
 */
export type DecimalSource = Big.BigSource

/**
 * 舍入模式
 *
 * 0: 向下取整
 *
 * 1: 默认，四舍五入
 *
 * 2: 银行家舍入法
 *
 * 3: 向上取整
 */
export type RoundingMode = Big.RoundingMode

/**
 * 比较结果
 *
 * -1: a < b
 *
 * 0: a = b
 *
 * 1: a > b
 */
export type Comparison = Big.Comparison

/**
 * 数字异常
 */
export class DecimalError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DecimalError'
  }
}

/**
 * 数字工具类
 */
export class Decimal {
  /**
   * 向下取整
   */
  static readonly DECIMAL_ROUNDDOWN = Big.roundDown
  /**
   * 默认，四舍五入
   */
  static readonly DECIMAL_ROUNDHALFUP = Big.roundHalfUp
  /**
   * 银行家舍入法
   */
  static readonly DECIMAL_ROUNDHALFEVEN = Big.roundHalfEven
  /**
   * 向上取整
   */
  static readonly DECIMAL_ROUNDUP = Big.roundUp

  /**
   * 小数位数，默认2位
   */
  static DP: number = 2
  /**
   * 舍入模式，默认四舍五入
   */
  static RM: RoundingMode = Decimal.DECIMAL_ROUNDHALFUP

  /**
   * 加法
   * @param a
   * @param b
   * @param dp 小数位数
   * @param rm 舍入模式
   * @returns
   */
  static add(
    a: DecimalSource,
    b: DecimalSource,
    dp: number = Decimal.DP,
    rm: RoundingMode = Decimal.RM
  ): string {
    return new Big(a).plus(b).toFixed(dp, rm)
  }

  /**
   * 减法
   * @param a
   * @param b
   * @param dp 小数位数
   * @param rm 舍入模式
   * @returns
   */
  static sub(
    a: DecimalSource,
    b: DecimalSource,
    dp: number = Decimal.DP,
    rm: RoundingMode = Decimal.RM
  ): string {
    return new Big(a).minus(b).toFixed(dp, rm)
  }

  /**
   * 乘法
   * @param a
   * @param b
   * @param dp 小数位数
   * @param rm 舍入模式
   * @returns
   */
  static mul(
    a: DecimalSource,
    b: DecimalSource,
    dp: number = Decimal.DP,
    rm: RoundingMode = Decimal.RM
  ): string {
    return new Big(a).times(b).toFixed(dp, rm)
  }

  /**
   * 除法
   * @param a
   * @param b
   * @param dp 小数位数
   * @param rm 舍入模式
   * @returns
   */
  static div(
    a: DecimalSource,
    b: DecimalSource,
    dp: number = Decimal.DP,
    rm: RoundingMode = Decimal.RM
  ): string {
    if (new Big(b).eq(0)) {
      throw new DecimalError('by zero')
    }
    return new Big(a).div(b).toFixed(dp, rm)
  }

  /**
   * 比较
   * @param a
   * @param b
   * @returns 1: a > b, 0: 相等，-1: a < b
   */
  static cmp(a: DecimalSource, b: DecimalSource): Comparison {
    return new Big(a).cmp(b)
  }

  /**
   * 等于
   * @param a
   * @param b
   * @returns true: 相等，false: 不相等
   */
  static eq(a: DecimalSource, b: DecimalSource): boolean {
    return new Big(a).eq(b)
  }

  /**
   * 大于
   * @param a
   * @param b
   * @returns true: a > b, false: a <= b
   */
  static gt(a: DecimalSource, b: DecimalSource): boolean {
    return new Big(a).gt(b)
  }

  /**
   * 大于等于
   * @param a
   * @param b
   * @returns true: a >= b, false: a < b
   */
  static gte(a: DecimalSource, b: DecimalSource): boolean {
    return new Big(a).gte(b)
  }

  /**
   * 小于
   * @param a
   * @param b
   * @returns true: a < b, false: a >= b
   */
  static lt(a: DecimalSource, b: DecimalSource): boolean {
    return new Big(a).lt(b)
  }

  /**
   * 小于等于
   * @param a
   * @param b
   * @returns true: a <= b, false: a > b
   */
  static lte(a: DecimalSource, b: DecimalSource): boolean {
    return new Big(a).lte(b)
  }

  /**
   * 格式化
   * @param value
   * @param dp
   * @param rm
   * @returns
   */
  static format(
    value: DecimalSource,
    dp: number = Decimal.DP,
    rm: RoundingMode = Decimal.RM
  ): string {
    return new Big(value).toFixed(dp, rm)
  }
}
