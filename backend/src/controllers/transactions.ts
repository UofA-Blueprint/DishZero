import { Request, Response } from 'express'
import { CustomRequest } from '../middlewares/auth'

export const getTransactions = async (req: Request, res: Response) => {
    // only allow admin to get all transactions
    // TODO: send transactions information based on user role

    let userClaims = (req as CustomRequest).firebase
    if (userClaims.dishrole !== 'admin') {
        req.log.error({
            message: 'User is not admin',
        })
        return res.status(403).json({ error: 'forbidden' })
    }

    // TODO: implement get transactions by role logic
}
