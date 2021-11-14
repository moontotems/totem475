import crypto from 'crypto'
import { Request, Response } from 'express'
import { logger } from './utils'

const githubHookVerification = (req: Request, res: Response, next) => {
  if (!req.rawBody) {
    return next('Request body empty')
  }

  const sigHeaderName = 'X-Hub-Signature-256'
  const sigHashAlg = 'sha256'

  const sig = Buffer.from(req.get(sigHeaderName) || '', 'utf8')

  const hmac = crypto.createHmac(sigHashAlg, process.env.AUTH_SECRET)
  const digest = Buffer.from(
    `${sigHashAlg}=${hmac.update(req.rawBody).digest('hex')}`,
    'utf8'
  )

  if (sig.length !== digest.length || !crypto.timingSafeEqual(digest, sig)) {
    logger.error(
      `401: Unauthorized - Request body digest (${digest}) did not match ${sigHeaderName} (${sig})`
    )
    return res.sendStatus(401)
  }

  logger.info('verifyPostData: Done')
  return next()
}

export default githubHookVerification
