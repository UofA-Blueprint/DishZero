import { Request, Response } from 'express'

import { db } from '../services/firebase'
import { Dish } from '../models/dish'
import { Transaction } from '../models/transaction'
import {
    createDishInDatabase,
    getDish,
    mapDishesToLatestTransaction,
    mapToDishVM,
    updateBorrowedStatus,
} from '../services/dish'
import { CustomRequest } from '../middlewares/auth'
import Logger from '../utils/logger'
import { verifyIfUserAdmin } from '../services/users'
import { registerTransaction } from '../services/transactions'

export const getDishes = async (req: Request, res: Response) => {
    // TODO: send dish information based on user role

    // Example of how to get user claims

    // let userClaims = (req as CustomRequest).firebase
    // userClaims.role

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
                borrowed: data.borrowed ? data.borrowed : false,
            })
        })
    } catch (e) {
        Logger.error({
            error: e,
            message: 'Error when fetching dishes from firebase',
            statusCode: 500,
        })
        res.status(500).json({ error: 'internal_server_error' })
        return
    }

    Logger.info({
        message: 'Retrieved dish data from firebase',
    })

    if (req.query['transaction']?.toString() !== 'yes') {
        Logger.info({
            message: 'Sending dish data without transactions',
        })
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
                dish: data.dish ? data.dish.id : null,
                userID: data.user,
                returned: data.returned ? data.returned : {},
                timestamp: data.timestamp ? data.timestamp.toDate() : null,
            })
        })
    } catch (e) {
        Logger.error({
            error: e,
            message: 'Error when fetching dishes transactions from firebase',
            statusCode: 500,
        })
        res.status(500).json({ error: 'internal_server_error' })
        return
    }

    Logger.info({
        message: 'Retrieved transactions from firebase',
    })

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
        Logger.info({
            message: 'Mapped dishes to transactions',
        })
    } catch (e) {
        Logger.error({
            error: e,
            message: 'Error when mapping dishes to transactions',
            statusCode: 500,
        })
        res.status(500).json({ error: 'internal_server_error' })
        return
    }

    try {
        allDishesVM = mapToDishVM(rawDishData, dishTransMap)
        Logger.info({
            message: 'Mapped transactions to view model',
        })
    } catch (e) {
        Logger.error({
            error: e,
            message: 'Error when mapping transactions to view model',
            statusCode: 500,
        })
        res.status(500).json({ error: 'internal_server_error' })
        return
    }

    Logger.info({
        message: 'Sending dish data with transactions',
    })
    // send response
    res.status(200).json({ dishes: allDishesVM })
    return
}

export const createDish = async (req: Request, res: Response) => {
    let userClaims = (req as CustomRequest).firebase
    if (!verifyIfUserAdmin(userClaims)) {
        Logger.error({
            module: 'dish.controller',
            message: 'User is not admin',
            statusCode: 403,
        })
        return res.status(403).json({ error: 'forbidden' })
    }

    try {
        let dish = await createDishInDatabase(req.body.dish)
        return res.status(200).json({ dish })
    } catch (error: any) {
        Logger.error({
            module: 'dish.controller',
            error,
            message: 'Error when creating dish in database',
            statusCode: 500,
        })
        return res.status(500).json({ error: 'internal_server_error', message: error.message })
    }
}

export const borrowDish = async (req: Request, res: Response) => {
    let qr_code = req.query['qr_code']?.toString()
    if (!qr_code) {
        Logger.error({
            module: 'dish.controller',
            message: 'No qr_code provided',
            statusCode: 400,
        })
        return res.status(400).json({ error: 'bad_request' })
    }

    let userClaims = (req as CustomRequest).firebase

    // check if the associated dish with the qr_code exists
    // if yes, check if it is borrowed
    // if not, create a new transaction and update the borrowed status of the dish

    try {
        let associatedDish = await getDish(parseInt(qr_code, 10))
        if (!associatedDish) {
            Logger.error({
                module: 'dish.controller',
                message: 'Dish not found',
            })
            return res.status(400).json({ error: 'operation_not_allowed', message: 'Dish not found' })
        }

        if (associatedDish.borrowed) {
            Logger.error({
                module: 'dish.controller',
                message: 'Dish already borrowed',
            })
            return res.status(400).json({ error: 'operation_not_allowed', message: 'Dish already borrowed' })
        }

        let transaction: Transaction = {
            dish: {
                qid: associatedDish.qid,
                id: associatedDish.id,
                type: associatedDish.type,
            },
            userID: userClaims.uid,
            returned: {
                broken: false,
                lost: false,
            },
            timestamp: new Date().toISOString(),
        }

        let newTransaction = await registerTransaction(transaction)
        await updateBorrowedStatus(associatedDish.id, true)

        Logger.info({
            module: 'dish.controller',
            message: 'Successfully borrowed dish',
        })
        return res.status(200).json({ transaction: newTransaction })
    } catch (error: any) {
        Logger.error({
            module: 'dish.controller',
            error,
            message: 'Error when borrowing dish',
            statusCode: 500,
        })
        return res.status(500).json({ error: 'internal_server_error', message: error.message })
    }
}

export const returnDish = async (req: Request, res: Response) => {}
