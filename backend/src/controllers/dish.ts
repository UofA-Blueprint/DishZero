import { Request, Response } from 'express'

import { db } from '../services/firebase'
import { Dish } from '../models/dish'
import { Transaction } from '../models/transaction'
import { mapDishesToLatestTransaction, mapToDishVM } from '../services/dish'
import { CustomRequest } from '../middlewares/auth'

export const getDishes = async (req: Request, res: Response) => {
    // TODO: send dish information based on user role

    // Example of how to get user claims

    // let userClaims = (req as CustomRequest).firebase
    // userClaims.dishrole

    // get dishes from firebase
    let rawDishData = <Array<Dish>>[]
    try {
        let dishesQuerySnapshot = await db.collection('dishes').get()
        dishesQuerySnapshot.docs.forEach((doc) => {
            let data = doc.data()
            rawDishData.push({
                id: doc.id,
                qid: parseInt(data.qid, 10),
                registered: data.registered.toDate(),
                type: data.type ? data.type : '',
            })
        })
    } catch (e) {
        req.log.error({
            error: e,
            message: 'Error when fetching dishes from firebase',
        })
        res.status(500).json({ error: 'internal_server_error' })
        return
    }

    req.log.info({ message: 'Retrieved dish data from firebase' })

    if (req.query['transaction']?.toString() !== 'yes') {
        req.log.info({ message: 'Sending dish data without transactions' })
        res.status(200).json({ dishes: rawDishData })
        return
    }

    // fine, or replace it later with call to transaction api?
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
            message: 'Error when fetching dishes transactions from firebase',
        })
        res.status(500).json({ error: 'internal_server_error' })
        return
    }

    req.log.info({ message: 'Retrieved transactions from firebase' })

    let dishTransMap = new Map<
        string,
        {
            transaction: Transaction
            count: number
        }
    >()

    let allDishesVM = <Array<any>>[]

    try {
        dishTransMap = mapDishesToLatestTransaction(transactions)
        req.log.info({ message: 'Mapped dishes to transactions' })
    } catch (e) {
        req.log.error({
            error: e,
            message: 'Error when mapping dishes to transactions',
        })
        res.status(500).json({ error: 'internal_server_error' })
        return
    }

    try {
        allDishesVM = mapToDishVM(rawDishData, dishTransMap)
        req.log.info({ message: 'Mapped transactions to view model' })
    } catch (e) {
        req.log.error({
            error: e,
            message: 'Error when mapping transactions to view model',
        })
        res.status(500).json({ error: 'internal_server_error' })
        return
    }

    req.log.info({ message: 'Sending dish data with transactions' })
    // send response
    res.status(200).json({ dishes: allDishesVM })
    return
}
