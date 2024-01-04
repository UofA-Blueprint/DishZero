import Joi from 'joi'
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier'
import { DishCondition, Dish, DishStatus } from '../models/dish'
import { db } from '../internal/firebase'
import Logger from '../utils/logger'

export const getDish = async (qid: number): Promise<Dish | undefined | null> => {
    const snapshot = await db.collection('dishes').where('qid', '==', qid).get()
    if (snapshot.empty) {
        return null
    }
    let data = snapshot.docs[0].data()
    data.id = snapshot.docs[0].id
    return data as Dish
}

export const getAllDishTypes = async (): Promise<string[] | null> => {
    // const snapshot = await db.collection('dish-types').get()
    const snapshot = await db.collection('dish-types').get()
    if (snapshot.empty) {
        return null
    }
    let dishTypes = snapshot.docs.map((doc) => doc.id)
    return dishTypes
}

export const deleteDish = async (qid: number): Promise<void> => {
    const snapshot = await db.collection('dishes').where('qid', '==', qid).get()
    if (snapshot.empty) {
        return
    }
    await db.collection('dishes').doc(snapshot.docs[0].id).delete()
}

export const getDishById = async (id: string): Promise<Dish | null | undefined> => {
    const snapshot = await db.collection('dishes').doc(id).get()
    if (!snapshot.exists) {
        return null
    }

    let data = snapshot.data()
    data!.id = snapshot.id
    return data as Dish
}

export const createDishInDatabase = async (dish: Partial<Dish>) => {
    let validation = validateDishCreateRequestBody(dish)
    console.log(validation)
    if (validation.error) {
        Logger.error({
            module: 'dish.services',
            message: 'Invalid dish request body',
        })
        throw new Error(validation.error.message)
    }

    // check if dish with qid already exists
    let existingDish = await getDish(dish.qid!)
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
    dish.timesBorrowed = 0
    dish.status = DishStatus.available
    dish.userId = null
    dish.borrowedAt = null

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

export const batchCreateDishes = async (dishIdLower: number, dishIdUpper: number, dishType: string) => {
    let validation = validateBatchCreate(dishIdLower, dishIdUpper, dishType)
    if (validation.error) {
        Logger.error({
            module: 'dish.services',
            message: 'Invalid dish batch create request body',
        })
        throw new Error(validation.error.message)
    }
    const batch = db.batch()
    let existingDishes = []

    for (let dishId = dishIdLower; dishId <= dishIdUpper; dishId++) {
        // check if dish with qid already exists
        let existingDish = await getDish(dishId)
        if (existingDish) {
            existingDishes.push(dishId)
            continue
        }

        let dish = {
            qid: dishId,
            type: dishType,
            // borrowed: false,
            timesBorrowed: 0,
            status: DishStatus.available,
            userId: null,
            borrowedAt: null,
            registered: new Date().toISOString(),
        }

        const dishRef = db.collection('dishes').doc()
        batch.set(dishRef, dish)
    }

    try {
        const response = await batch.commit()
        // response['existingDishes'] = existingDishes
        // return response
        const responseWithExistingDishes = { ...response, existingDishes }
        return responseWithExistingDishes
    } catch (error: any) {
        console.error('Error adding batch of dishes: ', error)
        return error
    }
}

export const addDishTypeToDatabase = async (type: string) => {
    let validation = validateDishType(type)
    if (validation.error) {
        Logger.error({
            module: 'dish.services',
            message: 'Invalid dish type request body',
        })
        throw new Error(validation.error.message)
    }
    const newDishType = await db.collection('dish-types').doc(type).set({})
    Logger.info({
        module: 'dish.services',
        message: 'Created new dish type in database',
    })

    return {
        ...newDishType,
    }
}

export async function getAllDishesSimple(): Promise<Array<Partial<Dish>>> {
    let dishData = <Array<Partial<Dish>>>[]
    let dishesQuerySnapshot = await db.collection('dishes').orderBy('qid').get()
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
            // borrowed: data.borrowed,
            timesBorrowed: data.timesBorrowed,
            status: data.status,
            userId: data.userId,
            borrowedAt: data.borrowedAt ?? null,
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
    let dishesQuerySnapshot = await db.collection('dishes').orderBy('qid').get()
    for (let doc of dishesQuerySnapshot.docs) {
        let data = doc.data()
        let time = data.registered

        if (typeof time !== 'string') {
            // assuming it's a firebase timestamp
            time = time.toDate().toISOString()
        }

        // get user email (this adds a lot of time to the request)
        let userEmail
        if (data.userId) {
            let userDoc = await db.collection('users').doc(data.userId).get()
            if (userDoc.exists) {
                userEmail = userDoc.data()?.email
            }
        }

        dishData.push({
            id: doc.id,
            qid: parseInt(data.qid, 10),
            registered: time,
            type: data.type,
            timesBorrowed: data.timesBorrowed ?? 0,
            status: data.status ?? DishStatus.available,
            condition: data.condition ?? DishCondition.good,
            userId: userEmail ?? null,
            // userId: data.user ?? null,
            borrowedAt: data.borrowedAt ?? null,
        })
    }
    //)
    Logger.info({
        module: 'dish.services',
        function: 'getAllDishes',
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
            timesBorrowed: data.timesBorrowed ?? 0,
            status: data.status ?? DishStatus.available,
            condition: data.condition ?? DishCondition.good,
            userId: data.user ?? null,
            borrowedAt: data.borrowedAt ?? null,
        })
    })
    Logger.info({
        module: 'dish.services',
        function: 'getUserDishes',
        message: `got all dishes from firebase for user ${userClaims.uid}`,
    })
    return dishData
}

