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

    const onScan = confirm ? null : (id: string) => {
        setScanId(id)
        setConfirm(true)
    }

    const onConfirm = confirm ? () => {
        setConfirm(false)
        const user = firebase?.user?.uid || null;
        console.log("USER: " + user)
        DishAPI.addDishBorrow(scanId, user)

        if (!firebase?.user) {
            console.log("USER IS NULL")
            signInWithPopup(FirebaseAuth, GoogleAuth)
            .then((credentials) => {
                if (!credentials.user.email?.match('@ualberta.ca')) {
                    credentials.user?.delete();
                    alert('Please login with your University of Alberta CCID')
                }
            })
            .catch((err) => {
                alert(err.message)
            })
        }
        console.log(user)

        //update the firebase document with the user id
        


    } : null

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
                onSubmit={onConfirm}
                onCancel={onCancel}
            />
        </>
    )
}