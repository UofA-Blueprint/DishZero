import { Request, Response } from 'express'
import { auth, db } from '../services/firebase'
import { getUserByEmail } from '../services/users'
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier'

// handle login request
export const login = async (req: Request, res: Response) => {
    // Get the ID token passed.
    let decodedToken
    const idToken = req.body.idToken?.toString()
    if (!idToken) {
        req.log.error({
            message: 'No id token provided',
        })
        return res.status(401).send({ error: 'unauthorized_request' })
    }

    // verify the id token
    try {
        decodedToken = await verifyIdToken(idToken)
        req.log.info({
            message: 'Verified firebase id token',
        })
    } catch (error) {
        req.log.error({
            error,
            message: 'Error when verifying firebase id token',
        })
        return res.status(401).send({ error: 'unauthorized_request' })
    }

    // TODO: add protection against csrf attacks
    const expiresIn = 60 * 60 * 24 * 5 * 1000 // 5 days
    try {
        let sessionCookie = await createSessionCookie(idToken, expiresIn)
        let user = await getUser(decodedToken)
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
const getUser = async (decodedIdToken: DecodedIdToken) => {
    let email = decodedIdToken.email
    // let idToken = req.body.idToken.toString()
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
        await auth.setCustomUserClaims(decodedIdToken.sub, { role: 'customer' })
        try {
            db.collection('users').doc(decodedIdToken.uid).set(User)
            let retrieveUser = await getUserByEmail(email)
            return retrieveUser
        } catch (error) {
            throw new Error('Error when creating user in firebase collection')
        }
    }

    return userExists
}

const verifyIdToken = async (idToken: string) => {
    return auth.verifyIdToken(idToken)
}
