import Joi from 'joi'
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier'
import { Condition, Dish, DishStatus } from '../models/dish'
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
    console.log('snapshot', snapshot)
    let data = snapshot.docs.map((doc) => doc.id) // const dishTypeRef = db.collection('dish-types').doc('type1');
    // const dishTypes = doc.data()?.types
    // if (snapshot.empty) {
    //     return null
    // }
    // console.log('snapshot', snapshot)
    // let data = snapshot.docs[0].data()
    console.log('dishTypes', data)
    // return dishTypes as string[]
    return data
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
    // return {
    //     id: snapshot.id,
    //     qid: snapshot.data()?.qid,
    //     registered: snapshot.data()?.registered,
    //     type: snapshot.data()?.type,
    //     borrowed: snapshot.data()?.borrowed,
    //     timesBorrowed: snapshot.data()?.timesBorrowed,
    //     status: snapshot.data()?.status,
    //     userId: snapshot.data()?.userId,
    //     borrowedAt: snapshot.data()?.borrowedAt ? snapshot.data()?.borrowedAt : null
    // }
}

export const createDishInDatabase = async (dish: Partial<Dish>) => {
    // export const createDishInDatabase = async (dish: Dish) => {
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
    dish.borrowed = false
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

export const addDishTypeToDatabase = async (dishType: string) => {
    let validation = validateDishType(dishType)
    console.log(validation)
    if (validation.error) {
        Logger.error({
            module: 'dish.services',
            message: 'Invalid dish type request body',
        })
        throw new Error(validation.error.message)
    }

    // TODO: check if dish type already exists?

    // TODO: check how the collection? or doc is set up?
    let newDishType = await db.collection('dishType').add({ dishType })
    Logger.info({
        module: 'dish.services',
        message: 'Created new dish type in database',
    })

    return {
        ...newDishType,
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
            borrowedAt: data.borrowedAt ? data.borrowedAt : null,
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
            borrowedAt: data.borrowedAt ? data.borrowedAt : null,
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
            borrowedAt: data.borrowedAt ? data.borrowedAt : null,
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
            borrowedAt: data.borrowedAt ? data.borrowedAt : null,
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

export const validateModifyDishStatus = (body: Object) => {
    const schema = Joi.object({
        dishId: Joi.string().required(),
        newStatus: Joi.string().required(),
    }).required()

    return schema.validate(body)
}

export const validateModifyDish = (body: Object) => {
    const schema = Joi.object({
        newValues: Joi.object({
            // dish here
        }).required(),
        oldValues: Joi.object({
            // dish here
        }).optional(), // not required
    })
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
    let borrowedAt = borrowed ? new Date().toISOString() : null
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
        borrowedAt,
    })
    Logger.info({
        module: 'dish.services',
        message: 'Updated borrowed status',
    })
}

export const updateCondition = async (id: string, condition: string) => {
    await db.collection('dishes').doc(id).update({ condition })
}

export const updateDishStatus = async (id: string, newStatus: string) => {
    // TODO: check that this matches the firebase
    await db.collection('dishes').doc(id).update({ newStatus })
}
