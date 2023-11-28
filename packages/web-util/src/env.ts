/**
 * 判断是否在浏览器环境中
 */
export const isBrowser = () => typeof window !== 'undefined'

/**
 * 判断是否为IE浏览器
 */
export const isIE = () => isBrowser() && /msie|trident/.test(navigator.userAgent.toLowerCase())

/**
 * 判断是否为IE 9
 */
export const isIE9 = () => isBrowser() && navigator.userAgent.toLowerCase().includes('msie 9.0')

/**
 * 判断是否为Edge浏览器
 */
export const isEdge = () => isBrowser() && navigator.userAgent.toLowerCase().includes('edge/')

/**
 * 判断是否为Android设备
 */
export const isAndroid = () => isBrowser() && navigator.userAgent.toLowerCase().includes('android')

/**
 * 判断是否为iOS设备
 */
export const isIOS = () =>
  isBrowser() && /iphone|ipad|ipod|ios/.test(navigator.userAgent.toLowerCase())

/**
 * 判断是否为Chrome浏览器（不包括Edge）
 */
export const isChrome = () =>
  isBrowser() && /chrome\/\d+/.test(navigator.userAgent.toLowerCase()) && !isEdge()

/**
 * 判断是否为PhantomJS浏览器
 */
export const isPhantomJS = () =>
  isBrowser() && navigator.userAgent.toLowerCase().includes('phantomjs')

/**
 * 判断是否为Firefox浏览器，并获取版本号
 */
export const isFirefox = () =>
  isBrowser() && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) !== null

/**
 * 判断一个函数是否为 JavaScript 的内置函数
 * @param {any} Ctor - 要检查的函数。
 * @returns {boolean} - 如果函数是本地代码，则返回 true；否则返回 false。
 */
export function isNative(Ctor: any): boolean {
  if (typeof Ctor === 'function') {
    return /native code/.test(Ctor.toString())
  }
  return false
}
