import React from 'react'
import { MobxProviderContext } from './mobx-provider-context'
import { type Type } from './mobx-map.class'

export function useStore<T extends Type>(type: T): InstanceType<T> {
  const contextValue = React.useContext(MobxProviderContext)

  if (!contextValue.stores.has(type)) {
    throw new Error(`Store ${type.name} is not provided`)
  }

  const store = contextValue.stores.get(type)

  console.log(
    'Mobx -> useStore -> contextValue',
    Object.getPrototypeOf(store).constructor.name,
    store,
    contextValue
  )

  return store
}
