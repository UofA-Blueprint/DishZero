import CheckOutPopUp from "./CheckOutPopUp"
import CheckOutInput from "./CheckOutInput"
import CheckOutButton from "./CheckOutButton"
import CheckOutTop from "./CheckOutTop"
import ScanQRCode from "./ScanQRCode"
import { useState } from "react"
const CheckOut = () => {
  const [DishID, setDishID] = useState("")
  const [PopUp, setPopUp] = useState(false)
  const [ShowCheckOut, setShowCheckOut] = useState(false)
  const [FacingMode, setFacingMode] = useState(false)
  return (<>
    <CheckOutButton style={{display:(ShowCheckOut?"none":"block")}} onClick={()=>setShowCheckOut(!ShowCheckOut)}/>
    {/* ScanQRCode */}
    <div style={{height:"100vh",width:"80%",display:(ShowCheckOut?"block":"none")}}>
        <CheckOutTop style={{top: 0,left:0,position:"fixed",width:"100%"}}/>
        <ScanQRCode setFacingMode={setFacingMode} FacingMode={FacingMode} setDishID={setDishID} />
        <CheckOutInput setFacingMode={setFacingMode} FacingMode={FacingMode} setPopUp={setPopUp} setDishID={setDishID} DishID={DishID}/>
        <CheckOutPopUp setPopUp={setPopUp} PopUp={PopUp} DishID={DishID} />
    </div></>
  )
}

export default CheckOut