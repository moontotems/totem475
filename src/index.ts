import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import { TwitterApi } from 'twitter-api-v2'
import dotenv from 'dotenv'
dotenv.config({ path: '.env' })
import { logger } from './utils'
const path = require('path')
const request = require('request')

// https://github.com/plhery/node-twitter-api-v2/blob/HEAD/doc/examples.md
const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_KEY_SECRET,
  accessToken: process.env.TWITTER_APP_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_APP_ACCESS_TOKEN_SECRET
})

const readOnlyClient = twitterClient.readOnly
const readWriteClient = twitterClient.readWrite

const PORT = process.env.PORT || 5000

// create express app
const app = express()
// setup express app
app.set('port', PORT)
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// static public files
app.use(express.static(path.join(__dirname, 'public')))

app.get('*', (req: Request, res: Response) => {
  return res.sendStatus(403)
})

app.post('/post', async (req: Request, res: Response) => {
  const { headers, params, query, body } = req

  // github webhook
  //const payload = JSON.parse(body.payload)

  //console.log({ payload })
  //logger.info(payload)

  try {
    logger.info('fetching message from whatthecommit.com')
    request('http://whatthecommit.com/index.txt', async (error, res, body) => {
      if (!error && res.statusCode == 200) {
        const commitMessage = body.trim()
        logger.info(`got message: ${commitMessage}`)
        logger.info('tweeting message')
        await readWriteClient.v1.tweet(commitMessage)
        logger.info('tweeting message: Success')
      }
    })
  } catch (e) {
    logger.error(e.message)
  }

  return res.sendStatus(200)
})

// start express app
app.listen(app.get('port'), () => {
  console.log('App is running on port', app.get('port'))
})
