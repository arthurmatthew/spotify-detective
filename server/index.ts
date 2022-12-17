import express from 'express'
import cors from 'cors'
import puppeteer, { ElementHandle, Page } from 'puppeteer'

// TODO comment code + refactor to make it more clear (also on App.tsx)

const app = express()
const PORT = 3030

app.use(cors())

class User {
    url: string
    name: string
    pfpUrl: string | undefined
    children: Object | undefined
    constructor(
        url: string,
        name: string,
        pfpUrl: string | undefined,
        children: Object | undefined
    ) {
        this.url = url
        this.name = name
        this.pfpUrl = pfpUrl
        this.children = children
    }
}

const followers = async (url: string) => {
    type users = { [key: string]: User }
    let users: users = {}

    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()

    await page.goto(url, { waitUntil: 'networkidle0' })

    /*
    Current method to find followers
    section[aria-label="Followers"] -> div[style] -> children
    */
    let followers = await page
        .$('section[aria-label="Followers"]') // Find parent
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
    /*
    Current method to find follower data
    
    data: follower -> child
    
    pfpUrl: data[x] -> children -> div[class] -> div[class] -> div[class] -> img (src) ! IF THE USER HAS NO PFP IT WILL BE AN SVG
    name: data[x] -> children -> a (title, href)
    */
    if (followers !== false) {
        for (let i = 0; i < followers.length; i++) {
            let follower = followers[i]
            let data = await follower.$(':scope > *')

            let pfpUrl: string | undefined = undefined
            let children = {}
            let name = await data
                ?.$(':scope > * a')
                .then(async (x) => await x?.getProperty('title'))
                .then(async (x) => await x?.toString().slice(9)) // Slice 9 to remove JSHandle:<url> prefix
            let url = await data
                ?.$(':scope > * a')
                .then(async (x) => await x?.getProperty('href'))
                .then(async (x) => await x?.toString().slice(9)) // Slice 9 to remove JSHandle:<url> prefix
            if (url !== undefined && name !== undefined)
                users[i.toString()] = new User(url, name, pfpUrl, children)
        }
    }
    await browser.close()

    return users
}

app.get('/followers', (req, res) => {
    const url = (req.query.url as string).split('?')[0] + '/followers'
    followers(url).then((users: Object) => {
        res.json(users)
        console.log('Sent')
    })
})

app.listen(PORT)
