import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import Scanner from "../widgets/scanner"
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import DishAPI from "../features/api";
import { FirebaseContext } from "../firebase";
import Login from "./login";
import { GoogleAuth, FirebaseAuth } from '../firebase';
import { signInWithPopup } from 'firebase/auth';

const Confirm = ({ show, onSubmit, onCancel, id }) => {
    return (
        <Modal onHide={onCancel} show={show} className="modal-dialog-centered modal-sm" centered>
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body className="text-center">
                <p style={{ textAlign: 'center' }}>ID : {id}</p>
                <FontAwesomeIcon icon={faCoffee} size="4x" />
            </Modal.Body>
            <Modal.Footer className="justify-content-center">
                <Button variant="secondary" onClick={onSubmit}>
                    Check Out
                </Button>
            </Modal.Footer>
        </Modal>
    )
}


export default () => {
    const [scanId, setScanId] = useState("")
    const [confirm, setConfirm] = useState(false)
    const firebase = useContext(FirebaseContext);
    const navigate = useNavigate();
    const [Buffer, setBuffer] = useState(false)
    const onScan = confirm ? null : (id: string) => {
        setScanId(id)
        setConfirm(true)
    }

    const onConfirm =  async () => {
        if(!confirm){
            return false;
        }
        setConfirm(false)
        const user = firebase?.user?.uid || null;
        console.log("USER: " + user)
        const docRef = await DishAPI.addDishBorrow(scanId, user)
        setBuffer(true)


        console.log("doc ref" + docRef?.id)
        const transactionID = docRef?.id

        if (!firebase?.user) {
            console.log("USER IS NULL")
            navigate(`/login/?transaction_id=${transactionID}`)
        }
        console.log("LOGGEd out user" + user)
    }

    const onCancel = confirm ? () => {
        setScanId("")
        setConfirm(false)
    } : null

    return (
        <>
            <Scanner
                mode="Scan Dishes"
                onScan={onScan}
                onClose={() => navigate("/home")}
            />
            <Confirm
                show={confirm}
                id={scanId}
                onSubmit={async()=>{ await onConfirm()}}
                onCancel={onCancel}
            />
        </>
    )
}