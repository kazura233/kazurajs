import React from 'react'
import { MobxProviderContext } from './mobx-provider-context'
import { type IObjectDidChange, observe } from 'mobx'
import { type MobxProviderProps } from './types'

export const MobxProvider: React.FC<React.PropsWithChildren<MobxProviderProps>> = ({
  children,
  stores,
}) => {
  const [contextValue, setContextValue] = React.useState({ stores })

  React.useLayoutEffect(() => {
    const listener = (change: IObjectDidChange) => {
      console.log('MobxProvider -> observe -> listener -> change', change)
      setContextValue({ stores })
    }

    const disposers = Array.from(stores.entries()).map(([, instance]) => {
      return observe(instance, listener)
    })

    return () => {
      disposers.map((dispose) => dispose())
    }
  }, [stores])

  return (
    <MobxProviderContext.Provider value={contextValue}>{children}</MobxProviderContext.Provider>
  )
}

MobxProvider.displayName = 'MobxProvider'

export const MobxInactiveProvider: React.FC<React.PropsWithChildren<MobxProviderProps>> = ({
  children,
  stores,
}) => {
  const [contextValue, setContextValue] = React.useState({ stores })

  React.useLayoutEffect(() => {
    setContextValue({ stores })
  }, [stores])

  return (
    <MobxProviderContext.Provider value={contextValue}>{children}</MobxProviderContext.Provider>
  )
}

MobxInactiveProvider.displayName = 'MobxInactiveProvider'
