import { useState } from "react"
import CheckOutModal from "../widgets/CheckOutModal"
import ScanQRCode from "./ScanQRCode"


const Checkout = () => {
  const [DishID, setDishID] = useState("")
  const [PopUp, setPopUp] = useState(false)
  return (
    <div>
      <ScanQRCode mode="Check Out" DishID={DishID} setDishID={setDishID} setPopUp={setPopUp} PopUp={PopUp} />
      <CheckOutModal DishID={DishID} setPopUp={setPopUp} PopUp={PopUp} />
    </div>
  )
}

export default Checkout