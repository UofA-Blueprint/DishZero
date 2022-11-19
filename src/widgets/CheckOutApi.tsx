import React, { useState } from 'react'
import DishApi from "../stores/api"

const CheckOut = async (db: any,dish: any) => {
    // const availability = await DishApi.checkDishAvailability(db,dish);
    // console.log(availability)
    // if(availability){
    DishApi.checkDishAvailability(db, parseInt(dish))
    // }
    // console.log(await DishApi.getAvailableDishes(db))
    // if (await DishApi.checkDishAvailability(id)) {
    //     DishApi.checkOutDish(id, dish)
    // }
}

const CheckOutApi = (props: any) => {
    const [DishID, setDishID] = useState("value")
    const handleSubmit = (e:any) =>{
        e.preventDefault();
        console.log(DishID)
        CheckOut(props.db,DishID)
        
        return false;
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type={"text"} value={DishID} onChange={((e)=>{setDishID(e.target.value)})}/>
                <button onSubmit={handleSubmit}>Submit</button>
            </form>
        </div>
    )
}

export default CheckOutApi