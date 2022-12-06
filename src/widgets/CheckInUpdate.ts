import DishAPI from "../stores/api"
import { db } from "../firebase"

const CheckInDish = async (DishID: any) => {
    const transaction = await DishAPI.getTransaction(db, DishID);
    if (transaction.returned["timestamp"] != undefined) {
        console.log("Dish is already checked-in.")
    } else {
        DishAPI.CheckInDish(db, transaction);
    }
}

const UpdateCondition = async (DishID: any, condition: any) => {
    const transaction = await DishAPI.getTransaction(db, DishID);
    DishAPI.UpdateDishCondition(db, transaction, condition);
}

export {CheckInDish, UpdateCondition};