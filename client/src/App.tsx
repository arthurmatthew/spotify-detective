import { createRef, useEffect, useState } from 'react'

import User from './types/User'
import {
    getTestFollowers,
    getFollowers,
    toRelevanceModel,
} from './utils/followers'

const App = () => {
    const [users, setUsers] = useState<Array<User>>([])
    const inputRef = createRef<HTMLInputElement>()

    return (
        <>
            <header className="">
                <article>
                    <h1 className="text-5xl">Spotify Detective</h1>
                </article>
            </header>
            <main>
                <section id="controls" className="">
                    <div id="text">
                        <label>
                            Enter a profile URL
                            <input type="text" ref={inputRef} />
                        </label>
                    </div>
                    <button
                        className=""
                        onClick={() =>
                            getFollowers(
                                inputRef.current != null
                                    ? inputRef.current.value
                                    : '',
                                users,
                                setUsers
                            )
                        }
                    >
                        Get Followers
                    </button>
                    <button
                        className=""
                        onClick={() => getTestFollowers(setUsers)}
                    >
                        Test
                    </button>
                    <button className="" onClick={() => setUsers([])}>
                        Clear
                    </button>
                </section>
                <section id="result" className="">
                    <h4>People you might know:</h4>
                    {users.length > 0 ? (
                        <ol>
                            {toRelevanceModel(users).map((x) => (
                                <li key={x.url}>
                                    {x.relevance} | <a href={x.url}>{x.name}</a>{' '}
                                    |{' '}
                                    <button
                                        onClick={() =>
                                            getFollowers(x.url, users, setUsers)
                                        }
                                        disabled={x.checked}
                                    >
                                        Check
                                    </button>
                                </li>
                            ))}
                        </ol>
                    ) : (
                        <p>Enter a profile URL above to get started.</p>
                    )}
                </section>
            </main>
            <p>{JSON.stringify(users)}</p>
        </>
    )
}

export default App
