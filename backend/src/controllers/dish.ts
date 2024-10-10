import { Request, Response } from 'express'
import { DishCondition, DishStatus } from '../models/dish'
import { Transaction } from '../models/transaction'
import {
    getDish,
    updateBorrowedStatus,
    getAllDishesSimple,
    createDishInDatabase,
    addDishTypeToDatabase,
    updateCondition,
    getAllDishes,
    getUserDishes,
    getUserDishesSimple,
    validateReturnDishRequestBody,
    getDishById,
    validateUpdateConditonRequestBody,
    deleteDish,
    getAllDishTypes,
    batchCreateDishes,
    updateDishStatus,
    validateModifyDishStatus,
} from '../services/dish'
import { CustomRequest } from '../middlewares/auth'
import Logger from '../utils/logger'
import { getUserByEmail, getUserById, verifyIfUserAdmin, verifyIfUserVolunteer } from '../services/users'
import {
    registerTransaction,
    getLatestTransactionByTstamp,
    getLatestTransactionByTstampAndDishId,
} from '../services/transactions'
import { getQrCode } from '../services/qrCode'
import { db } from '../internal/firebase'
import nodeConfig from 'config'
import { User } from '../models/user'

export const getDishes = async (req: Request, res: Response) => {
    let userClaims = (req as CustomRequest).firebase
    let id = req.query['id']?.toString()
    let qid = req.query['qid']?.toString()

    if (id) {
        try {
            const dish = await getDishById(id)
            if (!dish) {
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
            return res.status(200).json({ dish: dish })
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
    } else if (qid) {
        try {
            let dish = await getDish(parseInt(qid, 10))
            if (!dish) {
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
            return res.status(200).json({ dish })
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
    let withEmail = req.query['withEmail']?.toString() === 'true'
    let transaction = req.query['transaction']?.toString()
    let dishes: any

    // if all is true, check if user is admin, if yes return all dishes
    if (all === 'true') {
        if (!verifyIfUserAdmin(userClaims)) {
            Logger.error({
                module: 'dish.controller',
                message: 'User is not admin',
                statusCode: 403,
            })
            return res.status(403).json({ error: 'forbidden' })
        }

        try {
            if (transaction === 'true') {
                dishes = await getAllDishes(withEmail)
            } else {
                dishes = await getAllDishesSimple()
            }
        } catch (error: any) {
            Logger.error({
                module: 'dish.controller',
                function: 'getDishes',
                error,
                message: 'error when getting dishes from firebase',
            })

            return res.status(500).json({ error: 'internal_server_error' })
        }

        Logger.info({
            module: 'dish.controller',
            function: 'getDishes',
            message: 'sending all dishes to admin',
        })
        return res.status(200).json({ dishes })
    }

    // return dishes that the user has currently borrowed
    try {
        if (transaction === 'true') {
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
            message: 'error when getting user dishes from firebase',
        })

        return res.status(500).json({ error: 'internal_server_error' })
    }
}

export const getDishTypes = async (req: Request, res: Response) => {
    let userClaims = (req as CustomRequest).firebase

    if (!verifyIfUserAdmin(userClaims)) {
        Logger.error({
            module: 'dish.controller',
            message: 'User is not admin',
            statusCode: 403,
        })
        return res.status(403).json({ error: 'forbidden' })
    }

    let dishTypes
    try {
        dishTypes = await getAllDishTypes()
    } catch (error: any) {
        Logger.error({
            module: 'dish.controller',
            function: 'getDishTypes',
            error,
            message: 'error when getting dish types from firebase',
        })

        return res.status(500).json({ error: 'internal_server_error' })
    }
    return res.status(200).json({ dishTypes })
}

export const deleteDishes = async (req: Request, res: Response) => {
    let userClaims = (req as CustomRequest).firebase
    if (!verifyIfUserAdmin(userClaims)) {
        Logger.error({
            module: 'dish.controller',
            message: 'User is not admin',
            statusCode: 403,
        })
        return res.status(403).json({ error: 'forbidden' })
    }

    let dishIds = req.body.dishIds
    if (!dishIds) {
        Logger.error({
            module: 'dish.controller',
            message: 'No dishIds provided',
            statusCode: 400,
        })
        return res.status(400).json({ error: 'bad_request' })
    }

    try {
        for (let qid of dishIds) {
            let dish = await getDish(parseInt(qid, 10))
            // let dish = await getDishById(id)
            if (!dish) {
                Logger.error({
                    module: 'dish.controller',
                    message: 'Dish not found',
                    statusCode: 400,
                })
                return res.status(400).json({ error: 'bad_request' })
            }
            if (dish.status === DishStatus.borrowed) {
                Logger.error({
                    module: 'dish.controller',
                    message: 'Dish is borrowed',
                    statusCode: 400,
                })
                return res.status(400).json({ error: 'bad_request' })
            }

            deleteDish(parseInt(qid, 10))
        }

        Logger.info({
            module: 'dish.controller',
            message: 'Successfully deleted dishes',
        })
        return res.status(200).json({ message: 'dishes deleted' })
    } catch (error: any) {
        Logger.error({
            module: 'dish.controller',
            error,
            message: 'Error when deleting dishes',
            statusCode: 500,
        })
        return res.status(500).json({ error: 'internal_server_error', message: error.message })
    }
}

export const createMultipleDishes = async (req: Request, res: Response) => {
    let userClaims = (req as CustomRequest).firebase
    if (!verifyIfUserAdmin(userClaims)) {
        Logger.error({
            module: 'dish.controller',
            message: 'User is not admin',
            statusCode: 403,
        })
        return res.status(403).json({ error: 'forbidden' })
    }

    let dishType = req.body.type
    let dishIdLower = req.body.dishIdLower as number
    let dishIdUpper = req.body.dishIdUpper as number

    try {
        const response = await batchCreateDishes(dishIdLower, dishIdUpper, dishType)
        return res.status(200).json({ response })
    } catch (error: any) {
        Logger.error({
            module: 'dish.controller',
            error,
            message: 'Error when adding dishes to database',
            statusCode: 500,
        })
        return res.status(500).json({ error: 'internal_server_error', message: error.message })
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

export const addDishType = async (req: Request, res: Response) => {
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
        let response = await addDishTypeToDatabase(req.body.type)
        return res.status(200).json({ response })
    } catch (error: any) {
        Logger.error({
            module: 'dish.controller',
            error,
            message: 'Error when adding a new dish type to the database',
            statusCode: 500,
        })
        return res.status(500).json({ error: 'internal_server_error', message: error.message })
    }
}

export const borrowDish = async (req: Request, res: Response) => {
    let qid = req.query['qid']?.toString()
    let email = req.query['email']?.toString()

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

        if (associatedDish.status === DishStatus.borrowed) {
            Logger.error({
                module: 'dish.controller',
                message: 'Dish already borrowed',
            })
            return res.status(400).json({ error: 'operation_not_allowed', message: 'Dish already borrowed' })
        }
        const user = email ? ((await getUserByEmail(email!)) as User) : ((await getUserById(userClaims.uid)) as User)
        let transaction: Transaction = {
            dish: {
                qid: associatedDish.qid,
                id: associatedDish.id,
                type: associatedDish.type,
            },
            user: user,
            returned: {
                condition: DishCondition.good,
                timestamp: '',
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
        return res.status(400).json({ error: 'bad_request', message: 'no dish_id provided' })
    }

    let validation = validateReturnDishRequestBody(req.body.returned)
    if (validation.error) {
        Logger.error({
            module: 'dish.controller',
            message: 'No values for condition provided',
            statusCode: 400,
        })

        return res.status(400).json({ error: 'bad_request', message: 'no values for condition provided' })
    }
    let { condition } = req.body.returned

    let userClaims = (req as CustomRequest).firebase
    if (!verifyIfUserAdmin(userClaims) && !verifyIfUserVolunteer(userClaims)) {
        Logger.error({
            module: 'dish.controller',
            message: 'User is not admin',
            statusCode: 403,
        })
        return res.status(403).json({ error: 'forbidden' })
    }
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

            if (associatedDish.status !== DishStatus.borrowed) {
                Logger.error({
                    module: 'dish.controller',
                    message: 'Dish not borrowed',
                    function: 'returnDish',
                })
                return res.status(400).json({ error: 'operation_not_allowed', message: 'Dish not borrowed' })
            }

            // update the existing transaction with the returned property
            ongoingTransaction = await getLatestTransactionByTstamp(parseInt(qid, 10))
            if (!ongoingTransaction) {
                Logger.error({
                    module: 'dish.controller',
                    message: 'Transaction not found',
                    function: 'returnDish',
                })
                return res.status(400).json({ error: 'operation_not_allowed', message: 'Transaction not found' })
            }

            await updateBorrowedStatus(associatedDish, userClaims, false, condition)

            await db
                .collection(nodeConfig.get('collections.transactions'))
                .doc(ongoingTransaction.id)
                .update({
                    returned: {
                        condition,
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
        if (associatedDish.status !== DishStatus.borrowed) {
            Logger.error({
                module: 'dish.controller',
                message: 'Dish not borrowed',
                function: 'returnDish',
            })
            return res.status(400).json({ error: 'operation_not_allowed', message: 'Dish not borrowed' })
        }
        ongoingTransaction = await getLatestTransactionByTstampAndDishId(id!)
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
            .collection(nodeConfig.get('collections.transactions'))
            .doc(ongoingTransaction.id)
            .update({
                returned: {
                    condition,
                    timestamp: new Date().toISOString(),
                },
            })

        Logger.info({
            module: 'dish.controller',
            message: 'Successfully returned dish',
            function: 'returnDish',
        })

        return res.status(200).json({ message: 'dish returned' })
    } catch (error: any) {
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
    // get id and condition
    let id = req.query['id']?.toString()
    if (!id) {
        Logger.error({
            module: 'dish.controller',
            message: 'No qid provided',
            statusCode: 400,
        })
        return res.status(400).json({ error: 'bad_request', message: 'dish_id not provided' })
    }

    let validation = validateUpdateConditonRequestBody(req.body)
    if (validation.error) {
        Logger.error({
            module: 'dish.controller',
            error: validation.error,
            message: 'No values for condition provided',
            statusCode: 400,
        })

        return res.status(400).json({ error: 'bad_request', message: 'validation for condition failed' })
    }

    let condition = req.body.condition
    if (!condition) {
        Logger.error({
            module: 'dish.controller',
            message: 'No condition provided',
            statusCode: 400,
        })
        return res.status(400).json({ error: 'bad_request', message: 'condition not provided' })
    }

    // check if the dish exists
    // if yes, update it with condition
    try {
        let associatedDish = await getDishById(id)
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
            message: 'successfully updated dish condition',
        })

        return res.status(200).json({ message: 'updated condition' })
    } catch (error: any) {
        Logger.error({
            module: 'dish.controller',
            function: 'updateDishCondition',
            error,
            message: 'Error when updating dish condition',
        })

        return res.status(200).json({ message: 'dish condition updated' })
    }
}
export const modifyDishStatus = async (req: Request, res: Response) => {
    let userClaims = (req as CustomRequest).firebase
    if (!verifyIfUserAdmin(userClaims)) {
        Logger.error({
            module: 'dish.controller',
            message: 'User is not admin',
            statusCode: 403,
        })
        return res.status(403).json({ error: 'forbidden' })
    }

    let validation = validateModifyDishStatus(req.body)
    if (validation.error) {
        Logger.error({
            module: 'dish.controller',
            error: validation.error,
            message: 'Validation for modify dish status failed',
            statusCode: 400,
        })

        return res.status(400).json({ error: 'bad_request', message: 'validation for modify dish status failed' })
    }

    const { id, oldStatus, newStatus } = req.body

    try {
        let response = await updateDishStatus(id, oldStatus, newStatus)
        return res.status(200).json({ response })
    } catch (error: any) {
        Logger.error({
            module: 'dish.controller',
            error,
            message: 'Error when modifying dish',
            statusCode: 500,
        })
        return res
            .status(500)
            .json({ error: 'internal_server_error', message: error.message ?? 'Unexpected error occurred' })
    }
}
