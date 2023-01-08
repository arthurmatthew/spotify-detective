import { createRef, useEffect, useState } from 'react'
import Config from '../types/Config'
import User from '../types/User'
import { getFollowers } from '../utils/followers'

const UserView = ({
  users,
  setUsers,
  config,
}: {
  users: User[]
  setUsers: (array: React.SetStateAction<User[]>) => void
  config: Config
}) => {
  const [searchName, setSearchName] = useState<string>('')
  const [show, setShow] = useState<number>(20)

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
      setShow((prev) => prev + 10)
    }
  }

  return (
    <table className="w-screen table-fixed border-separate border-spacing-2">
      <thead>
        <tr className="lowercase">
          <th className="border border-solid border-stone-800 bg-stone-800 px-2 text-xl font-normal"></th>
          <th className="flex items-center justify-center border border-solid border-stone-700 px-2 text-xl font-normal">
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
  )
}

export default UserView
