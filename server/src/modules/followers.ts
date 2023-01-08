import puppeteer, { ElementHandle, Page } from 'puppeteer'
import { JSDOM } from 'jsdom'
import User from '../types/User'
import Config from '../types/Config'

const findFollowers = async (page: Page) => {
  return await page
    ?.$('section[aria-label="Followers"]') // Find parent
    .then(
      async (
        x // Take the parent
      ) =>
        x !== null && // Satisfy TypeScript
        (await x
          .$('div[style]') // Find child div of parent
          .then(
            async (x) => x !== null && (await x.$$(':scope > *')) // Get all children of child
          ))
    )
}

const findName = async (data: ElementHandle<Element> | null) => {
  return await data
    ?.$(':scope > * a')
    .then(async (x) => await x?.getProperty('title'))
    .then(async (x) => await x?.toString())
}

const findPfpUrl = async (data: ElementHandle<Element> | null) => {
  return await data
    ?.$(':scope > * img')
    .then(async (x) => await x?.getProperty('src'))
    .then(async (x) => await x?.toString())
}

const findUrl = async (data: ElementHandle<Element> | null) => {
  return await data
    ?.$(':scope > * a')
    .then(async (x) => await x?.getProperty('href'))
    .then(async (x) => await x?.toString())
}

const followers = async (profileUrl: string, config: Config) => {
  let url = profileUrl + '/followers'

  let users: Array<User> = new Array()

  console.log('Opening browser...')
  const browser = await puppeteer.launch({ headless: true })

  console.log('Creating page...')
  const page = await browser.newPage()

  console.log('Visiting site...')
  try {
    await page.goto(url, { waitUntil: 'networkidle0' }) // TODO change this to wait for the followers element, maybe makes it faster
  } catch (err) {
    console.log('Invalid URL.')
    return [new User('error', '', '')]
  }

  console.log('Searching for followers in DOM...')
  let followers = await findFollowers(page)
  if (followers !== false) {
    console.log(`Found ${followers.length} followers`)

    for (let i = 0; i < followers.length; i++) {
      let follower = followers[i]
      let data = await follower.$(':scope > *')

      let pfpUrl: string | undefined = await findPfpUrl(data).then((x) =>
        x?.slice(9)
      )
      let name: string | undefined = await findName(data).then((x) =>
        x?.slice(9)
      ) // Slice 9 to remove JSHandle: text
      let url: string | undefined = await findUrl(data).then((x) => x?.slice(9))
      if (url !== undefined && name !== undefined)
        users.push(
          new User(url, name, pfpUrl === undefined ? '' : pfpUrl, [profileUrl])
        )
      console.log(`[${i + 1}] Follower > User completed`)
    }
  }
  await browser.close()

  console.log(`Completed`)
  return users
}

const followersMulti = async (profileUrls: Array<string>, config: Config) => {
  // urls is array of profile urls
  let urls = profileUrls.map((x) => x + '/followers')
  let users: Array<User> = new Array()

  console.log('Starting job of ' + urls.length)

  console.log('Opening browser...')
  const browser = await puppeteer.launch({ headless: true })

  console.log('Creating page...')
  const page = await browser.newPage()

  for (const parentUrl of urls) {
    console.log(`${urls.indexOf(parentUrl) + 1} of ${urls.length}`)
    console.log('Visiting site...')
    try {
      await page.goto(parentUrl, { waitUntil: 'networkidle0' })
    } catch (err) {
      console.log('Invalid URL.')
      return [new User('error', '', '')]
    }

    console.log('Searching for followers in DOM...')
    let followers = await findFollowers(page)
    if (followers !== false && followers.length <= config.maxFollowers) {
      console.log(`Found ${followers.length} followers`)

      for (let i = 0; i < followers.length; i++) {
        let follower = followers[i]
        let data = await follower.$(':scope > *')

        let pfpUrl: string | undefined = await findPfpUrl(data).then((x) =>
          x?.slice(9)
        )
        let name: string | undefined = await findName(data).then((x) =>
          x?.slice(9)
        ) // Slice 9 to remove JSHandle: text
        let url: string | undefined = await findUrl(data).then((x) =>
          x?.slice(9)
        )
        if (url !== undefined && name !== undefined)
          users.push(
            new User(url, name, pfpUrl === undefined ? '' : pfpUrl, [
              parentUrl.split('/followers')[0],
            ])
          )
        console.log(`[${i + 1}] Follower > User completed`)
      }
    } else {
      console.log('Followers not found or over maximum limit')
    }
  }
  await browser.close()

  console.log(`Completed`)
  return users
}

export default { followers, followersMulti }
