import CheckOutPopUp from "../widgets/CheckOutPopUp"
import CheckOutInput from "../widgets/CheckOutInput"
import CheckOutButton from "../widgets/CheckOutButton"
import CheckOutTop from "../widgets/CheckOutTop"
import ScanQRCode from "../widgets/ScanQRCode"
import { useState } from "react"
import '../styles/CheckOut.css';

const CheckOut = () => {
  const [DishID, setDishID] = useState("")
  const [PopUp, setPopUp] = useState(false)
  const [ShowCheckOut, setShowCheckOut] = useState(false)
  const [FacingMode, setFacingMode] = useState(false)
  return (
    <div className="checkout-main">
      <div className="checkout-wrapper">
        <CheckOutButton style={{ display: (ShowCheckOut ? "none" : "block") }} onClick={() => setShowCheckOut(!ShowCheckOut)} />
        {/* ScanQRCode */}
        <div style={{ height: "100vh", width: "80%", display: (ShowCheckOut ? "block" : "none") }}>
          <CheckOutTop style={{ top: 0, left: 0, position: "fixed", width: "100%" }} />
          <ScanQRCode setFacingMode={setFacingMode} FacingMode={FacingMode} setDishID={setDishID} />
          <CheckOutInput setFacingMode={setFacingMode} FacingMode={FacingMode} setPopUp={setPopUp} setDishID={setDishID} DishID={DishID} />
          <CheckOutPopUp setPopUp={setPopUp} PopUp={PopUp} DishID={DishID} />
        </div>
      </div>
    </div>
  )
}

export default CheckOut