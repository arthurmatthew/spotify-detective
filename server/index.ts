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
    followers(req.query.url as string)
        .then((users: Array<User>) => {
            res.json(users)
        })
        .finally(() => console.log('Data sent'))
})

app.get('/test', (req, res) => {
    console.log('Request received')
    testData()
        .then((users: Array<User>) => res.json(users))
        .finally(() => console.log('Data sent'))
})

app.listen(PORT)
