/*eslint-disable*/

import { useEffect, useState } from "react";
import { Container, Button, InputGroup } from "react-bootstrap";
import {QrReader} from "./QrScanner/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { BallTriangle, TailSpin } from "react-loader-spinner";

import {
  Box,
} from "@mui/material";
import {
  faCameraRotate,
  faVideoCamera,
  faClose,
  faSearch,
  faCamera,
  faExclamation,
  faExclamationCircle,
  faExclamationTriangle
} from "@fortawesome/free-solid-svg-icons";

const CameraInput = (props) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [showQr, setShowQr] = useState(false);
  const [frontCamera, setFrontCamera] = useState(0);
  const style = { height: "100%" };

  /*useEffect(() => {
        console.log(showQr)
    },[showQr])*/

  const handleError = (err: any) => {
    console.error(err.message);
    if (err.message === "Permission denied") {
      setErrorMessage("Camera Permission Denied");
    } else {
      setErrorMessage(err.message);
    }
    setShowQr(false);
  };
  const handleScan = (data: any) => {
    if (data == null) {
      return;
    }
    props.onSubmit(data.text);
    console.log(data);
  };
  return (
    <>
    <div className="qr-body-wrapper">
    
      </div>
    <div className="qr-scanner-wrapper" style={props.style}>
      <div
        style={{
          width: "100%",
          display: "flex",
        }}
      >
        {/* TODO: Disable setFacingMode when only one camera is available */}
      </div>
      <div className="qr-scanner-placeholder" style={style}>
        

        <div
          className="qr-scanner-tag"
          onClick={() => {
            console.log(showQr);
            setShowQr(!showQr);
          }}
        >
          
          {/* <div className="crosshair"/> */}
          {props.isLoading ? (
          <Box
          >
            <TailSpin
              height={100}
              width={100}
              color="#B0D1D8"
              ariaLabel="tail-spin-loading"
              radius="1"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            />
            {/* <BallTriangle
              height={100}
              width={100}
              radius={5}
              color="#4fa94d"
              ariaLabel="ball-triangle-loading"
              visible={true}
            /> */}
          </Box>
        ) : (<>
          {showQr ? (
            <QrReader
            scanDelay={1000} //should we keep this
            videoContainerStyle={{height: "100%", width: "200px" }}
            
            onResult={(result, error, codeReader) => {
              if (result != null) {
                setShowQr(false);
                handleScan(result);
              } 
            }}
            onError={handleError}
            videoId="123"
            deviceIndex={frontCamera}
            // key="environment"
            // constraints={{ facingMode: 'environment' }}
          />
          ) : (
            <div>
              {" "}
              {errorMessage ? (
                <div className="d-flex align-items-center justify-content-center flex-column" style={{"color":'#BF4949'}}>
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  fontSize={"3em"}
                />{" "}
                <br />
                <p style={{ fontSize: "1.4em"}}>{errorMessage}</p>
              </div>
              ) : (
                <div className="d-flex align-items-center justify-content-center flex-column" style={{"color":'white'}}>
                  <FontAwesomeIcon
                    icon={faCamera}
                    color="white"
                    fontSize={"3em"}
                  />{" "}
                  <br />
                  Camera Disabled <br />{" "}
                  <p style={{ fontSize: "0.8em",color:"white" }}>Tap to Enable</p>
                  {errorMessage}
                </div>
              )}
            </div>
          )}
          </>
        )}
        </div>
        <div style={{zIndex:'100000',position:'absolute',right:20,top:0}}>
          <Button
            variant="secondary"
            onClick={() => {setFrontCamera(frontCamera+1); console.log(frontCamera)}}
          >
            <FontAwesomeIcon icon={faCameraRotate} size="lg" />
          </Button>
        </div>
      </div>
    </div>
    </>
  );
};



export default CameraInput;
