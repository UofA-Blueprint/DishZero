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
} from '../services/dish'
import { CustomRequest } from '../middlewares/auth'
import { verifyIfUserAdmin } from '../services/users'
import { getAllTransactions } from '../services/transactions'

export const getDishes = async (req: Request, res: Response) => {
    let userClaims = (req as CustomRequest).firebase
    let all = req.query['all']?.toString()
    let withTransactions = req.query['transaction']?.toString()
    let borrowed = req.query['borrowed']?.toString()

    let allDishes = <Array<Dish>>[]
    try {
        allDishes = await getAllDishes()
        req.log.info({
            message: 'retrieved all transactions',
        })
    } catch (err: any) {
        req.log.error({
            error: err.message,
        })
        return res.status(500).json({ error: 'internal_server_error', message: err.message })
    }

    if (withTransactions !== 'true' && all == 'true') {
        if (!verifyIfUserAdmin(userClaims)) {
            req.log.error({
                message: 'User is not admin',
            })
            return res.status(403).json({ error: 'forbidden' })
        }

        req.log.info('sending all dishes to admin')
        return res.status(200).json({ allDishes})
    }

    // get transactions
    let transactions = <Array<Transaction>>[]
    try {
        transactions = await getAllTransactions()
    } catch (e) {
        req.log.error({
            error: e,
            message: 'Error when fetching dishes transactions from firebase',
        })
        return res.status(500).json({ error: 'internal_server_error' })
    }
    req.log.info({ message: 'retrieved transactions from firebase' })

    let dishTransMap = new Map<string, { transaction: Transaction; count: number }>()
    try {
        dishTransMap = mapDishesToLatestTransaction(transactions)
        req.log.info({ message: 'Mapped dishes to transactions' })
    } catch (e) {
        req.log.error({
            error: e,
            message: 'Error when mapping dishes to transactions',
        })
        return res.status(500).json({ error: 'internal_server_error' })
    }

    let userDishes
    if (withTransactions !== 'true') {
        try {
            if (borrowed == 'true') {
                userDishes = getAllUserDishesInUse(userClaims, allDishes, dishTransMap)
            } else {
                userDishes = getAllUserDishes(userClaims, allDishes, dishTransMap)
            }
        } catch (e) {
            req.log.error({
                error: e,
                message: 'error when getting user dishes'
            })
        }
        return res.status(200).json({ userDishes })
    }

    let allDishesVM = <Array<any>>[]
    try {
        allDishesVM = mapToDishVM(allDishes, dishTransMap)
        req.log.info({ message: 'Mapped transactions to view model' })
    } catch (e) {
        req.log.error({
            error: e,
            message: 'Error when mapping transactions to view model',
        })
        return res.status(500).json({ error: 'internal_server_error' })
    }
    req.log.info({ message: 'Sending dish data with transactions' })

    if (all == 'true') {
        if (!verifyIfUserAdmin(userClaims)) {
            req.log.error({
                message: 'User is not admin',
            })
            return res.status(403).json({ error: 'forbidden' })
        }

        req.log.info('sending all dishes to admin')
        return res.status(200).json({ allDishesVM })
    }

    let userDishesVM
    try {
        if (borrowed !== 'true') {
            userDishesVM = getAllUserDishesVM(userClaims, allDishesVM, dishTransMap)
        } else {
            userDishesVM = getAllUserDishesInUse(userClaims, allDishesVM, dishTransMap)
        }
    } catch (e) {
        req.log.error({
            error: e,
            message: 'error when getting user dishes view model'
        })
    }

    return res.status(200).json({ userDishesVM })
}
