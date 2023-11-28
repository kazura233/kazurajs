import { makeAutoObservable } from 'mobx'

export class DemoStore {
  num: number = 0

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
}
