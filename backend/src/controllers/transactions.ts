import { Request, Response } from 'express'
import { CustomRequest } from '../middlewares/auth'
import { db } from '../services/firebase'
import { Transaction } from '../models/transaction'

export const getTransactions = async (req: Request, res: Response) => {
    // only allow admin to get all transactions
    // TODO: send transactions information based on user role

    let userClaims = (req as CustomRequest).firebase
    if (userClaims.role !== 'admin') {
        req.log.error({
            message: 'User is not admin',
        })
        return res.status(403).json({ error: 'forbidden' })
    }

    
    // get transactions
    let transactions = <Array<Transaction>>[]
    try {
        let transactionsQuerySnapshot = await db.collection('transactions').get()
        transactionsQuerySnapshot.docs.forEach((doc) => {
            let data = doc.data()
            transactions.push({
                id: doc.id,
                dishID: data.dish ? data.dish.id : null,
                userID: data.user,
                returned: data.returned ? data.returned : {},
                timestamp: data.timestamp ? data.timestamp.toDate() : null,
            })
        })
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
    res.status(200).json({ transactions: transactions })
    return
}
