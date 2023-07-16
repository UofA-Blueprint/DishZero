import Joi from 'joi'
import { Dish, DishStatus, DishTableVM } from '../models/dish'
import { Transaction } from '../models/transaction'
import { db } from './firebase'
import Logger from '../utils/logger'

export function mapDishesToLatestTransaction(
    transactions: Array<Transaction>
): Map<string, { transaction: Transaction; count: number }> {
    const map = new Map()
    transactions.forEach((transaction) => {
        if (transaction.dishID) {
            let dishID = transaction.dishID
            if (map.has(dishID)) {
                let curObj = map.get(dishID)
                let latestTransaction =
                    curObj.transaction.timestamp < transaction.timestamp ? curObj.transaction : transaction
                map.set(dishID, {
                    transaction: latestTransaction,
                    count: curObj.count + 1,
                })
            } else {
                map.set(dishID, {
                    transaction: transaction,
                    count: 1,
                })
            }
        }
    })

    return map
}

export function mapToDishVM(
    dishes: Array<Dish>,
    dishTransMap: Map<string, { transaction: Transaction; count: number }>
): Array<DishTableVM> {
    let allDishesVM = <Array<DishTableVM>>[]

    dishes.forEach((dish) => {
        const obj = dishTransMap.get(dish.id)
        const status = findDishStatus(obj?.transaction)
        // TO DO find overdue value
        allDishesVM.push({
            id: dish.id,
            type: dish.type,
            status: status,
            overdue: 0,
            timesBorrowed: obj?.count ? obj.count : 0,
            dateAdded: dish.registered,
        })
    })

    return allDishesVM
}

// this whole returned thing needs more explanation, why is it an object
function findDishStatus(transaction: Transaction | undefined): DishStatus {
    if (!transaction) {
        return DishStatus.returned
    }
    if (Object.keys(transaction).length == 0) {
        return DishStatus.inUse
    }

    if (transaction.returned?.broken) {
        return DishStatus.broken
    }

    // TODO: check for lost and overdue dishes

    return DishStatus.returned
}

export const validateDishRequestBody = (dish: Dish) => {
    const schema = Joi.object({
        qid: Joi.number().required(),
        registered: Joi.string(),
        type: Joi.string().required(),
    })
    return schema.validate(dish)
}

export const createDishInDatabase = async (dish: Dish) => {
    console.log(dish)
    let validation = validateDishRequestBody(dish)
    if (validation.error) {
        Logger.error({
            module: 'dish.services',
            message: 'Invalid dish request body',
            statusCode: 400,
        })
        throw new Error(validation.error.message)
    }

    // set registered date to current date if not provided
    if (!dish.registered) {
        dish.registered = new Date().toISOString()
    }

    let createdDish = await db.collection('dishes').add(dish)
    Logger.info({
        module: 'dish.services',
        message: 'Created dish in database',
    })

    return {
        ...dish,
        id: createdDish.id,
    }
}
