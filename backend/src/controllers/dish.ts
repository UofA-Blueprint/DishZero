import { Request, Response } from 'express'
import { Dish } from '../models/dish'
import { Transaction } from '../models/transaction'
import {
    getDish,
    updateBorrowedStatus,
    getAllDishes,
    getAllUserDishes,
    getAllUserDishesInUse,
    getAllUserDishesVM,
    mapDishesToLatestTransaction,
    mapToDishVM,
    createDishInDatabase,
    updateCondition
} from '../services/dish'
import { CustomRequest } from '../middlewares/auth'
import { getAllTransactions } from '../services/transactions'
import Logger from '../utils/logger'
import { verifyIfUserAdmin } from '../services/users'
import { getTransaction, registerTransaction } from '../services/transactions'
import { getQrCode } from '../services/qrCode'
import { db } from '../services/firebase'

export const getDishes = async (req: Request, res: Response) => {
    let userClaims = (req as CustomRequest).firebase
    let all = req.query['all']?.toString()
    let withTransactions = req.query['transaction']?.toString()
    let borrowed = req.query['borrowed']?.toString()

    let allDishes = <Array<Dish>>[]
    try {
        allDishes = await getAllDishes()
        Logger.info({
            module: 'dish.controller',
            function: 'getDishes',
            message: 'retrieved all dishes',
        })
    } catch (error: any) {
        Logger.error({
            module: 'dish.controller',
            function: 'getDishes',
            message: 'error when getting all dishes',
            error,
            statusCode: 500
        })
        return res.status(500).json({ error: 'internal_server_error', message: error.message })
    }

    if (withTransactions !== 'true' && all === 'true') {
        if (!verifyIfUserAdmin(userClaims)) {
            Logger.error({
                module: 'dish.controller',
                function: 'getDishes',
                message: 'User is not admin',
                statusCode: 403
            })
            return res.status(403).json({ error: 'forbidden' })
        }

        Logger.info({
            module: 'dish.controller',
            function: 'getDishes',
            message: 'sending all dishes to admin'
        })
        return res.status(200).json({ dishes: allDishes})
    }

    // get transactions
    let transactions = <Array<Transaction>>[]
    try {
        transactions = await getAllTransactions()
    } catch (error: any) {
        Logger.error({
            module: 'dish.controller',
            function: 'getDishes',
            error,
            message: 'Error when fetching dishes transactions from firebase',
            statusCode: 500,
        })
        return res.status(500).json({ error: 'internal_server_error' })
    }
    Logger.info({ 
        module: 'dish.controller',
        function: 'getDishes',
        message: 'retrieved transactions from firebase'
    })

    let dishTransMap = new Map<string, { transaction: Transaction; count: number }>()
    try {
        dishTransMap = mapDishesToLatestTransaction(transactions)
        Logger.info({
            module: 'dish.controller',
            function: 'getDishes',
            message: 'Mapped dishes to transactions',
        })
    } catch (error: any) {
        Logger.error({
            module: 'dish.controller',
            function: 'getDishes',
            error,
            message: 'Error when mapping dishes to transactions',
            statusCode: 500,
        })
        return res.status(500).json({ error: 'internal_server_error' })
    }

    let userDishes
    if (withTransactions !== 'true') {
        try {
            if (borrowed === 'true') {
                userDishes = getAllUserDishesInUse(userClaims, allDishes, dishTransMap)
            } else {
                userDishes = getAllUserDishes(userClaims, allDishes, dishTransMap)
            }
        } catch (error: any) {
            Logger.error({
                module: 'dish.controller',
                function: 'getDishes',
                error,
                message: 'error when getting user dishes',
                statusCode: 500
            })
            return res.status(500).json({ error: 'internal_server_error' })
        }
        return res.status(200).json({ dishes: userDishes })
    }

    let allDishesVM = <Array<any>>[]
    try {
        allDishesVM = mapToDishVM(allDishes, dishTransMap)
        Logger.info({ 
            module: 'dish.controller',
            function: 'getDishes',
            message: 'Mapped transactions to view model' 
        })
    } catch (error: any) {
        Logger.error({
            module: 'dish.controller',
            function: 'getDishes',
            error,
            message: 'Error when mapping transactions to view model',
            statusCode: 500,
        })
        return res.status(500).json({ error: 'internal_server_error' })
    }
    Logger.info({ 
        module: 'dish.controller',
        function: 'getDishes',
        message: 'Sending dish data with transactions' 
    })

    if (all === 'true') {
        if (!verifyIfUserAdmin(userClaims)) {
            Logger.error({
                module: 'dish.controller',
                function: 'getDishes',
                message: 'User is not admin',
                statusCode: 403
            })
            return res.status(403).json({ error: 'forbidden' })
        }

        Logger.info({
            module: 'dish.controller',
            function: 'getDishes',
            message: 'sending all dishes to admin'
        })
        return res.status(200).json({ dishes: allDishesVM })
    }

    let userDishesVM
    try {
        if (borrowed !== 'true') {
            userDishesVM = getAllUserDishesVM(userClaims, allDishesVM, dishTransMap)
        } else {
            userDishesVM = getAllUserDishesInUse(userClaims, allDishesVM, dishTransMap)
        }
    } catch (error: any) {
        Logger.error({
            module: 'dish.controller',
            function: 'getDishes',
            error,
            message: 'error when getting user dishes view model',
            statusCode: 500
        })
        return res.status(500).json({ error: 'internal_server_error' })
    }

    return res.status(200).json({ dishes: userDishesVM })
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
            function: 'borrowDish',
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
            function: 'returnDish',
            error,
            message: 'Error when returning dish',
        })
        return res.status(500).json({ error: 'internal_server_error', message: error.message })
    }
}

export const updateDishCondition = async (req: Request, res: Response) => {
    // get qid and condition
    let qid = req.query['qid']?.toString()
    if (!qid) {
        Logger.error({
            module: 'dish.controller',
            message: 'No qid provided',
            statusCode: 400,
        })
        return res.status(400).json({ error: 'bad_request' })
    }

    let condition = req.body.condition
    if (!condition) {
        Logger.error({
            module: 'dish.controller',
            message: 'No condition provided',
            statusCode: 400,
        })
        return res.status(400).json({ error: 'bad_request' })
    }

    // check if the dish exists
    // if yes, update it with condition
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

        await updateCondition(associatedDish.id, condition)

        Logger.info({
            module: 'dish.controller',
            function: 'updateDishCondition',
            message: 'successfully updated dish condition'
        })

        return res.status(200).json({message : "updated condition"})
    } catch(error: any) {
        Logger.error({
            module: 'dish.controller',
            function: 'updateDishCondition',
            error,
            message: 'Error when updating dish condition',
        })
        return res.status(500).json({ error: 'internal_server_error', message: error.message })
    }
}
