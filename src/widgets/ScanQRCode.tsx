import { faCamera, faCameraRotate, faVideoCamera } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import { Button } from 'react-bootstrap'
import QrReader from 'react-qr-scanner'

const ScanQRCode = ({setDishID}) => {
  const [Log, setLog] = useState('')
  const style = {  height: 240, width: 320 }
  const [FacingMode, setFacingMode] = useState(false)
  const [showQr, setShowQr] = useState(false)
  const handleError = (err: any) => {
    console.error(err)
    setLog(err)
    // setLog(err)
  }
  const handleScan = (data: any) => {
    if(data==null){
      return; 
    }
    setDishID(data.text)
    console.log(data)
  }
  return (
    <div className='qr-scanner-wrapper'>Scan QRCode
      <div style={{ width:"100%",display: "flex", justifyContent: "space-between" }}>
        <Button onClick={() => setShowQr(!showQr)}>
          <FontAwesomeIcon icon={faCamera} />
        </Button>
        {/* TODO: Disable setFacingMode when only one camera is available */}
        <Button variant="secondary" onClick={() => setFacingMode(!FacingMode)}>
          <FontAwesomeIcon icon={faCameraRotate} />
        </Button>
      </div>
      <div className="qr-scanner-placeholder" style={style}>
        {showQr ? <QrReader
          delay={100}
          style={style}
          onError={handleError}
          onScan={handleScan}
          facingMode={FacingMode ? "front" : "read"}
        /> :<div> <FontAwesomeIcon icon={faVideoCamera} /> Camera Disabled</div>}
      </div>
      {Log}
    </div>
  )
}

export default ScanQRCode