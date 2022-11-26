import React, { useState } from 'react'
import DishApi from "../stores/api"
import {db} from "../firebase"
const CheckOutbyID = async (db: any, dish: string, user: string) => {
    
    const docRef = await DishApi.CheckOutDish(db, user, dish);
    console.log(docRef.id);

}

const CheckOutbyQR = async (db: any, user: string, qid: string) => {
    
    const dish = await DishApi.getDishID(db, user, qid)
    const docRef = await DishApi.CheckOutDish(db, user, dish.docId);
    console.log(docRef.id);

}

const CheckOutApi = (props: any) => {
    const [DishID, setDishID] = useState("fJ2ohLer5kTutrJefW5O")
    const [DishQID, setDishQID] = useState("value")
    
    const [User, setUser] = useState("value")

    const handleSubmit = (e: any) => {
        e.preventDefault();
        console.log(DishID)
        
        CheckOutbyQR(db,User,"1")
        CheckOutbyID(db, DishID,User)
        return false;
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type={"text"} value={DishID} onChange={((e) => { setDishID(e.target.value) })} />
                <input type={"text"} value={User} onChange={((e) => { setUser(e.target.value) })} />
                <button onSubmit={handleSubmit}>Submit</button>
            </form>
        </div>
    )
}

export default CheckOutApi