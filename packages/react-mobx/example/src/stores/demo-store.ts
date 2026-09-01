import { makeAutoObservable } from 'mobx'

export class DemoStore {
  num: number = 0
  items: string[] = ['one', 'two']
  profile: { name: string; age: number } = { name: 'Demo', age: 18 }

  constructor() {
    makeAutoObservable(this)
  }

  increment() {
    this.num += 1
  }

  decrement() {
    this.num -= 1
  }

  incrementByAmount(n: number) {
    this.num += n
  }

  set(num: number) {
    this.num = num
  }

  addItem(item: string) {
    if (!item.trim()) return
    this.items = [...this.items, item.trim()]
  }

  removeLastItem() {
    this.items = this.items.slice(0, -1)
  }

  updateProfile(name: string, age: number) {
    this.profile = { name, age }
  }
}
