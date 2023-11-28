import { useState } from 'react'
import { DemoStore } from './stores/demo-store'
import { useStore } from '@kazura/react-mobx'

export const Root: React.FC = () => {
  const demoStore = useStore(DemoStore)

  const [value, setValue] = useState(0)

  return (
    <div>
      <p>react-mbox-example</p>
      <p>num: {demoStore.num}</p>
      <p>
        <button onClick={() => demoStore.increment()}>increment</button>
      </p>
      <p>
        <button onClick={() => demoStore.decrement()}>decrement</button>
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
        <button onClick={() => demoStore.incrementByAmount(value)}>incrementByAmount</button>
        <button onClick={() => demoStore.set(value)}>set</button>
      </p>
    </div>
  )
}
