import express from 'express'
import cors from 'cors'
import followers from './modules/followers'
import User from './modules/User'
import testData from './modules/testData'

const app = express()
const PORT = 3000

app.use(cors())

app.get('/followers', (req, res) => {
    console.log('Request received')
    let start = performance.now()
    followers(req.query.url as string)
        .then((users: Array<User>) => {
            res.json(users)
        })
        .finally(() =>
            console.log(
                `Data sent in ${Math.floor(
                    (performance.now() - start) / 1000
                )} seconds`
            )
        )
})

app.get('/test', (req, res) => {
    console.log('Request received')
    let start = performance.now()
    testData()
        .then((users: Array<User>) => res.json(users))
        .finally(() =>
            console.log(
                `Data sent in ${Math.floor(
                    (performance.now() - start) / 1000
                )} seconds`
            )
        )
})

app.listen(PORT)
