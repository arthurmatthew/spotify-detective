import { createRef, useState } from 'react'
import User from './types/User'

import {
  getFollowers,
  getTestFollowers,
  toRelevanceModel,
} from './utils/followers'

const App = () => {
  const [users, setUsers] = useState<Array<User>>([])

  const inputRef = createRef<HTMLInputElement>()
  const timesRef = createRef<HTMLInputElement>()

  /**
   * Gets the followers of every user currently in the state x amount of times
   * @param {number} times - Amount of times to loop
   */
  const automate = async (times: number) => {
    let newUsers: Array<User> = users
    for (let i = 0; i < times; i++) {
      console.log(`Job ${i}`)
      newUsers = await getFollowers(newUsers)
      console.log(`Job ${i} done`)
    }
    setUsers(newUsers)
  }

  return (
    <div>
      <header className="flex justify-center items-center">
        <h1 className="text-5xl p-4 lowercase font-black">
          <i className="text-green-500">Spotify</i>
          Detective
        </h1>
      </header>
      <div>
        <main>
          <fieldset className="flex gap-2">
            <label>
              Enter Profile URL
              <input
                ref={inputRef}
                type="text"
                placeholder="open.spotify.com/user/<id>"
              />
            </label>
            <button
              onClick={async () =>
                setUsers(
                  await getFollowers(
                    users,
                    inputRef.current != null ? inputRef.current.value : ''
                  )
                )
              }
              disabled={users.length > 0}
            >
              Get Followers
            </button>
            <button onClick={async () => setUsers(await getTestFollowers())}>
              Get Test Data
            </button>
            <button onClick={() => setUsers([])}>Clear</button>
          </fieldset>
          <fieldset>
            <label>
              Automate
              <input type="number" min="1" max="10" ref={timesRef} />
            </label>
            <button
              onClick={() =>
                automate(
                  timesRef.current != null
                    ? parseInt(timesRef.current.value)
                    : 0
                )
              }
            >
              Start
            </button>
            <p>Warning: This might take a long time!</p>
          </fieldset>

          <ul className="flex flex-col gap-2">
            {users.length > 0 ? (
              toRelevanceModel(users).map((x) => (
                <UserDisplay
                  name={x.name}
                  url={x.url}
                  relevance={x.relevance}
                  checked={x.checked}
                  setUsers={setUsers}
                  users={users}
                />
              ))
            ) : (
              <h1>Press Get Followers to get started</h1>
            )}
          </ul>
        </main>
      </div>
    </div>
  )
}

const UserDisplay = ({
  users,
  setUsers,
  name,
  url,
  relevance,
  checked,
  pfp,
}: {
  users: Array<User>
  setUsers: (array: React.SetStateAction<User[]>) => void
  name: string
  url: string
  relevance: string
  checked: boolean
  pfp?: string
}) => {
  return (
    <li key={url} className="flex gap-2 bg-stone-100 w-fit py-2 px-3">
      <h1>
        <a href={url} target="_blank">
          {name}
        </a>
      </h1>
      <h2>Relevance: {relevance}</h2>
      <button
        disabled={checked}
        onClick={async () => setUsers(await getFollowers(users, url))}
      >
        Get Followers
      </button>
    </li>
  )
}

export default App
