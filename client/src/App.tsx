import { createRef, useState } from 'react'

import defaultPicture from './assets/default.svg'

class User {
    url: string
    name: string
    pfpUrl: string
    relevance: string
    checked: boolean
    constructor(
        url: string,
        name: string,
        pfpUrl: string,
        relevance: string,
        checked: boolean
    ) {
        this.url = url
        this.name = name
        this.pfpUrl = pfpUrl
        this.relevance = relevance
        this.checked = checked
    }
}

const App = () => {
    const [users, setUsers] = useState<Array<User>>([])
    const inputRef = createRef<HTMLInputElement>()

    const getFollowers = (url: string) => {
        fetch(
            'http://localhost:3000/followers?' +
                new URLSearchParams({ url: url })
        ).then(async (x) => {
            let users = await x.json()
            setUsers((prevUsers) => [
                ...(prevUsers as any[]),
                ...users.filter((x: User) => !(x.url == 'error')),
            ])
        })
    }

    const getTestFollowers = () => {
        fetch('http://localhost:3000/test').then(async (x) => {
            let users = await x.json()
            setUsers((prevUsers) => [
                ...(prevUsers as any[]),
                ...users.filter((x: User) => !(x.url == 'error')),
            ])
        })
    }

    // Essentially removes duplicates from array and counts their occurrences and adds it as the relevance property
    const toRelevanceModel = (users: Array<User>) => {
        let result = users

        let counts = users
            .map((x) => x.url)
            .reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map())
        // counts.values() = occurrences
        // counts.keys() = users
        result.map((x) => (x.relevance = counts.get(x.url)))

        // this does not preserve order
        return [...new Map(result.map((x) => [x.url, x])).values()].sort(
            (a, b) => parseInt(b.relevance) - parseInt(a.relevance) // sort by relevance greatest to least
        )
    }

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
                                    : ''
                            )
                        }
                    >
                        Get Followers
                    </button>
                    <button className="" onClick={getTestFollowers}>
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
                                <li>
                                    {x.relevance} | <a href={x.url}>{x.name}</a>{' '}
                                    |{' '}
                                    <button onClick={() => getFollowers(x.url)}>
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
        </>
    )
}

export default App
