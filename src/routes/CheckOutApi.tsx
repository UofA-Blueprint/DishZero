import React, { useState } from 'react'
import DishApi from "../stores/api"

const CheckOut = async (dish: string, user: string) => {
    
    const docRef = await DishApi.CheckOutDish(dish, user);
    console.log(docRef.id);

}

const CheckOutApi = () => {
    const [DishID, setDishID] = useState("value")
    const [User, setUser] = useState("value")

    const handleSubmit = (e: any) => {
        e.preventDefault();
        console.log(DishID)
        CheckOut(DishID, User)

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