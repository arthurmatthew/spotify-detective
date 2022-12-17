import { createRef, MouseEventHandler, useState } from 'react'
import './App.css'

class User {
    url: string
    name: string
    pfpUrl?: string | undefined
    children: Array<User> | undefined
    constructor(
        url: string,
        name: string,
        children: Array<User> | undefined,
        pfpUrl?: string | undefined
    ) {
        this.url = url
        this.name = name
        this.children = children
        this.pfpUrl = pfpUrl
    }
    updateChildren(): void {
        fetch('/followers?' + new URLSearchParams({ url: this.url })).then(
            (res) => {
                res.text().then((x: string) => {
                    // let arr: Array<User> = Object.values(JSON.parse(x))
                    // this.children = arr
                    this.children = [
                        new User('asd', 'asd', []),
                        new User('asd', 'asd', []),
                    ]
                })
            }
        )
    }
}

let testData: Array<User> = [
    new User('https://open.spotify.com/start', 'start', [
        new User('https://open.spotify.com/a', 'a', [
            new User('https://open.spotify.com/aa', 'aa', []),
            new User('https://open.spotify.com/bb', 'bb', []),
        ]),
        new User('https://open.spotify.com/b', 'b', []),
        new User('https://open.spotify.com/c', 'c', []),
    ]),
]

const App = () => {
    const inputRef = createRef<HTMLInputElement>()
    const [users, setUsers] = useState<Array<User>>(testData)

    /*
    Example Data
    {
    [
    {"url":"https://open.spotify.com/user/x","name":"Bob","children":{}},
    {"url":"https://open.spotify.com/user/x","name":"Walter","children":{}},
    {"url":"https://open.spotify.com/user/x","name":"Gustavo","children":{}},
    {"url":"https://open.spotify.com/user/x","name":"Bryan","children":{}}
    ]
    */

    return (
        <div id="page">
            <header>
                <h1>Spotify Detective</h1>
            </header>
            <main>
                <section id="frame">
                    <List users={users} />
                </section>
            </main>
            <footer>
                <input
                    type="text"
                    placeholder="https://open.spotify.com/user/..."
                    ref={inputRef}
                />
                <button
                // onClick={() =>
                //     inputRef.current?.value != undefined &&
                //     updateFollowers(inputRef.current.value)
                // }
                >
                    Start
                </button>
            </footer>
        </div>
    )
}

const List = ({ users }: { users: Array<User> | undefined }) => {
    const [children, setChildren] = useState()

    return (
        <ul>
            {users?.map((user) => (
                <li key={user.name}>
                    <div>
                        {user.name}
                        <button>+</button>
                    </div>
                    {user.children && <List users={user.children} />}
                </li>
            ))}
        </ul>
    )
}

export default App
