import { useState } from "react";
import { Container, Button, InputGroup } from 'react-bootstrap'
import QrReader from "react-qr-scanner";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

import {
    faCameraRotate,
    faVideoCamera,
    faClose,
    faSearch
} from "@fortawesome/free-solid-svg-icons";


const CameraInput = (props) => {
    const [errorMessage, setErrorMessage] = useState("");
    const [showQr, setShowQr] = useState(false);
    const [frontCamera, setFrontCamera] = useState(false)

    const style = { height: "100%" };
    const handleError = (err: any) => {
        console.error(err.message)
        if (err.message === "Permission denied") {
            setErrorMessage("Camera Permission Denied")
        }
        setShowQr(false)
    };
    const handleScan = (data: any) => {
        if (data == null) {
            return;
        }
        props.onSubmit(data.text);
        console.log(data);
    };
    return (
        <div className="qr-scanner-wrapper" style={props.style}>
            <div
                style={{
                    width: "100%",
                    display: "flex",
                    
                    
                }}
            >
                {/* TODO: Disable setFacingMode when only one camera is available */}
            </div>
            <div
                className="qr-scanner-placeholder"
                style={style}
            >
                <div>
                    <Button
                        variant="secondary"
                        onClick={() => setFrontCamera(!frontCamera)}
                    >
                        <FontAwesomeIcon icon={faCameraRotate} />
                    </Button>
                </div>

                <div className="qr-scanner-tag" onClick={() => setShowQr(!showQr)}>
                    {/* <div className="crosshair"/> */}

                    {showQr ? (
                        <QrReader
                            delay={100}
                            //style={style}
                            onError={handleError}
                            onScan={handleScan}
                            // TODO: determine based off https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints/facingMode
                            facingMode={frontCamera ? "user" : "environment"}
                        />
                    ) : (
                        <div>
                            {" "}
                            {errorMessage ? (errorMessage) : (<><FontAwesomeIcon icon={faVideoCamera} /> Camera Disabled <br />{" "}
                                <p style={{ fontSize: "0.8em" }}>Tap to Enable</p>{errorMessage}</>)}

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CameraInput;