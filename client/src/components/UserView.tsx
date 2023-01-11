import { createRef, useEffect, useState } from 'react'
import Config from '../types/Config'
import User from '../types/User'
import { getFollowers } from '../utils/followers'

const UserView = ({
  users,
  setUsers,
  show,
  setShow,
  config,
}: {
  users: User[]
  setUsers: (array: React.SetStateAction<User[]>) => void
  show: number
  setShow: (number: React.SetStateAction<number>) => void
  config: Config
}) => {
  const [searchName, setSearchName] = useState<string>('')

  const nameRef = createRef<HTMLInputElement>()
  const urlRef = createRef<HTMLInputElement>()

  useEffect(() => {
    window.addEventListener('scroll', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  })

  const onScroll = () => {
    const scrollTop = document.documentElement.scrollTop
    const scrollHeight = document.documentElement.scrollHeight
    const clientHeight = document.documentElement.clientHeight

    if (scrollTop + clientHeight >= scrollHeight) {
      show < users.length ? setShow((prev) => prev + 10) : setShow(users.length)
    }
  }

  return (
    <table className="w-screen table-fixed">
      <thead>
        <tr>
          <td className="px-2 text-xl font-normal"></td>
          <td className="flex gap-2 p-2 text-xl font-normal">
            <form className="flex w-1/2 flex-col gap-2">
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
          <td className="px-2 text-xl font-normal"></td>
          <td className="px-2 text-xl font-normal"></td>
          <td className="px-2 text-xl font-normal"></td>
        </tr>
        <tr className="lowercase">
          <th className="px-2 text-xl font-normal"></th>
          <th className="flex items-center justify-center px-2 text-xl font-normal">
            <input
              type="text"
              placeholder="name"
              className="bg-transparent text-center placeholder:text-white"
              onChange={(e) => setSearchName(e.currentTarget.value)}
            />
            <i
              className="bi-search flex items-center text-xs"
              title="Type inside the textbox to the left to search."
            ></i>
          </th>
          <th className="px-2 text-xl font-normal">Relevance</th>
          <th className="px-2 text-xl font-normal">Follower Of</th>
          <th className="px-2 text-xl font-normal"></th>
        </tr>
      </thead>
      <tbody>
        {users.length != 0 ? (
          users
            .filter((n) => n.name.includes(searchName))
            .slice(0, show)
            .map((x) => (
              <tr className="border-b border-solid border-stone-700 last:border-0">
                <td className="flex items-center justify-end py-2">
                  <div className="h-10 w-10 overflow-hidden rounded-full">
                    {x.pfpUrl ? (
                      <img
                        src={x.pfpUrl}
                        className="flex aspect-square h-full items-center justify-center"
                      />
                    ) : (
                      <span className="flex h-full items-center justify-center bg-black text-stone-500">
                        <i className="bi-question-octagon text-xl"></i>
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-2 text-xl font-normal">
                  <a href={x.url} className="h-10 w-10">
                    {x.name}
                  </a>
                </td>
                <td className="px-2 text-xl font-normal">{x.relevance}</td>
                <td className="overflow-x-scroll px-2 text-xl font-normal">
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
                      <span className="flex h-full w-full items-center text-stone-500">
                        <i className="bi-question-octagon text-xl"></i>
                      </span>
                    )}
                  </ul>
                </td>
                <td className="text-xl text-green-300">
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
            ))
        ) : (
          <>
            <td></td>
            <td>
              <h3 className="text-center">
                Add a user in the box above to start.
              </h3>
            </td>
          </>
        )}
      </tbody>
    </table>
  )
}

export default UserView
