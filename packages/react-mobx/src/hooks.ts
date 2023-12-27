import React from 'react'
import { MobxProviderContext } from './mobx-provider-context'
import { type Type } from './mobx-map.class'

export function useStore<T extends Type>(type: T): InstanceType<T> {
  const contextValue = React.useContext(MobxProviderContext)

  console.log(
    'Mobx -> useStore -> contextValue',
    Object.prototype.toString.call(type),
    type,
    contextValue
  )

  if (!contextValue.stores.has(type)) {
    throw new Error(`Store ${type.name} is not provided`)
  }

  return contextValue.stores.get(type)
}
