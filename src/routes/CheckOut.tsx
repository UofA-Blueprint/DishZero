import { useState } from "react"
import CheckOutModal from "../widgets/CheckOutModal"
import ScanQRCode from "../widgets/ScanQRCode"
import ScanButton from "../widgets/ScanButton"
import QRCheckout from "../widgets/QRCheckout"


const Checkout = () => {
  const [DishID, setDishID] = useState("")
  const [PopUp, setPopUp] = useState(false)
  const [ShowQRScanner, setShowQRScanner] = useState(false)
  return (
    <div>
      <ScanButton style={{ display: (ShowQRScanner ? "none" : "block") }} onClick={() => setShowQRScanner(!ShowQRScanner)} />
      <ScanQRCode setShowQRScanner={setShowQRScanner} ShowQRScanner={ShowQRScanner} mode="Scan Dishes" DishID={DishID} setDishID={setDishID} setPopUp={setPopUp} PopUp={PopUp} onScan={QRCheckout} />
      <CheckOutModal DishID={DishID} setPopUp={setPopUp} PopUp={PopUp} />
    </div>
  )
}

export default Checkout