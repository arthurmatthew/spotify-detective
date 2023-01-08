import { createRef, useEffect, useLayoutEffect, useState } from 'react'
import User from './types/User'
import 'reactflow/dist/style.css'

import { getFollowers, getTestFollowers } from './utils/followers'

const App = () => {
  const [users, setUsers] = useState<Array<User>>(
    JSON.parse(localStorage.getItem('users') || '')
  )

  const inputRef = createRef<HTMLInputElement>()
  const timesRef = createRef<HTMLInputElement>()

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users))
  }, [users])

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

  /*
  controls:
  profile url text input
  get followers
  
  get test data
  clear

  automate with number input
  start button
  */

  return (
    <div className="min-h-screen bg-stone-900 text-white">
      <header className="flex items-center justify-center">
        <h1 className="p-4 text-4xl font-extrabold lowercase">
          <i className="font-black text-green-500">Spotify</i>
          Detective
        </h1>
      </header>
      <section className="flex h-12 items-center gap-2 border-b border-t border-solid border-stone-800">
        <form className="flex gap-2 p-2" action="#">
          <input
            type="text"
            ref={inputRef}
            placeholder="open.spotify.com/user/<id>"
            className="bg-stone-900"
          />
          <button
            className="border border-solid border-stone-400 px-2"
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
        </form>
        <div className="h-5/6 w-[1px] bg-gradient-to-t from-transparent via-stone-700 to-transparent"></div>
        <form className="flex gap-2 p-2 " action="#">
          <input
            type="number"
            min="1"
            max="10"
            ref={timesRef}
            className="bg-stone-900"
          />
          <button
            className="border border-solid border-stone-400 px-2"
            onClick={() =>
              automate(
                timesRef.current != null ? parseInt(timesRef.current.value) : 0
              )
            }
          >
            Automate
          </button>
        </form>
        <div className="h-5/6 w-[1px] bg-gradient-to-t from-transparent via-stone-700 to-transparent"></div>
        <form className="flex gap-2 p-2" action="#">
          <button
            className="border border-solid border-stone-400 px-2"
            onClick={async () => setUsers(await getTestFollowers())}
          >
            Test Data
          </button>
          <button className=" bg-green-900 px-2" onClick={() => setUsers([])}>
            Clear
          </button>
        </form>
      </section>
      <main>
        {users.length == 0 ? (
          <h1 className="p-4 text-center text-3xl text-stone-300">
            Fetch data to get started.
          </h1>
        ) : (
          <table className="w-screen table-fixed border-separate border-spacing-2">
            <thead>
              <tr className="lowercase">
                <th className="border border-solid border-stone-800 bg-stone-800 px-2 text-xl font-normal"></th>
                <th className="border border-solid border-stone-700 px-2 text-xl font-normal">
                  Name
                </th>
                <th className="border border-solid border-stone-700 px-2 text-xl font-normal">
                  Relevance
                </th>
                <th className="border border-solid border-stone-700 px-2 text-xl font-normal">
                  Follower Of
                </th>
                <th className="border border-solid border-stone-800 bg-stone-800 px-2 text-xl font-normal"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((x) => (
                <tr>
                  <th className="flex items-center justify-center border border-solid border-stone-700 py-2">
                    <div className="h-10 w-10 overflow-hidden rounded-full">
                      {x.pfpUrl ? (
                        <img
                          src={x.pfpUrl}
                          className="flex aspect-square h-full items-center justify-center"
                        />
                      ) : (
                        <span className="flex h-full items-center justify-center text-stone-500">
                          <i className="bi-question-octagon text-xl"></i>
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="border border-solid border-stone-700 px-2 text-xl font-normal">
                    <a href={x.url} className="underline">
                      {x.name}
                    </a>
                  </th>
                  <th className="border border-solid border-stone-700 px-2 text-xl font-normal">
                    {x.relevance}
                  </th>
                  <th className="border border-solid border-stone-700 px-2 text-xl font-normal underline">
                    {x.parent.length != 0 ? (
                      x.parent.length == 1 ? (
                        <a href={x.parent[0].url}>{x.parent[0].name}</a>
                      ) : (
                        <CollapseList users={x.parent} />
                      )
                    ) : (
                      'Nobody'
                    )}
                  </th>
                  <th className="text-xl font-normal">
                    <button
                      disabled={x.checked}
                      className="rounded-sm bg-stone-800 p-2 px-6 text-green-600 disabled:text-stone-700"
                    >
                      get followers
                    </button>
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  )
}

const CollapseList = ({
  users,
}: {
  users: { name: string; url: string }[]
}) => {
  const [collapsed, setCollapsed] = useState(true)

  return (
    <ul>
      {collapsed ? (
        <i
          className="bi-caret-right-fill text-sm text-black"
          onClick={() => setCollapsed((prev) => !prev)}
        ></i>
      ) : (
        <>
          <i
            className="bi-caret-down-fill text-sm text-black"
            onClick={() => setCollapsed((prev) => !prev)}
          ></i>
          {users.map((x) => (
            <li key={x.url}>
              <a href={x.url}>{x.name}</a>
            </li>
          ))}
        </>
      )}
    </ul>
  )
}

const UserDisplay = ({
  user,
  users,
  setUsers,
}: {
  user: User
  users: Array<User>
  setUsers: (array: React.SetStateAction<User[]>) => void
}) => {
  return (
    <li key={user.url} className="flex w-fit gap-2 bg-stone-100 py-2 px-3">
      <h1>
        <a href={user.url} target="_blank">
          {user.name}
        </a>
      </h1>
      <h2>Relevance: {user.relevance}</h2>
      <ul>
        <h3>Follower Of:</h3>
        {user.parent.map((x) => (
          <li key={x.url}>
            <a href={x.url}>{x.name}</a>
          </li>
        ))}
      </ul>
      <button
        disabled={user.checked}
        onClick={async () => setUsers(await getFollowers(users, user.url))}
      >
        Get Followers
      </button>
    </li>
  )
}

export default App
