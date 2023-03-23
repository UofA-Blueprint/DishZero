const {db} = require("../db");
const _ = require("lodash");
const {Dish} = require("../model/dish");

class FirestoreService {
    constructor() {
        this.dishes = db.collection("dishes");
        this.transactions = db.collection("transactions");
    }

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
}

const firestoreService = new FirestoreService();

module.exports = {
    firestoreService
}