import { Button, Modal } from 'react-bootstrap'
import { useEffect, useRef, useState } from 'react';
import '../styles/admin.css';

//const AddDishModal 
export default function ({ show, onCancel }) {
    const dishTypes = ["Container", "Mug"];
    const [QRCode, setQRCode] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        if (file != null) {
            addFromCSV();
        };
    })
    
    const fileButton = useRef<HTMLInputElement | null>(null);

    const onTypeChange = e => {
        setSelectedType(e.target.value);
    };

    const closeModal = () => {
        setQRCode("");
        setSelectedType("");
        onCancel();
    }

    const addOne = () => {
        if (!QRCode || !selectedType) {
            alert("Please fill in all fields");
            return;
        }
        // DishAPI.addNewDish(QRCode, selectedType);
        setQRCode("");
    }

    const addFromCSV = () => {
        const reader = new FileReader();
        reader.onload = function (e) {
            const data = (e.target!.result as string).split("\r\n");
            data.forEach(row => {
                var dish = row.split(",");
                // skip header if any
                if (dish[0].toLowerCase().indexOf("qr") > -1) {
                    return;
                }
                // DishAPI.addNewDish(dish[0], dish[1]);
            });
        }

        reader.readAsText(file!);
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
                    <input hidden type="file" accept=".csv" ref={fileButton} onChange={(e) => {setFile(e.target.files![0])}} />
                    <Button className="body admin-btn" onClick={() => fileButton.current!.click()}>Upload as CSV</Button>
                </div>
            </Modal.Body>
        </Modal>
    );
}