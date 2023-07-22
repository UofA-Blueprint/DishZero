import Joi from 'joi'
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier'
import { Dish, DishSimple, DishStatus, DishTableVM } from '../models/dish'
import { Transaction } from '../models/transaction'
import { db } from './firebase'
import Logger from '../utils/logger'

export async function getAllDishesSimple(): Promise<Array<DishSimple>> {
    let dishData = <Array<DishSimple>>[]
    let dishesQuerySnapshot = await db.collection('dishes').get()
    dishesQuerySnapshot.docs.forEach((doc) => {
        let data = doc.data()
        let time = data.registered

        if (typeof time !== 'string') {
            // assuming it's a firebase timestamp
            time = time.toDate().toISOString()
        }

        dishData.push({
            id: doc.id,
            qid: parseInt(data.qid, 10),
            registered: time, // change from nanosecond
            type: data.type,        // type is required
        })
    })
    Logger.info({
        module: 'dish.services',
        function: 'getAllDishesSimple',
        message: "got all dishes from firebase"
    })
    return dishData
}

export async function getUserDishesSimple(userClaims : DecodedIdToken): Promise<Array<DishSimple>> {
    let dishData = <Array<DishSimple>>[]
    let dishesQuerySnapshot = await db.collection('dishes').where('user', '==', userClaims.uid).get()
    dishesQuerySnapshot.docs.forEach((doc) => {
        let data = doc.data()
        let time = data.registered

        if (typeof time !== 'string') {
            // assuming it's a firebase timestamp
            time = time.toDate().toISOString()
        }

        dishData.push({
            id: doc.id,
            qid: parseInt(data.qid, 10),
            registered: time, // change from nanosecond
            type: data.type,        // type is required
        })
    })
    Logger.info({
        module: 'dish.services',
        function: 'getUserDishesSimple',
        message: `got all dishes from firebase for user ${userClaims.uid}`
    })
    return dishData
}

export async function getAllDishes() : Promise<Array<Dish>> {
    let dishData = <Array<Dish>>[]
    let dishesQuerySnapshot = await db.collection('dishes').get()
    dishesQuerySnapshot.docs.forEach((doc) => {
        let data = doc.data()
        let time = data.registered

        if (typeof time !== 'string') {
            // assuming it's a firebase timestamp
            time = time.toDate().toISOString()
        }

        dishData.push({
            id: doc.id,
            qid: parseInt(data.qid, 10),
            registered: time,
            type: data.type,
            borrowed: data.borrowed ? data.borrowed : false,
            timesBorrowed : data.timesBorrowed ? data.timesBorrowed : 0,
            status : data.status ? data.status : DishStatus.available,
            condition : data.condition ? data.condition : '',
            userID : data.userID ? data.userID : null
        })
    })
    Logger.info({
        module: 'dish.services',
        function: 'getAllDishesSimple',
        message: "got all dishes from firebase"
    })
    return dishData
}

export async function getUserDishes(userClaims : DecodedIdToken) : Promise<Array<Dish>> {
    let dishData = <Array<Dish>>[]
    let dishesQuerySnapshot = await db.collection('dishes').where('user', '==', userClaims.uid).get()
    dishesQuerySnapshot.docs.forEach((doc) => {
        let data = doc.data()
        let time = data.registered

        if (typeof time !== 'string') {
            // assuming it's a firebase timestamp
            time = time.toDate().toISOString()
        }

        dishData.push({
            id: doc.id,
            qid: parseInt(data.qid, 10),
            registered: time,
            type: data.type,
            borrowed: data.borrowed ? data.borrowed : false,
            timesBorrowed : data.timesBorrowed ? data.timesBorrowed : 0,
            status : data.status ? data.status : DishStatus.available,
            condition : data.condition ? data.condition : '',
            userID : data.user ? data.user : null
        })
    })
    Logger.info({
        module: 'dish.services',
        function: 'getUserDishes',
        message: `got all dishes from firebase for user ${userClaims.uid}`
    })
    return dishData 
}


// this whole returned thing needs more explanation, why is it an object
function findDishStatus(transaction: Transaction | undefined): DishStatus {
    if (!transaction || !transaction.returned) {
        return DishStatus.returned
    }
    if (Object.keys(transaction.returned).length !== 0) {
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

export const getDish = async (qid: number) => {
    const snapshot = await db.collection('dishes').where('qid', '==', qid).get()
    if (snapshot.empty) {
        return null
    }
    let data = snapshot.docs[0].data()
    return {
        id: snapshot.docs[0].id,
        qid: data.qid,
        registered: data.registered,
        type: data.type,
        borrowed: data.borrowed,
    }
}

export const createDishInDatabase = async (dish: Dish) => {
    let validation = validateDishRequestBody(dish)
    if (validation.error) {
        Logger.error({
            module: 'dish.services',
            message: 'Invalid dish request body',
        })
        throw new Error(validation.error.message)
    }

    // check if dish with qid already exists
    let existingDish = await getDish(dish.qid)
    if (existingDish) {
        Logger.error({
            module: 'dish.services',
            message: 'Dish with qid already exists',
        })
        throw new Error('Dish with qid already exists')
    }

    // set registered date to current date if not provided
    if (!dish.registered) {
        dish.registered = new Date().toISOString()
    }

    // new dishes are not borrowed and always set to false
    dish.borrowed = false
    dish.timesBorrowed = 0
    dish.status = DishStatus.available

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

export const updateBorrowedStatus = async (id: string, borrowed: boolean) => {
    await db.collection('dishes').doc(id).update({ borrowed })
    Logger.info({
        module: 'dish.services',
        message: 'Updated borrowed status',
    })
}

export const updateCondition = async (id: string, condition: string) => {
    await db.collection('dishes').doc(id).update({ condition })
}