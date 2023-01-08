import { useEffect, useState } from 'react'
import User from './types/User'
import 'reactflow/dist/style.css'

import Config from './types/Config'
import UserView from './components/UserView'
import Controls from './components/Controls'

const App = () => {
  // Configuration Here
  const [config, setConfig] = useState<Config>({
    maxFollowers: 100,
  })

  // Set + Save users to local storage
  const [users, setUsers] = useState<Array<User>>(
    JSON.parse(localStorage.getItem('users') || '')
  )
  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users))
  }, [users])

  // Infinite scroll
  const [show, setShow] = useState<number>(20)

  return (
    <div className="min-h-screen bg-stone-900 text-white">
      <header className="flex items-center justify-center">
        <h1 className="p-4 text-4xl font-extrabold lowercase">
          <i className="font-black text-green-500">Spotify</i>
          Detective
        </h1>
      </header>
      <Controls users={users} setUsers={setUsers} config={config} show={show} />
      <main>
        <UserView
          users={users}
          setUsers={setUsers}
          config={config}
          show={show}
          setShow={setShow}
        />
      </main>
    </div>
  )
}

export default App
