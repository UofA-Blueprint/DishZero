import { Request, Response } from 'express'
import { CustomRequest } from '../middlewares/auth'
import { verifyIfUserAdmin } from '../services/users'
import { getAllTransactions, getUserTransactions } from '../services/transactions'
import Logger from '../utils/logger'

export const getTransactions = async (req: Request, res: Response) => {
    let userClaims = (req as CustomRequest).firebase
    let all = req.query['all']?.toString()
    let transactions
    if (all === 'true') {
        // check if user is admin
        if (verifyIfUserAdmin(userClaims)) {
            // return all transactions
            try {
                transactions = await getAllTransactions()
                Logger.info({
                    message: 'retrieved all transactions',
                })
                return res.status(200).json({ transactions })
            } catch (err: any) {
                Logger.error({
                    error: err.message,
                    statusCode: 500,
                })
                res.status(500).json({ error: 'internal_server_error', message: err.message })
            }
        } else {
            Logger.error({
                message: 'User is not admin',
                statusCode: 403,
            })
            return res.status(403).json({ error: 'forbidden' })
        }
    }

    // if query is not present, get transactions based on user_id
    try {
        transactions = await getUserTransactions(userClaims)
    } catch (e) {
        Logger.error({
            error: e,
            message: 'Error when fetching transactions from firebase',
            statusCode: 500,
        })
        res.status(500).json({ error: 'internal_server_error' })
        return
    }

    Logger.info({ message: 'sending all transactions' })
    // send response
    res.status(200).json({ transactions })
    return
}
