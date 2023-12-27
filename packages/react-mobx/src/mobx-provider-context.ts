import React from 'react'
import { MobxMap } from './mobx-map.class'
import { type IStores } from './types'

export const MobxProviderContext = React.createContext<{ stores: IStores }>({
  stores: new MobxMap(),
})
