const { db } = require("../db.js");
const _ = require("lodash");
const admin = require("firebase-admin");
const {firestoreService} = require("./firestoreService");
const {transactionService} = require("./transactionService");
const {DishStatus, DishTableVm} = require("../view_model/dishTableVm");

/**
 * The service for interacting with Dish Data
 */
class DishService {
    constructor() {
    }

    /**
     * Gets the list of all Dishes (in DishTableVm model)
     * @returns {Promise<*[]>}
     */
    async getAllDishes() {
        let allDishes = await firestoreService.getAllDishes();
        let allTrans = await firestoreService.getAllTransactions();
        const dishTransMap = this.mapDishToLatestTrans(allTrans);
        const dishListVm = this.mapToDishVm(allDishes, dishTransMap);
        return dishListVm;
    }

    /**
     * Maps the dishes to their latest trans
     * Also gives the number of times the dish was borrowed (by counting its number of transactions)
     * @param allTrans
     * @returns {Map<any, any>} Map of dishId to {trans: <Transaction>, count: number}
     */
    mapDishToLatestTrans(allTrans) {
        const dishTransMap = new Map();
        allTrans.forEach(t => {
            if (t.dish) {
                let dishId = t.dish.id;
                if (dishTransMap.has(dishId)) {
                    const oldVal = dishTransMap.get(dishId);
                    if (dishTransMap.get(dishId).trans?.timestamp < t?.timestamp) {
                        // update the trans if latest
                        oldVal.trans = t;
                    }
                    oldVal.count += 1;
                    dishTransMap.set(dishId, oldVal);
                } else {
                    dishTransMap.set(dishId, {
                        trans: t,
                        count: 1
                    });
                }
            }
        });
        return dishTransMap;
    }

    /**
     * Maps the dish list to the vm
     * @param allDishes the list of all dishes as stored in firestore
     * @param dishTransMap the map of dishId -> latest Trans
     */
    mapToDishVm(allDishes, dishTransMap) {
        let allDishesVm = [];
        allDishes.forEach(d => {
            const dishStatus = this.findStatusOfDishFromTrans(dishTransMap.get(d?.id));
            const numBorrowed = dishTransMap.get(d.id)?.count || 0;
            // TODO: Find the overdue val
            const overdue = 0;
            allDishesVm.push(new DishTableVm(d.id, d.type, dishStatus, overdue, numBorrowed, d.registered));
        });
        return allDishesVm;
    }

    findStatusOfDishFromTrans(trans) {
        if (!trans) {
            // if no transaction, assume dish to be returned
            return DishStatus.returned;
        }
        let isDishRet = transactionService.isDishReturnedForTransactionObject(trans);
        if (!isDishRet) {
            return DishStatus.inUse;
        }
        if (trans?.returned?.broken) {
            return DishStatus.broken;
        }
        // TODO: Check for lost or overdue dishes
        return DishStatus.returned;
    }
}

const dishService = new DishService()

module.exports = {
    dishService,
}

