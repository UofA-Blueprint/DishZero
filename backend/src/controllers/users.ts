import { Request, Response } from 'express'
import { getAllUsers, getUsersWithRole, verifyRole } from '../services/users'
import { CustomRequest } from '../middlewares/auth'
import { auth } from '../services/firebase'

// get all users information from firebase
export const getUsers = async (req: Request, res: Response) => {
    let role = req.query['role']?.toString()

    // only send users information if user is admin

    let userClaims = (req as CustomRequest).firebase
    if (userClaims.role !== 'admin') {
        req.log.error({
            message: 'User is not admin',
        })
        return res.status(403).json({ error: 'forbidden' })
    }

    if (role && verifyRole(role)) {
        try {
            let users = await getUsersWithRole(role)
            req.log.info({
                message: `Retrieved ${users.length} users with role ${role}`,
            })
            return res.status(200).json({ users })
        } catch (error) {
            req.log.error({
                error: error,
                message: 'Error when fetching users from firebase',
            })
            return res.status(500).json({ error: 'internal_server_error' })
        }
    } else {
        try {
            let users = await getAllUsers()
            req.log.info({
                message: `Retrieved ${users.length} users`,
            })
            return res.status(200).json({ users })
        } catch (error) {
            req.log.error({
                error: error,
                message: 'Error when fetching users from firebase',
            })
            return res.status(500).json({ error: 'internal_server_error' })
        }
    }
}

// verify user session and return user information
export const verifyUserSession = async (req: Request, res: Response) => {
    let userClaims = (req as CustomRequest).firebase
    let user = await auth.getUser(userClaims.uid)
    if (!user) {
        req.log.error({
            message: 'User not found',
        })
        return res.status(404).json({ error: 'user_not_found' })
    }
    req.log.info({
        message: 'User session verified',
    })
    return res.status(200).json({ user })
}
