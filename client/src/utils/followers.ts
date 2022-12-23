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
        console.log(user)

        if (user.url === url) {
            console.log('updating checked', user)

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
    return [...new Map(result.map((x) => [x.url, x])).values()].sort(
        (a, b) => parseInt(b.relevance) - parseInt(a.relevance) // sort by relevance greatest to least
    )
}
