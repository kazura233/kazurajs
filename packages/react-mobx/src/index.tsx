import React, { FC, PropsWithChildren, useEffect, useState } from 'react'
import { IObjectDidChange, observe } from 'mobx'

export interface Type<T = any> extends Function {
  new (...args: any[]): T
}

export interface IStores extends Map<Type, InstanceType<Type>> {}

export interface ProviderProps {
  children: React.ReactNode
  stores: IStores
}

export const MobXProviderContext = React.createContext<{ stores: IStores }>({
  stores: new Map(),
})

export const Provider: FC<PropsWithChildren<ProviderProps>> = ({ children, stores }) => {
  const [contextValue, setContextValue] = useState({ stores })

  useEffect(() => {
    const listener = (change: IObjectDidChange) => {
      console.log('Mobx -> Provider -> observe -> listener -> change', change)
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

Provider.displayName = 'Provider'

export interface MobxProviderProps {
  children: React.ReactNode
  stores: Array<Type>
}

export const MobxProvider: FC<PropsWithChildren<MobxProviderProps>> = ({
  children,
  stores: rawStores,
}) => {
  console.log('Mobx -> MobxProvider -> render')

  const stores = new Map(
    rawStores.map((store) => {
      return [store, new store()]
    })
  )

  return <Provider stores={stores}>{children}</Provider>
}

MobxProvider.displayName = 'MobxProvider'

export function useStore<T extends Type>(type: T): InstanceType<T> {
  const contextValue = React.useContext(MobXProviderContext)

  console.log('Mobx -> useStore -> contextValue', contextValue)

  if (!contextValue.stores.has(type)) {
    throw new Error(`Store ${type.name} is not provided`)
  }

  return contextValue.stores.get(type)
}
