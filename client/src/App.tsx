import { createRef, useState } from 'react'

class User {
    url: string
    name: string
    children: Array<User>
    pfpUrl: string
    constructor(
        url: string,
        name: string,
        children: Array<User>,
        pfpUrl: string
    ) {
        this.url = url
        this.name = name
        this.children = children
        this.pfpUrl = pfpUrl
    }
}

// TODO figure out how to find and edit nested object

const App = () => {
    const [users, setUsers] = useState<any>(undefined) // start as undefined, become array of User s
    const inputRef = createRef<HTMLInputElement>()

    const initializeUsers = () => {
        let url = inputRef.current?.value
        url !== undefined && setUsers([new User(url, url, [], '')])
    }

    const getFollowers = (url: string) => {
        fetch(
            'http://localhost:3030/followers' +
                new URLSearchParams({ url: url })
        ).then((x) => console.log(x))
    }

    const getTestFollowers = () => {
        fetch('http://localhost:3030/test').then((res) => setUsers(res.json()))
    }

    return (
        <div>
            <ul>
                <li>
                    <input ref={inputRef} type="text"></input>
                    <button onClick={() => initializeUsers()}>+</button>
                </li>
                {users !== undefined && <List users={users} />}
            </ul>
        </div>
    )
}

const List = ({ users }: { users: Array<User> | undefined }) => {
    return (
        <ul>
            {users?.map((user) => (
                <li key={user.name}>
                    <div>
                        {user.name}
                        <button>+</button>
                    </div>
                    <List users={user.children} />
                </li>
            ))}
        </ul>
    )
}

export default App
