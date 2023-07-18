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
import { getTransaction, registerTransaction } from '../services/transactions'
import { getQrCode } from '../services/qrCode'

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
    let qid = req.query['qid']?.toString()

    // TODO: add support for dish_id

    if (!qid) {
        Logger.error({
            module: 'dish.controller',
            message: 'No qid provided',
            statusCode: 400,
        })
        return res.status(400).json({ error: 'bad_request' })
    }

    let userClaims = (req as CustomRequest).firebase

    // check if the associated dish with the qid exists
    // if yes, check if it is borrowed
    // if not, create a new transaction and update the borrowed status of the dish

    try {
        // Check if the qr code exists
        let qrCodeExits = await getQrCode(qid)
        if (!qrCodeExits) {
            Logger.error({
                module: 'dish.controller',
                message: 'qr code not found',
            })
            return res.status(400).json({ error: 'operation_not_allowed', message: 'qr code not found' })
        }

        let associatedDish = await getDish(parseInt(qid, 10))
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
            function: 'getDish',
            error,
            message: 'Error when borrowing dish',
            statusCode: 500,
        })
        return res.status(500).json({ error: 'internal_server_error', message: error.message })
    }
}

export const returnDish = async (req: Request, res: Response) => {
    let qid = req.query['qid']?.toString()
    // TODO: put a request body validation
    let { broken, lost } = req.body.returned
    if (!qid) {
        Logger.error({
            module: 'dish.controller',
            message: 'No qid provided',
            statusCode: 400,
        })
        return res.status(400).json({ error: 'bad_request', message: "no dish_id provided" })
    }

    let userClaims = (req as CustomRequest).firebase
    try {
        // Check if the qr code exists
        let qrCodeExits = await getQrCode(qid)
        if (!qrCodeExits) {
            Logger.error({
                module: 'dish.controller',
                message: 'qr code not found',
            })
            return res.status(400).json({ error: 'operation_not_allowed', message: 'qr code not found' })
        }

        // check if the borrowed property of the dish is true
        let associatedDish = await getDish(parseInt(qid, 10))
        if (!associatedDish) {
            Logger.error({
                module: 'dish.controller',
                message: 'Dish not found',
            })
            return res.status(400).json({ error: 'operation_not_allowed', message: 'Dish not found' })
        }

        if (!associatedDish.borrowed) {
            Logger.error({
                module: 'dish.controller',
                message: 'Dish not borrowed',
                function: 'returnDish',
            })
            return res.status(400).json({ error: 'operation_not_allowed', message: 'Dish not borrowed' })
        }

        // update the existing transaction with the returned property
        let ongoingTransaction = await getTransaction(userClaims, parseInt(qid, 10))
        if (!ongoingTransaction) {
            Logger.error({
                module: 'dish.controller',
                message: 'Transaction not found',
                function: 'returnDish',
            })
            return res.status(400).json({ error: 'operation_not_allowed', message: 'Transaction not found' })
        }
        
        // update the borrowed property of the dish to false
        await updateBorrowedStatus(associatedDish.id, false)

        await db.collection('transactions').doc(ongoingTransaction.id).update({
            returned: {
                broken,
                lost,
                timestamp: new Date().toISOString(),
            },
        })

        Logger.info({
            module: 'dish.controller',
            message: 'Successfully returned dish',
            function: 'returnDish',
        })

        return res.status(200).json({ message: "dish returned" })
    } catch(error: any) {
        Logger.error({
            module: 'dish.controller',
            function: 'getDish',
            error,
            message: 'Error when fetching dish',
        })
        return res.status(500).json({ error: 'internal_server_error', message: error.message })
    }
}
