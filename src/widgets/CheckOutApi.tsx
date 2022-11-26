import React, { useState } from 'react'
import DishApi from "../stores/api"

const CheckOutbyID = async (db: any, dish: string, user: string) => {
    
    const docRef = await DishApi.CheckOutDish(db, user, dish);
    console.log(docRef.id);

}

const CheckOutbyQR = async (db: any, user: string, qid: string) => {
    
    const dish = await DishApi.getDishID(db, user, qid)
    console.log(dish)
    // const docRef = await DishApi.CheckOutDish(db, user, dish[0]);
    // console.log(docRef.id);

}

const CheckOutApi = (props: any) => {
    const [DishID, setDishID] = useState("value")
    const [DishQID, setDishQID] = useState("value")
    
    const [User, setUser] = useState("value")

    const handleSubmit = (e: any) => {
        e.preventDefault();
        console.log(DishID)
        // CheckOutbyID(props.db, DishID,User)
        CheckOutbyQR(props.db,User,"1")

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