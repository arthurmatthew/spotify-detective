import { createRef, useState } from 'react'

class User {
    url: string
    name: string
    pfpUrl: string
    relevance: string
    constructor(url: string, name: string, pfpUrl: string, relevance: string) {
        this.url = url
        this.name = name
        this.pfpUrl = pfpUrl
        this.relevance = relevance
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
            setUsers((prevUsers) => [...(prevUsers as any[]), ...users])
        })
    }

    const getTestFollowers = () => {
        fetch('http://localhost:3000/test').then(async (x) => {
            let users = await x.json()
            setUsers((prevUsers) => [...(prevUsers as any[]), ...users])
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
        return [...new Map(result.map((x) => [x.url, x])).values()]
    }

    return (
        <div>
            <input type="text" ref={inputRef} />
            <button
                onClick={() =>
                    getFollowers(
                        inputRef.current != null ? inputRef.current.value : ''
                    )
                }
            >
                Get Followers
            </button>
            <button onClick={getTestFollowers}>Test</button>
            <p>{JSON.stringify(toRelevanceModel(users))}</p>
        </div>
    )
}

export default App