export const validateDishCreateRequestBody = (dish: Partial<Dish>) => {
    const schema = Joi.object({
        qid: Joi.number().required(),
        type: Joi.string().required(),
    }).required()

    return schema.validate(dish)
}

export const validateDishType = (dishType: string) => {
    const schema = Joi.string().required()
    return schema.validate(dishType)
}

export const validateBatchCreate = (dishIdLower: number, dishIdUpper: number, dishType: string) => {
    const schema = Joi.object({
        dishIdLower: Joi.number().required(),
        dishIdUpper: Joi.number().required(),
        dishType: Joi.string().required(),
    })

    return schema.validate({ dishIdLower, dishIdUpper, dishType })
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
            .valid(...Object.values(DishCondition))
            .required(),
    }).required()

    return schema.validate(dish)
}

export const validateModifyDish = (body: Object) => {
    const schema = Joi.object({
        oldValues: Joi.object({
            id: Joi.string().required(),
            qid: Joi.number().required(),
            status: Joi.string().required(),
            type: Joi.string().optional(),
            registered: Joi.string().optional(),
            userId: Joi.string().optional().allow(null),
            borrowedAt: Joi.string().optional().allow(null),
            timesBorrowed: Joi.number().optional(),
        }).required(),
        newValues: Joi.object({
            id: Joi.string().required(),
            qid: Joi.number().required(),
            status: Joi.string().required(),
            type: Joi.string().optional(),
            registered: Joi.string().optional(),
            userId: Joi.string().optional().allow(null),
            borrowedAt: Joi.string().optional().allow(null),
            timesBorrowed: Joi.number().optional(),
        }).required(),
    }).required()

    return schema.validate(body)
}

export const validateUpdateConditonRequestBody = (body: Object) => {
    const schema = Joi.object({
        condition: Joi.string()
            .valid(...Object.values(DishCondition))
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
    let borrowedAt = borrowed ? new Date().toISOString() : null
    let dishCondition = condition ?? DishCondition.good

    let status = borrowed
        ? DishStatus.borrowed
        : dishCondition !== DishCondition.good
        ? DishStatus.broken
        : DishStatus.available

    await db.collection('dishes').doc(dish.id).update({
        condition: dishCondition,
        // borrowed,
        timesBorrowed,
        userId,
        borrowedAt,
        status,
    })
    Logger.info({
        module: 'dish.services',
        message: 'Updated borrowed status',
    })
}

export const updateCondition = async (id: string, condition: string) => {
    await db.collection('dishes').doc(id).update({ condition })
}

export const updateDish = async (oldValues: Partial<Dish>, newValues: Partial<Dish>) => {
    const snapshot = await db.collection('dishes').where('qid', '==', oldValues.qid).get()
    console.log('snapshot', snapshot)

    if (!snapshot.empty) {
        const doc = snapshot.docs[0]

        // check that type and status are the same
        if (doc.data().type !== oldValues.type || doc.data().status !== oldValues.status) {
            throw new Error(`Mismatch in value for ${oldValues}`)
        }
        await doc.ref.update(newValues)

        return { message: 'Update successful' }
    } else {
        throw new Error('No matching document found')
    }
}
