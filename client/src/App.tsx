import { createRef, useState } from 'react'

function App() {
    interface User {
        url: string
        name: string
        pfpUrl: string | undefined
    }
    type Users = { [key: string]: User }

    const inputRef = createRef<HTMLInputElement>()
    const [users, setUsers] = useState<Users>()

    const followers = (url: string) => {
        fetch(
            'http://localhost:3030/followers?' +
                new URLSearchParams({ url: url })
        ).then((res) => {
            res.text().then((x) => setUsers(JSON.parse(x)))
        })
    }

    return (
        <>
            <div style={{ display: 'flex' }}>
                <input
                    type="text"
                    placeholder="https://open.spotify.com/user/..."
                    ref={inputRef}
                />
            </div>
            <button
                onClick={() =>
                    inputRef.current?.value != undefined &&
                    followers(inputRef.current.value)
                }
            >
                Get Followers
            </button>
            {users !== undefined &&
                Object.keys(users).map((key) => (
                    <li>
                        <p>Name: {users[key]['name']}</p>
                        <p>
                            URL:{' '}
                            <a href={users[key]['url']}>{users[key]['url']}</a>
                        </p>
                    </li>
                ))}
        </>
    )
}

export default App
