import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
dotenv.config({ path: '.env' })
import githubHookVerification from './githubHookVerification'
import { twitterClient, readOnlyClient, readWriteClient } from './twitterClient'
import { logger } from './utils'
const path = require('path')
const request = require('request')

const PORT = process.env.PORT || 5000

// create express app
const app = express()
// set port
app.set('port', PORT)
// static public files
app.use(express.static(path.join(__dirname, 'public')))

// https://stackoverflow.com/a/35651853/90674
const rawBodySaver = function (req, res, buf, encoding) {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8')
  }
}

app.use(bodyParser.json({ verify: rawBodySaver }))
app.use(bodyParser.urlencoded({ verify: rawBodySaver, extended: true }))
app.use(bodyParser.raw({ verify: rawBodySaver, type: '*/*' }))

app.get('*', (req: Request, res: Response) => {
  return res.sendStatus(403)
})

const verifyPostData = (req: Request, res: Response, next) => {
  githubHookVerification(req, res, next)
}

app.post('/post', verifyPostData, async (req: Request, res: Response) => {
  const { headers, params, query, body } = req

  // github webhook
  const payload = JSON.parse(body.payload)
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
        logger.info('tweeting message: success')
      }
    })
  } catch (e) {
    logger.error(e.message)
    return res.sendStatus(500, e.message)
  }

  return res.sendStatus(200)
})

// start express app
app.listen(app.get('port'), () => {
  console.log('App is running on port', app.get('port'))
})
