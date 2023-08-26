import Joi from 'joi'
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier'
import { Condition, Dish, DishSimple, DishStatus, DishTableVM } from '../models/dish'
import { Transaction } from '../models/transaction'
import { db } from './firebase'
import Logger from '../utils/logger'

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
        timesBorrowed: data.timesBorrowed,
        status: data.status,
        userId: data.userId,
    }
}

export const getDishById = async (id: string): Promise<Dish | null | undefined> => {
    const snapshot = await db.collection('dishes').doc(id).get()
    if (!snapshot.exists) {
        return null
    }
    return {
        id: snapshot.id,
        qid: snapshot.data()?.qid,
        registered: snapshot.data()?.registered,
        type: snapshot.data()?.type,
        borrowed: snapshot.data()?.borrowed,
        timesBorrowed: snapshot.data()?.timesBorrowed,
        status: snapshot.data()?.status,
        userId: snapshot.data()?.userId,
    }
}

export const createDishInDatabase = async (dish: Dish) => {
    let validation = validateDishRequestBody(dish)
    console.log(validation)
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
    dish.userId = null

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

export async function getAllDishesSimple(): Promise<Array<Dish>> {
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
            registered: time, // change from nanosecond
            type: data.type, // type is required
            borrowed: data.borrowed,
            timesBorrowed: data.timesBorrowed,
            status: data.status,
            userId: data.userId,
        })
    })
    Logger.info({
        module: 'dish.services',
        function: 'getAllDishesSimple',
        message: 'got all dishes from firebase',
    })
    return dishData
}

export async function getUserDishesSimple(userClaims: DecodedIdToken): Promise<Array<Dish>> {
    let dishData = <Array<Dish>>[]
    let dishesQuerySnapshot = await db.collection('dishes').where('userId', '==', userClaims.uid).get()
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
            type: data.type, // type is required
            borrowed: data.borrowed,
            timesBorrowed: data.timesBorrowed,
            status: data.status,
            userId: data.userId,
        })
    })
    Logger.info({
        module: 'dish.services',
        function: 'getUserDishesSimple',
        message: `got all dishes from firebase for user ${userClaims.uid}`,
    })
    return dishData
}

export async function getAllDishes(): Promise<Array<Dish>> {
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
            timesBorrowed: data.timesBorrowed ? data.timesBorrowed : 0,
            status: data.status ? data.status : DishStatus.available,
            condition: data.condition ? data.condition : '',
            userId: data.userId ? data.userId : null,
        })
    })
    Logger.info({
        module: 'dish.services',
        function: 'getAllDishesSimple',
        message: 'got all dishes from firebase',
    })
    return dishData
}

export async function getUserDishes(userClaims: DecodedIdToken): Promise<Array<Dish>> {
    let dishData = <Array<Dish>>[]
    let dishesQuerySnapshot = await db.collection('dishes').where('userId', '==', userClaims.uid).get()
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
            timesBorrowed: data.timesBorrowed ? data.timesBorrowed : 0,
            status: data.status ? data.status : DishStatus.available,
            condition: data.condition ? data.condition : '',
            userId: data.user ? data.user : null,
        })
    })
    Logger.info({
        module: 'dish.services',
        function: 'getUserDishes',
        message: `got all dishes from firebase for user ${userClaims.uid}`,
    })
    return dishData
}

export const validateDishRequestBody = (dish: Dish) => {
    const schema = Joi.object({
        qid: Joi.number().required(),
        registered: Joi.string(),
        type: Joi.string().required(),
    }).required()

    return schema.validate(dish)
}

export const validateReturnDishRequestBody = (dish: Dish) => {
    const schema = Joi.object({
        condition: Joi.string()
            .valid(Condition.smallChip, Condition.largeCrack, Condition.shattered, Condition.alright)
            .required(),
    }).required()

    return schema.validate(dish)
}

export const validateUpdateConditonRequestBody = (body: Object) => {
    const schema = Joi.object({
        condition: Joi.string()
            .valid(Condition.smallChip, Condition.largeCrack, Condition.shattered, Condition.alright)
            .required(),
    }).required()

    return schema.validate(body)
}

export const updateBorrowedStatus = async (
    dish: Dish,
    userClaims: DecodedIdToken,
    borrowed: boolean,
    condition?: string
) => {
    // when borrowing, set userId and increase timesBorrowed
    let timesBorrowed = borrowed ? dish.timesBorrowed + 1 : dish.timesBorrowed
    let userId = borrowed ? userClaims.uid : null
    let dishCondition
    if (condition) {
        dishCondition = condition
    } else {
        dishCondition = Condition.alright
    }
    await db.collection('dishes').doc(dish.id).update({
        condition: dishCondition,
        borrowed,
        timesBorrowed,
        userId,
    })
    Logger.info({
        module: 'dish.services',
        message: 'Updated borrowed status',
    })
}

export const updateCondition = async (id: string, condition: string) => {
    await db.collection('dishes').doc(id).update({ condition })
}
