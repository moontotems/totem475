import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import { logger } from './utils'
const path = require('path')
const request = require('request')

const PORT = process.env.PORT || 5000

// create express app
const app = express()
// setup express app
app.set('port', PORT)
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// static public files
app.use(express.static(path.join(__dirname, 'public')))

app.get('*', function (req: Request, res: Response) {
  return res.sendStatus(403)
})

app.post('/post', function (req: Request, res: Response) {
  const { headers, params, query, body } = req

  // github webhook
  const payload = JSON.parse(body.payload)

  //console.log({ payload })
  //logger.info(payload)

  request('http://whatthecommit.com/index.txt', function (error, res, body) {
    if (!error && res.statusCode == 200) {
      const commitMessage = body.trim()
      console.log({ commitMessage })
    }
  })
  return res.sendStatus(200)
})

// start express app
app.listen(app.get('port'), function () {
  console.log('App is running on port', app.get('port'))
})
