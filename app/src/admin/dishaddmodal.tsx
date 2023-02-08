import { Button, Modal } from 'react-bootstrap'
import { useState } from 'react';
import '../styles/admin.css';

//const AddDishModal 
export default function ({ show, addDish, addMultiple, onCancel }) {
    const dishTypes = ["Container", "Mug"];
    const [QRCode, setQRCode] = useState("");
    const [selectedType, setSelectedType] = useState("");
    let uploadedCSV = "";
    
    const onTypeChange = e => {
        setSelectedType(e.target.value);
    };

    const closeModal = () => {
        setQRCode("");
        setSelectedType("");
        onCancel();
    }

    const addOne = () => {
        addDish(QRCode, selectedType);
        setQRCode("");
        setSelectedType("");
    }

    const addFromCSV = () => {
        // parse CSV here
        addMultiple();
        setQRCode("");
        setSelectedType("");
    }

    return (
        <Modal backdrop={false} onHide={closeModal} show={show} dialogClassName="add-dish-modal" centered >
            <Modal.Header closeButton />
            <Modal.Body className="d-flex flex-wrap">
                <div className="col-12 modal-title">
                    <p className="header" style={{ marginBottom:'0' }}>Add Dish</p>
                </div>
                <div className="col-6">
                    <p className="sub-header-2">Add a single dish</p>
                </div>
                <div className="col-6" style={{paddingBottom:'30px'}}>
                    <p className="sub-header-4">Select the dish type</p>
                    <div className="dish-type-options">
                        {dishTypes.map(type =>
                            <div className="radio-label-group">
                                <input type="radio" onChange={onTypeChange} value={type} name="type" />
                                <label className="body">&nbsp;{type}</label>
                            </div>
                        )}
                    </div>
                    <p className="sub-header-4 mb-0" style={{paddingTop:'24px',}}>Enter QR Code</p>
                    <input className="smallest qr-input" placeholder='Enter QR code...' type="text" value={QRCode} style={{marginTop:'8px'}} onChange={e => setQRCode(e.target.value)} />
                    <Button className="body admin-btn" style={{marginTop:'24px'}} onClick={addOne}>Add Dish</Button>
                </div>
                <hr className="col-5 my-2" />
                <div className="col-2 text-center details" style={{marginBottom:'26px'}}>or</div>
                <hr className="col-5 my-2" />
                <p className="mb-0 col-6 sub-header-2">Add Multiple Dishes</p>
                <div className="col-6" >
                    <Button className="body admin-btn" onClick={addFromCSV}>Upload as CSV</Button>
                </div>
            </Modal.Body>
        </Modal>
    );
}