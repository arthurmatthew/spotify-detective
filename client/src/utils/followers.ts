import React from 'react'
import User from '../types/User'

export const getFollowers = async (
    url: string,
    users: Array<User>,
    setUsers: (value: React.SetStateAction<User[]>) => void
) => {
    const newUsers = await fetch(
        'http://localhost:3000/followers?' + new URLSearchParams({ url: url })
    )
    const json = await newUsers.json()

    // Update checked property
    const updatedUsers = [...json, ...users].map((user) => {
        if (user.url === url) {
            return new User(
                user.url,
                user.name,
                user.pfpUrl,
                user.relevance,
                true
            )
        }
        return user
    })
    setUsers(updatedUsers.filter((x: User) => !(x.url == 'error')))
}

export const getFollowersMulti = async (
    users: Array<User>,
    setUsers: (value: React.SetStateAction<User[]>) => void
) => {
    let stateCopy: Array<User> = users

    const newUsers = await fetch(
        'http://localhost:3000/followers/multi?' +
            new URLSearchParams({
                url: JSON.stringify(
                    [
                        ...new Set(
                            users.filter((x) => !x.checked).map((x) => x.url)
                        ),
                    ] // purpose of set is to remove duplicates
                ),
            })
    )

    stateCopy = stateCopy.map(
        (x) => new User(x.url, x.name, x.pfpUrl, x.relevance, true)
    )

    const json = await newUsers.json() // array of all followers of every user in array

    stateCopy = [...stateCopy, ...json].filter((x: User) => !(x.url == 'error'))

    setUsers(stateCopy)
}

export const getTestFollowers = (
    setUsers: (value: React.SetStateAction<User[]>) => void
) => {
    fetch('http://localhost:3000/test').then(async (x) => {
        let users = await x.json()
        setUsers((prevUsers) => [
            ...(prevUsers as any[]),
            ...users.filter((x: User) => !(x.url == 'error')),
        ])
    })
}

// Essentially removes duplicates from array and counts their occurrences and adds it as the relevance property
export const toRelevanceModel = (users: Array<User>) => {
    let result = users
    let counts = users
        .map((x) => x.url)
        .reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map())
    // counts.values() = occurrences
    // counts.keys() = users
    result.map((x) => (x.relevance = counts.get(x.url))) // adds relevance property

    let unique = new Map()
    for (let user of result) {
        if (
            unique.get(user.url) == false ||
            unique.get(user.url) == undefined
        ) {
            unique.set(user.url, user.checked)
        }
    }

    // this code essentially removes duplicates, preferring the duplicate with a checked of true
    return [
        ...new Map(
            result
                .map(
                    (x) =>
                        new User(
                            x.url,
                            x.name,
                            x.pfpUrl,
                            x.relevance,
                            unique.get(x.url)
                        )
                )
                .map((x) => [x.url, x])
        ).values(),
    ].sort(
        (a, b) => parseInt(b.relevance) - parseInt(a.relevance) // sort by relevance greatest to least
    )
}
