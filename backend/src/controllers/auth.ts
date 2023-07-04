import { Request, Response } from 'express'
import { auth, db } from '../services/firebase'
import { CustomRequest } from '../middlewares/auth'
import { getUserByEmail } from '../services/users'

// handle login request
export const login = async (req: Request, res: Response) => {
    // Get the ID token passed.
    const idToken = req.body.idToken.toString()

    // TODO: add protection against csrf attacks

    const expiresIn = 60 * 60 * 24 * 5 * 1000 // 5 days
    try {
        let sessionCookie = await createSessionCookie(idToken, expiresIn)
        let { email } = (req as CustomRequest).firebase
        let user = await getUser(email!)
        res.cookie('session', sessionCookie, { maxAge: expiresIn, httpOnly: true, secure: true })
        req.log.info({
            message: 'Created firebase session cookie',
        })
        return res.status(200).json({
            session: sessionCookie,
            user,
        })
    } catch (error) {
        req.log.error({
            error,
            message: 'Error when creating firebase session cookie',
        })
        return res.status(401).send({ error: 'unauthorized_request' })
    }
}

// handle logout request
export const logout = async (req: Request, res: Response) => {
    const sessionCookie = req.header('session') || req.cookies.session || ''
    res.clearCookie('session')
    auth.verifySessionCookie(sessionCookie)
        .then((decodedClaims) => {
            return auth.revokeRefreshTokens(decodedClaims.sub)
        })
        .then(() => {
            req.log.info({
                message: 'Revoked firebase session cookie',
            })
            res.status(200).send({ status: 'success' })
        })
        .catch((error) => {
            req.log.error({
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
const getUser = async (email: string) => {
    if (!email) {
        throw new Error('Email is not provided')
    }
    let userExists = await getUserByEmail(email)

    // DISCUSS: all pass additional user information to frontend like displayName, photoURL, phoneNumber, etc.

    if (!userExists) {
        // TODO: create user in firebase collection
        let User = {
            email,
            role: 'customer',
        }
        try {
            db.collection('users').add(User)
            let retrieveUser = await getUserByEmail(email)
            return retrieveUser
        } catch (error) {
            throw new Error('Error when creating user in firebase collection')
        }
    }

    return userExists
}
