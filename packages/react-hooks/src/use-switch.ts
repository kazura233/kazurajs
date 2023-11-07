import { useMemo, useState } from 'react'

export const useSwitch = (defaultValue: boolean = false) => {
  const [state, setState] = useState(defaultValue)

  const actions = useMemo(
    () =>
      ({
        on: () => setState(true),
        off: () => setState(false),
        toggle: () => setState((s) => !s),
      } as const),
    []
  )

  return [state, actions] as const
}
