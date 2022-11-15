import {
  faCamera,
  faCameraRotate,
  faVideoCamera,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Button } from "react-bootstrap";
import QrReader from "react-qr-scanner";

const ScanQRCode = ({ setFacingMode, FacingMode, setDishID }) => {
  const [Log, setLog] = useState("");
  const style = { height: 240, width: "320" };

  const [showQr, setShowQr] = useState(false);
  const handleError = (err: any) => {
    console.error(err);
    setLog(err);
    // setLog(err)
  };
  const handleScan = (data: any) => {
    if (data == null) {
      return;
    }
    setDishID(data.text);
    console.log(data);
  };
  return (
    <div className="qr-scanner-wrapper">
      <br />
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {/* TODO: Disable setFacingMode when only one camera is available */}
      </div>
      <div
        className="qr-scanner-placeholder"
        onClick={() => setShowQr(!showQr)}
        style={style}
      >
        <div className="position-absolute">
          <Button
            variant="secondary"
            onClick={() => setFacingMode(!FacingMode)}
          >
            <FontAwesomeIcon icon={faCameraRotate} />
          </Button>
        </div>
        <div className="qr-scanner-tag">
          {showQr ? (
            <QrReader
              delay={100}
              style={style}
              onError={handleError}
              onScan={handleScan}
              facingMode={FacingMode ? "front" : "read"}
            />
          ) : (
            <div>
              {" "}
              <FontAwesomeIcon icon={faVideoCamera} /> Camera Disabled <br />{" "}
              Tap to Enable
            </div>
          )}
        </div>
      </div>
      {Log}
    </div>
  );
};

export default ScanQRCode;
