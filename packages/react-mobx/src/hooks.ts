import React from 'react'
import { toJS } from 'mobx'
import { MobxProviderContext } from './mobx-provider-context'
import { type Type } from './mobx-map.class'

export function useStore<TInput = any, TResult = TInput>(
  typeOrToken: Type<TInput> | string | symbol,
): TResult {
  const contextValue = React.useContext(MobxProviderContext)

  if (!contextValue.stores.has(typeOrToken)) {
    throw new Error(
      `Store ${
        typeof typeOrToken === 'function' && 'name' in typeOrToken
          ? typeOrToken.name
          : String(typeOrToken)
      } is not provided`,
    )
  }

  const store = contextValue.stores.get(typeOrToken) as TResult

  const stores = Object.fromEntries(
    Array.from(contextValue.stores.entries(), ([token, instance]) => [
      typeof token === 'function' ? token.name : String(token),
      toJS(instance),
    ]),
  )

  console.log('Mobx -> useStore -> contextValue', {
    storeType: Object.getPrototypeOf(store).constructor.name,
    store: toJS(store),
    contextValue: { stores },
  })

  return store
}
