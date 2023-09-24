import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'

import { demoSlice } from './demo/demo-slice'

export * from 'redux-thunk'

export * from './demo'

export const store = configureStore({
  reducer: {
    demo: demoSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoreActions: true,
      },
    }),
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
