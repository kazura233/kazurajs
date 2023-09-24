import { action } from './demo-slice'

export const set = action((num: number) => ({ num }))

export const increment = action(() => (state) => {
  state.num += 1
})

export const decrement = action(() => (state) => {
  state.num -= 1
})

export const incrementByAmount = action((n: number) => (state) => {
  state.num += n
})
