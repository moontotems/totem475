import { TwitterApi } from 'twitter-api-v2'

// https://github.com/plhery/node-twitter-api-v2/blob/HEAD/doc/examples.md

const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_KEY_SECRET,
  accessToken: process.env.TWITTER_APP_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_APP_ACCESS_TOKEN_SECRET
})

const readOnlyClient = twitterClient.readOnly
const readWriteClient = twitterClient.readWrite

export { twitterClient, readOnlyClient, readWriteClient }
