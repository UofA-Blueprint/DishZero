/*eslint-disable*/

import { useState } from "react"
import '../styles/QRScanner.css';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Container, Button, InputGroup } from 'react-bootstrap'
import Navbar from 'react-bootstrap/Navbar';

import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {
    faCameraRotate,
    faVideoCamera,
    faClose,
    faSearch
} from "@fortawesome/free-solid-svg-icons";
import QrReader from "react-qr-scanner";

const Header = ({ handleClose, title, style }) => {
    return (
        <Navbar className="justify-content-space-between qr-scan-nav" style={style} bg="light" expand="lg" variant="light">
            <Container>
                <div />
                <Navbar.Brand style={{ marginRight: "0px" }}> {title}
                </Navbar.Brand>
                <Navbar.Text style={{ cursor: "pointer" }} onClick={handleClose}>
                    <FontAwesomeIcon icon={faClose} />
                </Navbar.Text>
            </Container>
        </Navbar>
    )
}

const BottomTextInput = ({ onSubmit }) => {
    const [input, setInput] = useState("");
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(input)
        return false;
    }
    return (

        <div className="start-0 position-fixed bottom-0 w-100 px-5" >
            <div>

                <Form onSubmit={handleSubmit}>

                    <InputGroup className="mb-3">

                        <InputGroup.Text className="search-bar">
                            <FontAwesomeIcon icon={faSearch} />
                        </InputGroup.Text>
                        <Form.Text className="text-muted">

                        </Form.Text>

                        <Form.Control className="search-bar" value={input} onChange={(e) => setInput(e.target.value)} type="text" placeholder="Enter dish id #" />

                        <Button onSubmit={handleSubmit} variant="light" type="submit" className="mr-sm-2 search-bar search-button">
                            Enter
                        </Button>

                    </InputGroup >
                </Form>
            </div>
        </div>
    )
}

const CameraInput = ({ onSubmit }) => {
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
        if (data === null) {
            return;
        }
        onSubmit(data.text);
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
                style={style}
            >
                <div className="position-absolute">
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
                            style={style}
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

export default ({ mode, onScan, onClose }) => {
    const onSubmit = (id: string) => onScan(id)

    return (
        <div className={`scanner-main`}>
            <div className="scanner-wrapper">
                {/* ScanQRCode */}
                <div style={{ height: "100vh", width: "80%", display: "block" }}>
                    <Header title={mode} style={{ top: 0, left: 0, position: "fixed", width: "100%" }} handleClose={onClose} />
                    <CameraInput onSubmit={onSubmit} />
                    <BottomTextInput onSubmit={onSubmit} />
                </div>
            </div>
        </div>
    )
}