import { demoActions, demoGetters } from './stores'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

export const Root: React.FC = () => {
  const num = useSelector(demoGetters.numGetter())
  const dispatch = useDispatch()

  const [value, setValue] = useState(0)

  return (
    <div>
      <p>react-store-example</p>
      <p>num: {num}</p>
      <p>
        <button onClick={() => dispatch(demoActions.increment())}>increment</button>
      </p>
      <p>
        <button onClick={() => dispatch(demoActions.decrement())}>decrement</button>
      </p>
      <p>
        <input
          type="number"
          value={value}
          onChange={(event) => {
            const int = parseInt(event.currentTarget.value)
            setValue(isNaN(int) ? 0 : int)
          }}
          style={{ width: 150 }}
        />
        <button onClick={() => dispatch(demoActions.incrementByAmount(value))}>
          incrementByAmount
        </button>
        <button onClick={() => dispatch(demoActions.set(value))}>set</button>
      </p>
    </div>
  )
}
