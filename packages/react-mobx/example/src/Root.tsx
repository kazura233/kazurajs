import { useState } from 'react'
import { DemoStore } from './stores/demo-store'
import { useStore } from '@kazura/react-mobx'

export const Root: React.FC = () => {
  const demoStore = useStore(DemoStore)

  const [value, setValue] = useState(0)
  const [item, setItem] = useState('')
  const [name, setName] = useState(demoStore.profile.name)
  const [age, setAge] = useState(demoStore.profile.age)

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
      <hr />
      <h3>Array</h3>
      <p>items: {JSON.stringify(demoStore.items)}</p>
      <p>
        <input
          value={item}
          placeholder="item"
          onChange={(event) => setItem(event.currentTarget.value)}
        />
        <button
          onClick={() => {
            demoStore.addItem(item)
            setItem('')
          }}
        >
          add item
        </button>
        <button onClick={() => demoStore.removeLastItem()}>remove last</button>
      </p>
      <h3>Object</h3>
      <p>profile: {JSON.stringify(demoStore.profile)}</p>
      <p>
        <input value={name} onChange={(event) => setName(event.currentTarget.value)} />
        <input
          type="number"
          value={age}
          onChange={(event) => setAge(Number(event.currentTarget.value) || 0)}
          style={{ width: 60 }}
        />
        <button onClick={() => demoStore.updateProfile(name, age)}>update profile</button>
      </p>
    </div>
  )
}
