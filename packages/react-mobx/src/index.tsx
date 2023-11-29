import React, { FC, PropsWithChildren, useEffect, useState } from 'react'
import { IObjectDidChange, observe } from 'mobx'
import { Type } from './shared'
import { MobxMap } from './mobx-map.class'

export type IStores = MobxMap

export interface MobxProviderProps {
  children: React.ReactNode
  stores: IStores
}

export const MobXProviderContext = React.createContext<{ stores: IStores }>({
  stores: new MobxMap(),
})

export const MobxProvider: FC<PropsWithChildren<MobxProviderProps>> = ({ children, stores }) => {
  const [contextValue, setContextValue] = useState({ stores })

  useEffect(() => {
    const listener = (change: IObjectDidChange) => {
      console.log('MobxProvider -> observe -> listener -> change', change)
      setContextValue((value) => ({ stores: value.stores }))
    }

    const disposers = Array.from(stores.entries()).map(([, instance]) => {
      return observe(instance, listener)
    })

    return () => {
      disposers.map((dispose) => dispose())
    }
  }, [stores])

  return (
    <MobXProviderContext.Provider value={contextValue}>{children}</MobXProviderContext.Provider>
  )
}

MobxProvider.displayName = 'MobxProvider'

export const createStores = (stores: Array<Type>): IStores => {
  return new MobxMap(
    stores.map((store) => {
      return [store, new store()]
    })
  )
}

export function useStore<T extends Type>(type: T): InstanceType<T> {
  const contextValue = React.useContext(MobXProviderContext)

  console.log('Mobx -> useStore -> contextValue', contextValue)

  if (!contextValue.stores.has(type)) {
    throw new Error(`Store ${type.name} is not provided`)
  }

  return contextValue.stores.get(type)
}
