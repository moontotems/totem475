import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import { logger } from './utils'
const path = require('path')

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

const tweets = [
  'Hacking away!',
  'Coding, coding coding!',
  'Add, commit & push!',
  'Mergy, mergy!',
  'Solved it!',
  'Initial commit!',
  'Final version 2',
  'merge hell avoided',
  'Complete rewrite (lol)',
  'Fix some erros. Idk why the hell I did it the way I did.',
  'Atomic commit before I fuck up more sh*t',
  `And a commit that I don't know the reason of...`,
  'This is not the commit message you are looking for',
  'Dirty hack, have a better idea?',
  'Crap. Tonight is raid night and I am already late.',
  'Never Run This Commit As Root',
  'For the sake of my sanity, just ignore this...',
  'I was wrong...'
]

app.post('/post', function (req: Request, res: Response) {
  const { headers, params, query, body } = req
  const payload = JSON.parse(body.payload)
  //logger.info(payload)
  console.log({ payload })
  return res.sendStatus(200)
})

// start express app
app.listen(app.get('port'), function () {
  console.log('App is running on port', app.get('port'))
})
