import express from 'express'
import cors from 'cors'
import puppeteer from 'puppeteer'

const app = express()
const PORT = 3030

app.use(cors())

const screenshot = async (url: string) => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    await page.goto(url)
    const image = await page
        .screenshot({ encoding: 'base64' })
        .then((data) => {
            return `data:image/png;base64,${data}`
        })
        .catch((err) => {
            console.log(err)
        })
    await browser.close()

    return image
}

app.get('/screenshot', (req, res) => {
    screenshot(req.query.url as string).then((result) => res.send(result))
})

app.listen(PORT)
