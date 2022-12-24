import { createRef, useState } from 'react'
import User from './types/User'

/*

! ISSUES TO FIX

For some reason it is not checking people when multi, maybe check first
Nevermind its fixed! Solution: there was no system in place to
remove duplicates while preferring the duplicate with the true value
in the toRelevanceModel function. i never made one because the getFollowers
function made it so there were never any duplicates with varying 
checked values.

*/

import {
    getFollowers,
    getFollowersMulti,
    getTestFollowers,
    toRelevanceModel,
} from './utils/followers'

const App = () => {
    const [users, setUsers] = useState<Array<User>>([])

    const inputRef = createRef<HTMLInputElement>()
    const timesRef = createRef<HTMLInputElement>()

    const automate = async (times: number) => {
        for (let i = 0; i < times; i++) {
            console.log(`Job ${i}`)
            await getFollowersMulti(users, setUsers)
            console.log(`Job ${i} done`)
        }
    }

    return (
        <div className="flex flex-col">
            <header className="bg-stone-900 text-white p-5">
                <h1 className="text-5xl font-semibold">
                    <i className="text-green-500 font-black">Spotify</i>
                    Detective
                </h1>
            </header>
            <div className="bg-stone-800 text-white flex-1">
                <main className="flex">
                    <article className="p-5 w-2/6">
                        <h1 className="text-4xl">Use the app</h1>
                        <p className="text-xl">
                            Spotify Detective needs a starting point to search
                            from. Enter a profile URL into the input box and
                            press the Get Followers button. A list of people
                            that follow the user you entered will appear. From
                            there, you can click get followers on those users to
                            grow your list. The relevance of a user shows how
                            shows how closely related they are to the starting
                            profile.
                        </p>
                    </article>
                    <div className="p-5 flex-1 flex bg-stone-100 text-black h-screen gap-2">
                        <div className="flex flex-col gap-2">
                            <fieldset className="bg-white rounded-md p-2 flex flex-col gap-2 shadow-lg">
                                <label className="flex flex-col">
                                    Controls
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        placeholder="open.spotify.com/user/<id>"
                                        className="border-stone-500 border-solid border-[1px] rounded-md shadow-inner shadow-stone-300 p-2"
                                    />
                                </label>
                                <button
                                    className="w-full flex-1 border-stone-500 border-solid border-[1px] rounded-md shadow-inner shadow-stone-300 disabled:text-stone-200"
                                    onClick={() =>
                                        getFollowers(
                                            inputRef.current != null
                                                ? inputRef.current.value
                                                : '',
                                            users,
                                            setUsers
                                        )
                                    }
                                    disabled={users.length > 0}
                                >
                                    Get Followers
                                </button>
                                <button
                                    className="w-full flex-1 border-stone-500 border-solid border-[1px] rounded-md shadow-inner shadow-stone-300"
                                    onClick={() => getTestFollowers(setUsers)}
                                >
                                    Get Test Data
                                </button>
                                <button
                                    className="w-full flex-1 border-stone-500 border-solid border-[1px] rounded-md shadow-inner shadow-stone-300"
                                    onClick={() => setUsers([])}
                                >
                                    Clear
                                </button>
                            </fieldset>
                            <fieldset className="bg-white rounded-md p-2 flex flex-col gap-2 shadow-lg">
                                <label className="flex flex-col">
                                    Automate
                                    <input
                                        type="number"
                                        min="1"
                                        max="10"
                                        ref={timesRef}
                                        className="border-stone-500 border-solid border-[1px] rounded-md shadow-inner shadow-stone-300 p-2"
                                    />
                                </label>
                                <button
                                    className="w-full flex-1 border-stone-500 border-solid border-[1px] rounded-md shadow-inner shadow-stone-300 disabled:text-stone-200"
                                    onClick={() =>
                                        automate(
                                            timesRef.current != null
                                                ? parseInt(
                                                      timesRef.current.value
                                                  )
                                                : 0
                                        )
                                    }
                                >
                                    Start
                                </button>
                                <p className="text-sm">
                                    Warning: This might take a long time!
                                </p>
                            </fieldset>
                        </div>

                        <ul className="bg-white rounded-md p-2 shadow-lg flex-1 grid grid-cols-4 grid-flow-row gap-2 overflow-scroll">
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
                                <h1 className="text-4xl w-full h-full flex justify-center items-center col-span-full">
                                    Press Get Followers to get started
                                </h1>
                            )}
                        </ul>
                    </div>
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
    setUsers: (value: React.SetStateAction<User[]>) => void
    name: string
    url: string
    relevance: string
    checked: boolean
    pfp?: string
}) => {
    return (
        <li
            className="w-full h-full bg-stone-100 border-[1px] border-stone-200 shadow-inner border-solid rounded-md p-2"
            key={url}
        >
            <figure className="flex flex-col">
                <h1 className="text-2xl">
                    <a href={url} target="_blank">
                        {name}
                    </a>
                </h1>
                <h2 className="text-xl">Relevance: {relevance}</h2>
                <button
                    className="bg-stone-100 border-[1px] border-stone-200 shadow-inner border-solid rounded-md py-4 disabled:text-stone-200"
                    disabled={checked}
                    onClick={() => getFollowers(url, users, setUsers)}
                >
                    Get Followers
                </button>
            </figure>
        </li>
    )
}

export default App
