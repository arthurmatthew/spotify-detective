import { createRef, MouseEventHandler, ReactNode } from 'react'
import Config from '../types/Config'
import User from '../types/User'
import { getFollowers, getTestFollowers } from '../utils/followers'

const Controls = ({
  users,
  setUsers,
  show,
  config,
}: {
  users: User[]
  setUsers: (array: React.SetStateAction<User[]>) => void
  show: number
  config: Config
}) => {
  const timesRef = createRef<HTMLInputElement>()

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

  return (
    <section className="flex h-12 items-center gap-2 border-b border-t border-solid border-stone-800">
      <form className="flex gap-2 p-2 " action="#">
        <input
          type="number"
          min="1"
          max="10"
          ref={timesRef}
          className="border border-solid border-stone-400 bg-transparent"
        />
        <Button
          onClick={() =>
            automate(
              timesRef.current != null ? parseInt(timesRef.current.value) : 0
            )
          }
        >
          Automate
        </Button>
      </form>
      <Divider />
      <form className="flex gap-2 p-2" action="#">
        <Button onClick={async () => setUsers(await getTestFollowers())}>
          Test Data
        </Button>
        <Button onClick={() => setUsers([])}>Clear</Button>
      </form>
      <Divider />
      <article>
        <p>
          {users.length} users, showing {show}
        </p>
      </article>
    </section>
  )
}

const Divider = () => {
  return (
    <div className="h-5/6 w-[1px] bg-gradient-to-t from-transparent via-stone-700 to-transparent"></div>
  )
}

const Button = ({
  children,
  onClick,
}: {
  children: ReactNode
  onClick: MouseEventHandler<HTMLButtonElement>
}) => {
  return (
    <button
      className="border border-solid border-stone-400 px-2"
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Controls
