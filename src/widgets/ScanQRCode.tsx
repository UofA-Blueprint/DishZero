import ManualInput from "../widgets/ManualInput"
import ScanButton from "../widgets/ScanButton"
import ScannerNav from "../widgets/ScannerNav"
import QRCanvas from "../widgets/QRCanvas"
import { useState } from "react"
import '../styles/CheckOut.css';

const ScanQRCode = ({mode, DishID, setDishID, PopUp, setPopUp}) => {
  const [ShowQRScanner, setShowQRScanner] = useState(false)
  const [FacingMode, setFacingMode] = useState(false)
  return (
    <div className="scanner-main">
      <div className="scanner-wrapper">
        <ScanButton style={{ display: (ShowQRScanner ? "none" : "block") }} onClick={() => setShowQRScanner(!ShowQRScanner)} />
        {/* ScanQRCode */}
        <div style={{ height: "100vh", width: "80%", display: (ShowQRScanner ? "block" : "none") }}>
          <ScannerNav title={mode} style={{ top: 0, left: 0, position: "fixed", width: "100%" }} handleClose={()=>setShowQRScanner(false)} />
          <QRCanvas setFacingMode={setFacingMode} FacingMode={FacingMode} setDishID={setDishID} />
          <ManualInput setFacingMode={setFacingMode} FacingMode={FacingMode} setPopUp={setPopUp} setDishID={setDishID} DishID={DishID} />
        </div>
      </div>
    </div>
  )
}

export default ScanQRCode