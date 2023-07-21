import { Request, Response } from 'express'

import { Dish } from '../models/dish'
import { Transaction } from '../models/transaction'
import {
    getAllDishes,
    getAllUserDishes,
    getAllUserDishesInUse,
    getAllUserDishesVM,
    mapDishesToLatestTransaction,
    mapToDishVM,
    createDishInDatabase
} from '../services/dish'
import { CustomRequest } from '../middlewares/auth'
import { getAllTransactions } from '../services/transactions'
import Logger from '../utils/logger'
import { verifyIfUserAdmin } from '../services/users'
import { db } from '../services/firebase'

export const getDishes = async (req: Request, res: Response) => {
    let userClaims = (req as CustomRequest).firebase
    let id = req.query['id']?.toString()

    if (id) {
        try {
            let dish = await db.collection('dishes').doc(id).get()
            if (!dish.exists) {
                Logger.error({
                    message: 'Dish does not exist',
                    statusCode: 404,
                    module: 'dish.controller',
                    function: 'getDishes',
                })
                return res.status(400).json({ error: 'dish_not_found' })
            }
            Logger.info({
                message: 'retrieved dish',
                module: 'dish.controller',
                function: 'getDishes',
            })
            return res.status(200).json({ dish: dish.data() })
        } catch (error: any) {
            Logger.error({
                message: 'Error when retrieving dish',
                error,
                statusCode: 500,
                module: 'dish.controller',
                function: 'getDishes',
            })
            return res.status(500).json({ error: 'internal_server_error', message: error.message })
        }
    }

    let all = req.query['all']?.toString()
    let withTransactions = req.query['transaction']?.toString()
    let borrowed = req.query['borrowed']?.toString()

    let allDishes = <Array<Dish>>[]
    try {
        allDishes = await getAllDishes()
        Logger.info({
            message: 'retrieved all dishes',
        })
    } catch (err: any) {
        Logger.error({
            error: err.message,
            statusCode: 500
        })
        return res.status(500).json({ error: 'internal_server_error', message: err.message })
    }

    if (withTransactions !== 'true' && all === 'true') {
        if (!verifyIfUserAdmin(userClaims)) {
            Logger.error({
                message: 'User is not admin',
                statusCode: 403
            })
            return res.status(403).json({ error: 'forbidden' })
        }

        Logger.info('sending all dishes to admin')
        return res.status(200).json({ dishes: allDishes})
    }

    // get transactions
    let transactions = <Array<Transaction>>[]
    try {
        transactions = await getAllTransactions()
    } catch (e) {
        Logger.error({
            error: e,
            message: 'Error when fetching dishes transactions from firebase',
            statusCode: 500,
        })
        return res.status(500).json({ error: 'internal_server_error' })
    }
    Logger.info({ message: 'retrieved transactions from firebase' })

    let dishTransMap = new Map<string, { transaction: Transaction; count: number }>()
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
        } catch (e) {
            Logger.error({
                error: e,
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
        Logger.info({ message: 'Mapped transactions to view model' })
    } catch (e) {
        Logger.error({
            error: e,
            message: 'Error when mapping transactions to view model',
            statusCode: 500,
        })
        return res.status(500).json({ error: 'internal_server_error' })
    }
    Logger.info({ message: 'Sending dish data with transactions' })

    if (all === 'true') {
        if (!verifyIfUserAdmin(userClaims)) {
            Logger.error({
                message: 'User is not admin',
                statusCode: 403
            })
            return res.status(403).json({ error: 'forbidden' })
        }

        Logger.info('sending all dishes to admin')
        return res.status(200).json({ dishes: allDishesVM })
    }

    let userDishesVM
    try {
        if (borrowed !== 'true') {
            userDishesVM = getAllUserDishesVM(userClaims, allDishesVM, dishTransMap)
        } else {
            userDishesVM = getAllUserDishesInUse(userClaims, allDishesVM, dishTransMap)
        }
    } catch (e) {
        Logger.error({
            error: e,
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
