import express from 'express'
import followers from './modules/followers'
import testData from './modules/testData'
import User from './types/User'

const router = express.Router()

router.get('/status', (req, res) => {
  res.send('OK')
})

router.get('/followers', (req, res) => {
  console.log('Request received')
  let start = performance.now()
  followers
    .followers(req.query.url as string, JSON.parse(req.query.config as string))
    .then((users: Array<User>) => {
      res.json(users)
    })
    .finally(() =>
      console.log(
        `Data sent in ${Math.floor((performance.now() - start) / 1000)} seconds`
      )
    )
})

router.get('/followers/multi', (req, res) => {
  console.log('Request received')
  let start = performance.now()
  try {
    followers
      .followersMulti(
        JSON.parse(req.query.url as string),
        JSON.parse(req.query.config as string)
      )
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
  } catch (error) {
    console.log(error)
  }
})

router.get('/test', (req, res) => {
  console.log('Request received')
  let start = performance.now()
  try {
    testData()
      .then(async (users: Array<User>) => {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        res.json(users)
      })
      .finally(() =>
        console.log(
          `Data sent in ${Math.floor(
            (performance.now() - start) / 1000
          )} seconds`
        )
      )
  } catch (error) {
    console.log(error)
  }
})

module.exports = router
