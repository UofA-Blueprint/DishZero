import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier'
import { Dish, DishStatus, DishTableVM } from '../models/dish'
import { Transaction } from '../models/transaction'
import { db } from './firebase'

export function getAllUserDishes(
    userClaims: DecodedIdToken,
    allDishes: Array<Dish>,
    dishTransMap: Map<string, { transaction: Transaction; count: number }>
) {
    let dishData = <Array<Dish>>[]
    allDishes.forEach((dish) => {
        let obj = dishTransMap.get(dish.id)
        if (obj?.transaction.userID == userClaims.uid) {
            dishData.push(dish)
        }
    })
    return dishData
}

export function getAllUserDishesInUse(
    userClaims: DecodedIdToken,
    allDishes: Array<Dish>,
    dishTransMap: Map<string, { transaction: Transaction; count: number }>
) {
    let dishData = <Array<Dish>>[]
    allDishes.forEach((dish) => {
        let obj = dishTransMap.get(dish.id)
        if ((obj?.transaction.userID == userClaims.uid) && (findDishStatus(obj.transaction) == DishStatus.inUse)) {
            dishData.push(dish)
        }
    })
    return dishData
}

export function getAllUserDishesVM(
    userClaims: DecodedIdToken,
    allDishesVM: Array<DishTableVM>,
    dishTransMap: Map<string, { transaction: Transaction; count: number }>
) {
    let userDishesVM = <Array<DishTableVM>>[]
    allDishesVM.forEach((dish) => {
        let obj = dishTransMap.get(dish.id)
        if (obj?.transaction.userID == userClaims.uid) {
            userDishesVM.push(dish)
        }
    })
    return userDishesVM
}

export function getAllUserDishesVMInUse(
    userClaims: DecodedIdToken,
    allDishesVM: Array<DishTableVM>,
    dishTransMap: Map<string, { transaction: Transaction; count: number }>
) {
    let userDishesVM = <Array<DishTableVM>>[]
    allDishesVM.forEach((dish) => {
        let obj = dishTransMap.get(dish.id)
        if ((obj?.transaction.userID == userClaims.uid) && (dish.status == DishStatus.inUse)) {
            userDishesVM.push(dish)
        }
    })
    return userDishesVM
}

export async function getAllDishes(): Promise<Array<Dish>> {
    let dishData = <Array<Dish>>[]
    let dishesQuerySnapshot = await db.collection('dishes').get()
    dishesQuerySnapshot.docs.forEach((doc) => {
        let data = doc.data()
        dishData.push({
            id: doc.id,
            qid: parseInt(data.qid, 10),
            registered: data.registered.toDate(),
            type: data.type ? data.type : '',
        })
    })
    return dishData
}

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
                    curObj.transaction.timestamp < transaction.timestamp
                        ? curObj.transaction
                        : transaction
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
    if (!transaction || !transaction.returned) {
        return DishStatus.returned
    }
    if (Object.keys(transaction.returned).length !== 0) {
        return DishStatus.inUse
    }

    if (transaction.returned?.broken) {
        return DishStatus.broken
    }

    // TO DO check for lost and overdue dishes

    return DishStatus.returned
}
