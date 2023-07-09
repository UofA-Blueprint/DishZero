import { Request, Response } from 'express'
import {
    getAllUsers,
    getUsersWithRole,
    modifyUserRole,
    verifyRole,
    verifyType,
} from '../services/users'
import { CustomRequest } from '../middlewares/auth'
import { auth } from '../services/firebase'
import { User } from '../models/user'

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

export const updateUser = async (req: Request, res: Response) => {
    // If the user is not an admin, modification is not allowed
    let userClaims = (req as CustomRequest).firebase

    // admin Can't modify their own role
    // modify different properties of user based on request body and parameters
    // also validate the request body

    let type = req.params['type']?.toString()
    if (type && verifyType(type)) {
        if (type === 'role') {
            if (userClaims.role !== 'admin') {
                req.log.error({
                    message: 'User is not admin',
                })
                return res.status(403).json({ error: 'forbidden' })
            }

            try {
                let user: User = req.body.user
                if (!user) {
                    req.log.error({
                        message: 'No user provided',
                    })
                    throw new Error('No user provided')
                }

                await modifyUserRole(user, userClaims)

                req.log.info({
                    message: 'Successfully updated user role',
                })
                return res.status(200).json({ status: 'success' })
            } catch (error) {
                req.log.error({
                    error,
                    message: 'Error updating user role',
                })
                return res.status(500).json({ error: 'internal_server_error' })
            }
        } else if (type === 'user') {
            try {
                let user: User = req.body.user
                if (!user) {
                    req.log.error({
                        message: 'No user provided',
                    })
                    return res.status(400).json({ error: 'no_user_provided' })
                }

                // TODO: update user information except role

                req.log.info({
                    message: 'Successfully updated user information',
                })
                return res.status(200).json({ status: 'success' })
            } catch (error) {
                req.log.error({
                    error,
                    message: 'Error updating user information',
                })
                return res.status(500).json({ error: 'internal_server_error' })
            }
        }
    } else {
        req.log.error({
            message: 'Invalid type',
        })
        return res.status(400).json({ error: 'invalid_type' })
    }
}
