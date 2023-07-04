import { Request, Response } from 'express'
import { getAllUsers, getUsersWithRole, verifyRole } from '../services/users'

export const getUsers = async (req: Request, res: Response) => {
    let role = req.query['role']?.toString()

    // TODO: only send users information if user is admin

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
