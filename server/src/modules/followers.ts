import puppeteer from 'puppeteer'
import User from '../types/User'
import Config from '../types/Config'
import { findFollowers } from './followers/findFollowers'
import { findName } from './followers/findName'
import { findPfpUrl } from './followers/findPfpUrl'
import { findUrl } from './followers/findUrl'

const followers = async (profileUrl: string, config: Config) => {
  let url = profileUrl + '/followers'

  let users: Array<User> = new Array()

  console.log('Opening browser...')
  const browser = await puppeteer.launch({ headless: true })

  console.log('Creating page...')
  const page = await browser.newPage()

  console.log('Visiting site...')
  try {
    await page.goto(url)
    await page.waitForSelector('section[aria-label="Followers"]')
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
      await page.goto(parentUrl)
      await page.waitForSelector('section[aria-label="Followers"]')
    } catch (err) {
      console.log('Invalid URL.')
      continue
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
