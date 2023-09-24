import { createSlice as __createSlice, Draft, PayloadAction } from '@reduxjs/toolkit'

export const createSlice = <T>(name: string, initialState: T) => {
  const __slice = __createSlice({
    name,
    initialState,
    reducers: {
      __ACTION: (state: Draft<T>, action: PayloadAction<(state: T) => T | void>) => {
        const newState = action.payload(state as T)
        if (newState) {
          return newState
        }
      },
    },
  })

  const reducer = __slice.reducer

  const __ACTION = __slice.actions.__ACTION

  const action = <
    Handel extends (...args: any[]) => Partial<T> | ((state: T) => Partial<T> | void)
  >(
    handel: Handel
  ) => {
    return (...args: Parameters<Handel>) => {
      const result = handel(...args)
      const action: (state: T) => Partial<T> | void =
        typeof result === 'function' ? result : () => result
      return __ACTION((state) => {
        const newState = action(state)
        if (newState) {
          return { ...state, ...newState }
        }
      })
    }
  }

  return {
    reducer,
    action,
  }
}
