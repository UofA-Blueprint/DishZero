import { Request, Response } from 'express'
import { auth, db } from '../services/firebase'
import { CustomRequest } from '../middlewares/auth'
import { getUserByEmail } from '../services/users'

// handle login request
export const login = async (req: Request, res: Response) => {
    // Get the ID token passed.
    const idToken = req.body.idToken?.toString()
    if (!idToken) {
        req.log.error({
            message: 'No id token provided',
        })
        return res.status(401).send({ error: 'unauthorized_request' })
    }

    // TODO: add protection against csrf attacks

    const expiresIn = 60 * 60 * 24 * 5 * 1000 // 5 days
    try {
        let sessionCookie = await createSessionCookie(idToken, expiresIn)
        let user = await getUser(req)
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
    const sessionCookie = req.header('session-token') || req.cookies.session || ''
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
const getUser = async (req: Request) => {
    let { email } = (req as CustomRequest).firebase
    let idToken = req.body.idToken.toString()
    if (!email) {
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
        const claims = await auth.verifyIdToken(idToken)
        await auth.setCustomUserClaims(claims.sub, { dishrole: 'customer' })
        try {
            db.collection('users').doc(claims.uid).set(User)
            let retrieveUser = await getUserByEmail(email)
            return retrieveUser
        } catch (error) {
            throw new Error('Error when creating user in firebase collection')
        }
    }

    return userExists
}
