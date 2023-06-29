import { Request, Response, NextFunction } from 'express'
import * as dotenv from 'dotenv'
dotenv.config()

const API_KEY = process.env.API_KEY

/**
 * verifies the api key in the request header
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export const verifyApiKey = (req: Request, res: Response, next: NextFunction) => {
    const apikey = req.header('x-api-key')
    if (!apikey) {
        req.log.error({
            error: 'No api key provided',
        })
        return res.status(401).json({ error: 'No api key provided' })
    }
    if (apikey !== API_KEY) {
        req.log.error({
            error: 'Invalid api key',
        })
        return res.status(401).json({ error: 'Invalid api key' })
    }

    req.log.info({
        message: 'API key is valid',
    })

    next()
}
