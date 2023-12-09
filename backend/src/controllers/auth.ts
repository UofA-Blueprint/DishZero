import { Request, Response } from 'express'
import { auth, db } from '../internal/firebase'
import { getUserByEmail } from '../services/users'
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier'
import Logger from '../utils/logger'

// handle login request
export const login = async (req: Request, res: Response) => {
    // Get the ID token passed.
    let decodedToken
    const idToken = req.body.idToken?.toString()
    if (!idToken) {
        Logger.error({
            message: 'No id token provided',
            statusCode: 401,
        })
        return res.status(401).send({ error: 'unauthorized_request' })
    }

    // verify the id token
    try {
        decodedToken = await verifyIdToken(idToken)
        Logger.info({
            message: 'Verified firebase id token',
        })
    } catch (error) {
        Logger.error({
            error,
            message: 'Error when verifying firebase id token',
            statusCode: 401,
        })
        return res.status(401).send({ error: 'unauthorized_request' })
    }

    // TODO: add protection against csrf attacks
    const expiresIn = 60 * 60 * 24 * 5 * 1000 // 5 days
    try {
        let sessionCookie = await createSessionCookie(idToken, expiresIn)
        let user = await getUser(decodedToken)
        res.cookie('session', sessionCookie, { maxAge: expiresIn, httpOnly: true, secure: true })
        Logger.info({
            message: 'Created firebase session cookie',
        })
        return res.status(200).json({
            session: sessionCookie,
            user,
        })
    } catch (error) {
        Logger.error({
            error,
            message: 'Error when creating firebase session cookie',
        })
        return res.status(401).send({ error: 'unauthorized_request' })
    }
}

// handle logout request
export const logout = async (req: Request, res: Response) => {
    const sessionCookie = req.header('session-token') || req.cookies.session || ''
    res.clearCookie('session')
    auth.verifySessionCookie(sessionCookie)
        .then((decodedClaims) => {
            return auth.revokeRefreshTokens(decodedClaims.sub)
        })
        .then(() => {
            Logger.info({
                message: 'Revoked firebase session cookie',
            })
            res.status(200).send({ status: 'success' })
        })
        .catch((error) => {
            Logger.error({
                error,
                message: 'Error when revoking firebase session cookie',
            })
            res.status(401).send({ error: 'unauthorized_request' })
        })
}

// Create session cookie from firebase id token
const createSessionCookie = async (idToken: string, expiresIn: number) => {
    return auth.createSessionCookie(idToken, { expiresIn })
}

// Get user from firebase collection or create new user if not exists
const getUser = async (decodedIdToken: DecodedIdToken) => {
    let email = decodedIdToken.email
    // let idToken = req.body.idToken.toString()
    if (!email) {
        Logger.error({
            message: 'Email is not provided',
        })
        throw new Error('Email is not provided')
    }
    let userExists = await getUserByEmail(email)

    // DISCUSS: pass additional user information to frontend like displayName, photoURL, phoneNumber, etc.

    if (!userExists) {
        // Creates a new user in the firebase collection, set custom claims and return the user
        let User = {
            email,
            role: 'customer',
        }
        Logger.info({
            message: 'Creating new user in firebase collection',
        })
        await auth.setCustomUserClaims(decodedIdToken.sub, { role: 'customer' })
        try {
            db.collection('users').doc(decodedIdToken.uid).set(User)
            let retrieveUser = await getUserByEmail(email)
            return retrieveUser
        } catch (error) {
            Logger.error({
                error,
                message: 'Error when creating user in firebase collection',
            })
            throw new Error('Error when creating user in firebase collection')
        }
    }

    Logger.info({
        message: 'User exists in firebase collection',
    })
    return userExists
}

const verifyIdToken = async (idToken: string) => {
    return auth.verifyIdToken(idToken)
}
