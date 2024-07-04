import React from 'react'
import { MobxProviderContext } from './mobx-provider-context'
import { type Type } from './mobx-map.class'

export function useStore<TInput = any, TResult = TInput>(
  typeOrToken: Type<TInput> | string | symbol
): TResult {
  const contextValue = React.useContext(MobxProviderContext)

  if (!contextValue.stores.has(typeOrToken)) {
    throw new Error(
      `Store ${
        typeof typeOrToken === 'function' && 'name' in typeOrToken
          ? typeOrToken.name
          : String(typeOrToken)
      } is not provided`
    )
  }

  const store = contextValue.stores.get(typeOrToken) as TResult

  console.log(
    'Mobx -> useStore -> contextValue',
    Object.getPrototypeOf(store).constructor.name,
    store,
    contextValue
  )

  return store
}
