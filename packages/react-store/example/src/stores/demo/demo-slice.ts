import { createSlice } from '../../../../src/index'

export interface IDemoState {
  num: number
}

export const demoSlice = createSlice<IDemoState>('demo', {
  num: 0,
})

export const action = demoSlice.action
