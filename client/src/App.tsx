import { createRef, useEffect, useLayoutEffect, useState } from 'react'
import User from './types/User'
import 'reactflow/dist/style.css'

import { getFollowers, getTestFollowers } from './utils/followers'
import Config from './types/Config'

const App = () => {
  const [show, setShow] = useState<number>(20)
  const onScroll = () => {
    const scrollTop = document.documentElement.scrollTop
    const scrollHeight = document.documentElement.scrollHeight
    const clientHeight = document.documentElement.clientHeight

    if (scrollTop + clientHeight >= scrollHeight) {
      setShow((prev) => prev + 10)
    }
  }
  useEffect(() => {
    window.addEventListener('scroll', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  })
  const [users, setUsers] = useState<Array<User>>(
    JSON.parse(localStorage.getItem('users') || '')
  )

  const [searchName, setSearchName] = useState<string>('')

  const nameRef = createRef<HTMLInputElement>()
  const urlRef = createRef<HTMLInputElement>()
  const timesRef = createRef<HTMLInputElement>()

  const [config, setConfig] = useState<Config>({
    // CONFIG HERE
    maxFollowers: 100,
  })

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
      newUsers = await getFollowers(newUsers, config)
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
        <form className="flex gap-2 p-2 " action="#">
          <input
            type="number"
            min="1"
            max="10"
            ref={timesRef}
            className="border border-solid border-stone-400 bg-transparent"
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
        <table className="w-screen table-fixed border-separate border-spacing-2">
          <thead>
            <tr className="lowercase">
              <th className="border border-solid border-stone-800 bg-stone-800 px-2 text-xl font-normal"></th>
              <th className="border border-solid border-stone-700 px-2 text-xl font-normal">
                Name
                <input
                  type="text"
                  placeholder="Search"
                  className="text-black"
                  onChange={(e) => setSearchName(e.currentTarget.value)}
                />
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
            <tr className="col-span-5">
              <td className="border border-solid border-stone-700 px-2 text-xl font-normal"></td>
              <td className="flex gap-2 border border-solid border-stone-700 p-2 text-xl font-normal">
                <form className="flex flex-col gap-2">
                  <input
                    type="text"
                    placeholder="Name here"
                    className="border border-solid border-stone-700 bg-transparent p-1"
                    ref={nameRef}
                  />
                  <input
                    type="url"
                    placeholder="URL here"
                    className="border border-solid border-stone-700 bg-transparent p-1"
                    ref={urlRef}
                  />
                </form>
                <button
                  className="flex flex-1 items-center justify-center border border-solid border-stone-700"
                  onClick={() =>
                    !users.find(
                      (x) =>
                        x.url == urlRef.current?.value ||
                        x.name == nameRef.current?.value
                    ) &&
                    setUsers((prev) => [
                      ...prev,
                      new User(
                        urlRef.current?.value || '',
                        nameRef.current?.value || '',
                        '',
                        '0',
                        [],
                        false
                      ),
                    ])
                  }
                >
                  <i className="bi-plus-square"></i>
                </button>
              </td>
              <td className="border border-solid border-stone-700 px-2 text-xl font-normal"></td>
              <td className="border border-solid border-stone-700 px-2 text-xl font-normal"></td>
              <td className="border border-solid border-stone-700 px-2 text-xl font-normal"></td>
            </tr>
            {users
              .filter((n) => n.name.includes(searchName))
              .slice(0, show)
              .map((x) => (
                <tr>
                  <td className="flex items-center justify-center border border-solid border-stone-700 py-2">
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
                  </td>
                  <td className="border border-solid border-stone-700 px-2 text-xl font-normal">
                    <a href={x.url} className="h-10 w-10">
                      {x.name}
                    </a>
                  </td>
                  <td className="border border-solid border-stone-700 px-2 text-xl font-normal">
                    {x.relevance}
                  </td>
                  <td className="overflow-x-scroll border border-solid border-stone-700 px-2 text-xl font-normal">
                    <ul className="flex items-center gap-2">
                      {x.parent.length != 0 ? (
                        x.parent.map((x, i, arr) => (
                          <li key={x} className="min-w-fit">
                            <a href={x}>
                              {users.find((i) => i.url == x)?.name || x}
                            </a>
                            {i == arr.length - 1 ? '' : ','}
                          </li>
                        ))
                      ) : (
                        <span className="flex h-full w-full items-center justify-center text-stone-500">
                          <i className="bi-question-octagon text-xl"></i>
                        </span>
                      )}
                    </ul>
                  </td>
                  <td className="border border-solid border-stone-700 text-xl text-green-300">
                    <div className="flex">
                      <button
                        onClick={async () =>
                          setUsers(await getFollowers(users, config, x.url))
                        }
                        className="flex-1 disabled:opacity-10"
                        disabled={x.checked}
                      >
                        Get Followers
                      </button>
                      <button
                        onClick={async () =>
                          setUsers((prev) =>
                            prev.filter((user) => user.url != x.url)
                          )
                        }
                        className="flex-1 text-red-300 disabled:opacity-10"
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </main>
    </div>
  )
}

const UserDisplay = ({
  user,
  users,
  setUsers,
  config,
}: {
  user: User
  users: Array<User>
  setUsers: (array: React.SetStateAction<User[]>) => void
  config: any
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
          <li key={x}>
            <a href={x}>{x}</a>
          </li>
        ))}
      </ul>
      <button
        disabled={user.checked}
        onClick={async () =>
          setUsers(await getFollowers(users, config, user.url))
        }
      >
        Get Followers
      </button>
    </li>
  )
}

export default App
