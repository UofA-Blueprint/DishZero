import { Request, Response } from 'express'
import { CustomRequest } from '../middlewares/auth'
import { verifyIfUserAdmin } from '../services/users'
import { getAllTransactions, getUserTransactions } from '../services/transactions'

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
                req.log.info({
                    message: 'retrieved all transactions',
                })
                return res.status(200).json({ transactions })
            } catch (err: any) {
                req.log.error({
                    error: err.message,
                })
                res.status(500).json({ error: 'internal_server_error', message: err.message })
            }
        } else {
            req.log.error({
                message: 'User is not admin',
            })
            return res.status(403).json({ error: 'forbidden' })
        }
    }

    // if query is not present, get transactions based on user_id
    try {
        transactions = await getUserTransactions(userClaims)
    } catch (e) {
        req.log.error({
            error: e,
            message: 'Error when fetching transactions from firebase',
        })
        res.status(500).json({ error: 'internal_server_error' })
        return
    }

    req.log.info({ message: 'Sending transactions' })
    // send response
    res.status(200).json({ transactions })
    return
}
