import { Dish, DishStatus, DishTableVM } from "../utils/models/dish"
import { Transaction } from "../utils/models/transaction"

export function mapDishesToLatestTransaction (transactions : Array<Transaction>) :
    Map<string, { transaction : Transaction, count : number}> {
        const map = new Map()
        transactions.forEach(transaction => {
            if (transaction.dishID) {
                let dishID = transaction.dishID
                if (map.has(dishID)) {
                    let curObj = map.get(dishID)
                    let latestTransaction = curObj.transaction.timestamp < transaction.timestamp ? curObj.transaction : transaction
                    map.set(dishID, {
                        transaction : latestTransaction,
                        count : curObj.count + 1
                    })
                } else {
                    map.set(dishID, {
                        transaction : transaction,
                        count : 1
                    })
                }
            }
        })

        return map
}

export function mapToDishVM(dishes : Array<Dish>, dishTransMap : Map<string, { transaction : Transaction, count : number}>)
    : Array<DishTableVM> {
        let allDishesVM = <Array<DishTableVM>>[]

        dishes.forEach(dish => {
            const obj = dishTransMap.get(dish.id)
            const status = findDishStatus(obj?.transaction)
            // TO DO find overdue value
            allDishesVM.push({
                id : dish.id,
                type : dish.type,
                status : status,
                overdue : 0,
                timesBorrowed : obj?.count ? obj.count : 0,
                dateAdded : dish.registered
            })
        })

        return allDishesVM
}

// this whole returned thing needs more explanation, why is it an object
function findDishStatus(transaction : Transaction | undefined) : DishStatus {
    if (!transaction) {
        return DishStatus.returned
    }
    if (Object.keys(transaction).length == 0) {
        return DishStatus.inUse
    }

    if (transaction.returned?.broken) {
        return DishStatus.broken
    }

    // TO DO check for lost and overdue dishes

    return DishStatus.returned
}