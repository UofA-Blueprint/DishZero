const {db} = require("../db");
const _ = require("lodash");
const {Dish} = require("../model/dish");
const {Transaction} = require("../model/transaction");

class FirestoreService {
    constructor() {
        this.dishes = db.collection("dishes");
        this.transactions = db.collection("transactions");
    }

    /**
     * Gets the list of all the dishes
     * @returns {Promise<*[]>} The list of Dishes
     */
    async getAllDishes() {
        let allDishData = await this.dishes.get();
        if (allDishData.empty) {
            // return empty list if not dishes
            return [];
        }
        let dishList = [];
        allDishData.forEach((d) => {
            let dData = d.data();
            dishList.push(new Dish(d.id, dData.qid, dData.registered, dData?.type || ""));
        })
        return dishList;
    }

    /**
     * Gets the list of all transactions
     * @returns {Promise<*[]>} the list of Transactions
     */
    async getAllTransactions() {
        let allTransData = await this.transactions.get();
        if (allTransData.empty) {
            // return empty list if not dishes
            return [];
        }
        let transList = [];
        allTransData.forEach((t) => {
            let tData = t.data();
            transList.push(new Transaction(t.id, tData.dish, tData.user, tData.returned, tData.timestamp));
        })
        return transList;
    }
}

const firestoreService = new FirestoreService();

module.exports = {
    firestoreService
}