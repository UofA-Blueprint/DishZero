import { Request, Response } from 'express'
import { Dish } from '../models/dish'
import { Transaction } from '../models/transaction'
import {
    getDish,
    updateBorrowedStatus,
    getAllDishesSimple,
    createDishInDatabase,
    updateCondition,
    getAllDishes,
    getUserDishes,
    getUserDishesSimple,
    validateReturnDishRequestBody,
    getDishById,
} from '../services/dish'
import { CustomRequest } from '../middlewares/auth'

import Logger from '../utils/logger'
import { verifyIfUserAdmin } from '../services/users'
import { getTransaction, registerTransaction, getTransactionByDishId } from '../services/transactions';
import { getQrCode } from '../services/qrCode'
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
    let transaction = req.query['transaction']?.toString()
    let dishes
    
    // if all is true, check if user is admin, if yes return all dishes
    if (all == 'true') {
        if (!verifyIfUserAdmin(userClaims)) {
            Logger.error({
                module: 'dish.controller',
                message: 'User is not admin',
                statusCode: 403,
            })
            return res.status(403).json({ error: 'forbidden' })
        }

        try {
            if (transaction == 'true') {
                dishes = await getAllDishes()
            } else {
                dishes = await getAllDishesSimple()
            }
        } catch (error: any) {
            Logger.error({
                module: 'dish.controller',
                function: 'getDishes',
                error,
                message : 'error when getting dishes from firebase'
            })

            return res.status(500).json({ error: 'internal_server_error'})
        }
        
        Logger.info({
            module: 'dish.controller',
            function: 'getDishes',
            message: 'sending all dishes to admin'
        })

        return res.status(200).json({ dishes })
        
    }

    // return dishes that the user has currently borrowed
    try {
        if (transaction == 'true') {
            dishes = await getUserDishes(userClaims)
        } else {
            dishes = await getUserDishesSimple(userClaims)
        }

        return res.status(200).json({ dishes })
    } catch (error: any) {
        Logger.error({
            module: 'dish.controller',
            function: 'getDishes',
            error,
            message : 'error when getting user dishes from firebase'
        })

        return res.status(500).json({ error: 'internal_server_error'})
    }
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
        await updateBorrowedStatus(associatedDish, userClaims, true)

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
    let id = req.query['id']?.toString()
    if (!qid && !id) {
        Logger.error({
            module: 'dish.controller',
            message: 'No qid provided',
            statusCode: 400,
        })
        return res.status(400).json({ error: 'bad_request', message: "no dish_id provided" })
    }

    let validation = validateReturnDishRequestBody(req.body.returned)
    if (validation.error) {
        Logger.error({
            module: 'dish.controller',
            message: 'No values for broken or lost provided',
            statusCode: 400,         
        })

        return res.status(400).json({ error: 'bad_request', message: "no values for broken or lost provided" })
    }
    let { broken, lost } = req.body.returned

    let userClaims = (req as CustomRequest).firebase
    try {
        let qrCodeExits
        let associatedDish
        let ongoingTransaction

        if (qid) {
            // Check if the qr code exists
            qrCodeExits = await getQrCode(qid)
            if (!qrCodeExits) {
                Logger.error({
                    module: 'dish.controller',
                    message: 'qr code not found',
                })
                return res.status(400).json({ error: 'operation_not_allowed', message: 'qr code not found' })
            }
            // check if the borrowed property of the dish is true
            associatedDish = await getDish(parseInt(qid, 10))
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
            ongoingTransaction = await getTransaction(userClaims, parseInt(qid, 10))
            if (!ongoingTransaction) {
                Logger.error({
                    module: 'dish.controller',
                    message: 'Transaction not found',
                    function: 'returnDish',
                })
                return res.status(400).json({ error: 'operation_not_allowed', message: 'Transaction not found' })
            }

            await updateBorrowedStatus(associatedDish, userClaims, false)

            await db
                .collection('transactions')
                .doc(ongoingTransaction.id)
                .update({
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

            return res.status(200).json({ message: 'dish returned' })
        }

        associatedDish = await getDishById(id!)
        if (!associatedDish) {
            Logger.error({
                module: 'dish.controller',
                message: 'Dish not found',
            })
            return res.status(400).json({ error: 'operation_not_allowed', message: 'Dish not found' })
        }

        // Check if the borrowed property of the dish is true
        if (!associatedDish.borrowed) {
            Logger.error({
                module: 'dish.controller',
                message: 'Dish not borrowed',
                function: 'returnDish',
            })
            return res.status(400).json({ error: 'operation_not_allowed', message: 'Dish not borrowed' })
        }

        ongoingTransaction = await getTransactionByDishId(userClaims, id!)
        if (!ongoingTransaction) {
            Logger.error({
                module: 'dish.controller',
                message: 'Transaction not found',
                function: 'returnDish',
            })
            return res.status(400).json({ error: 'operation_not_allowed', message: 'Transaction not found' })
        }
        

        // update the borrowed property of the dish to false
        await updateBorrowedStatus(associatedDish, userClaims, false)

        await db
            .collection('transactions')
            .doc(ongoingTransaction.id)
            .update({
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
        
        return res.status(200).json({ message: 'dish returned' })
    }
}
