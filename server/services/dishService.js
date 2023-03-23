const { db } = require("../db.js");
const _ = require("lodash");
const admin = require("firebase-admin");
const {firestoreService} = require("./firestoreService");

/**
 * The service for interacting with Dish Data
 */
class DishService {
    constructor() {
    }

    async getAllDishes() {
        let allDishes = await firestoreService.getAllDishes();
        console.log(allDishes);
        return "HELLO";
    }
}

const dishService = new DishService()

module.exports = {
    dishService,
}

