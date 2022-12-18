import express from 'express'
import cors from 'cors'
import followers from './modules/followers'
import User from './modules/User'
import testData from './modules/testData'

const app = express()
const PORT = 3030

app.use(cors())

app.get('/followers', (req, res) => {
    followers(req.query.url as string).then((users: Array<User>) => {
        res.json(users)
    })
})

app.get('/test', (req, res) => {
    testData().then((users: Array<User>) => res.json(users))
})

app.listen(PORT)
