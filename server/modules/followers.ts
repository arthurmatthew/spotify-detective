import puppeteer from 'puppeteer'
import findFollowers from './followers/findFollowers'
import findName from './followers/findName'
import findPfpUrl from './followers/findPfpUrl'
import findUrl from './followers/findUrl'
import User from './User'

const followers = async (profileUrl: string) => {
    let url = profileUrl + '/followers'

    let users: Array<User> = new Array()

    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()

    try {
        await page.goto(url, { waitUntil: 'networkidle0' })
    } catch (err) {
        console.log(err)
        return [new User('', '', '')]
    }

    let followers = await findFollowers(page)
    if (followers !== false)
        for (let i = 0; i < followers.length; i++) {
            let follower = followers[i]
            let data = await follower.$(':scope > *')

            let pfpUrl: string | undefined = await findPfpUrl(data)
            let name: string | undefined = await findName(data).then((x) =>
                x?.slice(9)
            ) // Slice 9 to remove JSHandle: text
            let url: string | undefined = await findUrl(data).then((x) =>
                x?.slice(9)
            )
            if (url !== undefined && name !== undefined)
                users.push(
                    new User(url, name, pfpUrl === undefined ? '' : pfpUrl)
                )
        }

    await browser.close()

    return users
}

export default followers
