import { Request, Response, NextFunction } from 'express'
import * as dotenv from 'dotenv'
import jwt, { JwtPayload, Secret } from 'jsonwebtoken'
import { auth } from '../internal/firebase'
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier'
import Logger from '../utils/logger'
dotenv.config()

const API_KEY = process.env.API_KEY || 'test'
export const SECRET_KEY: Secret = process.env.SECRET_KEY!

// Define the custom request object
export interface CustomRequest extends Request {
    dishzero: string | JwtPayload
    firebase: DecodedIdToken
}

// Define the payload of the JWT token
export interface TokenPayload {
    email: string
    role: string
    iat: number
    exp: number
}

/**
 * verifies the api key in the request header
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export const verifyApiKey = (req: Request, res: Response, next: NextFunction) => {
    const apikey = req.header('x-api-key')
    if (!apikey) {
        Logger.error({
            error: 'No api key provided',
            statusCode: 401,
        })
        return res.status(401).json({ error: 'no_api_key_provided' })
    }
    if (apikey !== API_KEY) {
        Logger.error({
            error: 'Invalid api key',
            statusCode: 401,
        })
        return res.status(401).json({ error: 'invalid_api_key' })
    }

    Logger.info({
        message: 'API key is valid',
    })

    next()
}

/**
 * verifies the jwt token in the request header
 * @param req Request
 * @param res Response
 * @param next NextFunction
 * @returns decoded token in the request object
 */
export const verifyDishzeroToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('x-dishzero-token')
    if (!token) {
        Logger.error({
            error: 'No token provided',
            statusCode: 401,
        })
        return res.status(401).json({ error: 'no_token_provided' })
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY) as TokenPayload
        ;(req as CustomRequest).dishzero = decoded
        Logger.info({
            message: 'JWT token is valid',
        })
        next()
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            Logger.error({
                error: error,
                message: 'JWT token is expired',
                statusCode: 401,
            })
            return res.status(401).json({ error: 'token_expired' })
        } else if (error instanceof jwt.JsonWebTokenError) {
            Logger.error({
                error: error,
                message: 'JWT token is invalid',
                statusCode: 401,
            })
            return res.status(401).json({ error: 'invalid_token' })
        } else {
            Logger.error({
                error: error,
                message: 'Unknown error when verifying JWT token',
                statusCode: 500,
            })
            return res.status(500).json({ error: 'internal_server_error' })
        }
    }
}

/**
 * verifies the firebase session token in the request header
 * @param req Request
 * @param res Response
 * @param next NextFunction
 * @returns decoded firebase token in the request object
 */
export const verifyFirebaseToken = (req: Request, res: Response, next: NextFunction) => {
    const sessionCookies = req.header('session-token') || req.cookies?.session
    if (!sessionCookies) {
        Logger.error({
            error: 'No session token or cookie provided',
            statusCode: 401,
        })
        return res.status(401).json({ error: 'no_session_token_provided' })
    }
    auth.verifySessionCookie(sessionCookies, true /** check revoked */)
        .then((decodedClaims) => {
            ;(req as CustomRequest).firebase = decodedClaims
            next()
        })
        .catch((error) => {
            Logger.error({
                error,
                message: 'Error when verifying firebase session token',
                statusCode: 401,
            })
            return res.status(401).json({ error: 'invalid_session_token' })
        })
}
