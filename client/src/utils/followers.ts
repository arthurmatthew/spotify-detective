import User from '../types/User'

/**
 * Takes an array of users and optionally a URL. If given a URL it will return a
 * concatenation of the given array and the followers of the URL. If not given a URL,
 * it will return a concatenation of the given array and the followers of every user
 * in the given array.
 * @param {Array<User>} users - Array of users
 * @param {string} [url] - Optional URL
 * @returns {Promise<User[]>}
 */
export const getFollowers = async (users: Array<User>, url?: string) => {
  let stateCopy: Array<User> = users
  let params = new URLSearchParams(
    url != undefined
      ? { url: url }
      : {
          url: JSON.stringify([
            ...new Set(users.filter((x) => !x.checked).map((x) => x.url)),
          ]),
        }
  )
  let endpoint = `http://localhost:3000/followers${
    url != undefined ? '' : '/multi'
  }?`

  const newUsers = await fetch(endpoint + params)

  url != undefined
    ? (stateCopy = stateCopy.map((x) =>
        x.url == url
          ? new User(x.url, x.name, x.pfpUrl, x.relevance, x.parent, true)
          : x
      ))
    : (stateCopy = stateCopy.map(
        (x) => new User(x.url, x.name, x.pfpUrl, x.relevance, x.parent, true)
      ))

  const json = await newUsers.json() // array of all followers of every user in array

  stateCopy = [...stateCopy, ...json].filter((x: User) => !(x.url == 'error'))

  return toRelevanceModel(stateCopy)
}

/**
 * Fetches an array of fake users from the server.
 * @returns {Promise<User[]>}
 */
export const getTestFollowers = async (): Promise<User[]> => {
  const users = await fetch('http://localhost:3000/test')
  const json: Array<User> = await users.json()
  return toRelevanceModel(json.filter((x: User) => !(x.url == 'error')))
}

/**
 * Removes users with duplicate URLs, counts the duplicates, and adds the count as a relevance key on each user.
 *
 * @param {Array<User>} users - An array of users
 * @returns {User[]}
 */
export const toRelevanceModel = (users: Array<User>): User[] => {
  let result = users
  let counts = users
    .map((x) => x.url)
    .reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map())

  result.map((x) => (x.relevance = counts.get(x.url))) // Adds relevance property

  // Combine all parents
  let uniqueParent = new Map<string, string[]>()
  for (let user of result) {
    let parents = uniqueParent.get(user.url)
    uniqueParent.set(
      user.url,
      parents != undefined ? [...parents, ...user.parent] : user.parent
    )
  }

  let uniqueCheck = new Map<string, boolean>()
  for (let user of result) {
    if (
      uniqueCheck.get(user.url) == false ||
      uniqueCheck.get(user.url) == undefined
    ) {
      uniqueCheck.set(user.url, user.checked)
    }
  }

  // Remove duplicates, prefer duplicate with a 'checked' value of true
  return [
    ...new Map(
      result
        .map((x) => {
          let parent = uniqueParent.get(x.url)
          let check = uniqueCheck.get(x.url)
          return new User(
            x.url,
            x.name,
            x.pfpUrl,
            x.relevance,
            parent == undefined ? x.parent : parent,
            check == undefined ? x.checked : check
          )
        })
        .map((x) => [x.url, x])
    ).values(),
  ].sort(
    (a, b) => parseInt(b.relevance) - parseInt(a.relevance) // Sort by relevance greatest to least
  )
}
