import Taro from '@tarojs/taro'

class TaroStorage implements Storage {
  public get length(): number {
    const { keys } = Taro.getStorageInfoSync()
    return keys.length
  }

  public set lenght(_: number) {
    throw new Error('readonly')
  }

  public clear(): void {
    Taro.clearStorageSync()
  }

  public getItem(key: string): string | null {
    return Taro.getStorageSync(key)
  }

  public key(index: number): string | null {
    const { keys } = Taro.getStorageInfoSync()
    if (index >= keys.length) return null
    return this.getItem(keys[index])
  }

  public removeItem(key: string): void {
    Taro.removeStorageSync(key)
  }

  public setItem(key: string, value: string): void {
    Taro.setStorageSync(key, value)
  }

  public all() {
    const list: {
      [key: string]: any
    } = {}
    const { keys } = Taro.getStorageInfoSync()
    for (const key of keys) {
      list[key] = this.getItem(key)
    }
    return list
  }
}

const taroStorage = new TaroStorage()

export default taroStorage
