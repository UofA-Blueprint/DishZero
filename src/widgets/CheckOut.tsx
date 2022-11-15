import CheckOutPopUp from "./CheckOutPopUp"
import CheckOutInput from "./CheckOutInput"
import CheckOutButton from "./CheckOutButton"
import { useState } from "react"
const CheckOut = () => {
  const [DishID, setDishID] = useState("")
  const [PopUp, setPopUp] = useState(false)
  return (
    <div>
        
        <CheckOutInput setPopUp={setPopUp} setDishID={setDishID} DishID={DishID}/>
        <CheckOutButton  />
        <CheckOutPopUp setPopUp={setPopUp} PopUp={PopUp} DishID={DishID} />
    </div>
  )
}

export default CheckOut