/*eslint-disable*/
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import React from 'react'
//import Scanner from "../widgets/scanner"
//import DishAPI from "../features/api"
import '../styles/QRScanner.css'
//import { Button, Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Modal from 'react-bootstrap/Modal'
import { AppHeader } from '../widgets/appHeader'
import BottomTextInput from '../widgets/bottomTextInput'
import { useAuth } from '../contexts/AuthContext'
import { faCoffee, faExclamation, faLeaf } from '@fortawesome/free-solid-svg-icons'
// import '@fortawesome/fontawesome-free/css/all.css';

import axios from 'axios'

const Borrow = () => {
    const [scanId, setScanId] = useState('')
    const [showNotif, setShowNotif] = useState(false)
    const [popUp, setPopUp] = useState(false)
    const [dishType, setDishType] = useState('')
    const [qid, setQid] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [dishIcon, setDishIcon] = useState()
    const [notifType, setNotifType] = useState('returned')
    const [error, setError] = useState('')
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
    const [reportPopUp, setReportPopUp] = useState(false)
    const [reportValue, setReportValue] = useState('good')
    const [dishID, setDishID] = useState('')
    const { currentUser, sessionToken } = useAuth()
    const [confirm, setConfirm] = useState(false)
    const [dishNotFound, setDishNotFound] = useState(false)
    const [borrowDishResult, setBorrowDishResult] = useState({
        show: false,
        success: false,
    })
    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search)
        const previousURL = queryParams.get('previousURL')
        if (previousURL?.includes('dishzero.ca')) {
            const dishID = (previousURL.match(/dishID=([^&]+)/) || '')[1]
            setConfirm(true)
            onConfirm(dishID)
        }
    }, [])

    const navigate = useNavigate()

    useEffect(() => {
        const timer = setTimeout(() => {
            if (popUp) {
                setPopUp(false)
            }
        }, 5000)
        return () => clearTimeout(timer)
    }, [popUp])

    // const onCancel = popUp
    //   ? () => {
    //       setPopUp(false);
    //     }
    //   : null;

    const onClick = () => {
        setPopUp(true)
    }

    const DishNotFound = ({ show, onCancel, id }) => {
        return (
            <Modal onHide={onCancel} show={show} className="modal-dialog-centered modal-sm" centered>
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body className="text-center">
                    <FontAwesomeIcon style={{ color: '#BF4949', margin: '16 0 16 0' }} icon={faExclamation} size="4x" />
                    <p style={{ textAlign: 'center' }}>Dish ID: {id} does not exist. Please try again.</p>
                </Modal.Body>
            </Modal>
        )
    }

    const BorrowDishSuccess = ({ show, success, onCancel, id }) => {
        return (
            <Modal onHide={onCancel} show={show} className="modal-dialog-bottom modal-sm" centered>
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body style={{ width: '100%', display: 'flex', gap: '0.5rem' }}>
                    {success ? (
                        <>
                            <FontAwesomeIcon icon={faCoffee} size="4x" />
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div>Successfully borrowed</div>
                                <div>Dish # {id} </div>
                                <div> </div>
                                <div>
                                    Please return your dish within two days to the nearest DishZero Return Station
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <FontAwesomeIcon style={{ color: '#BF4949' }} icon={faExclamation} size="4x" />
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div>Failed to borrow</div>
                                <div>Dish # {id} </div>
                                <div>Please scan and try again</div>
                            </div>
                        </>
                    )}
                </Modal.Body>
            </Modal>
        )
    }

    const onConfirm = async (scanId: string) => {
        // if (!confirm) {
        //   return false;
        // }
        setConfirm(false)
        setScanId(scanId)
        const user = currentUser?.id || null
        console.log('USER: ' + user)
        console.log('scanid', scanId)

        axios
            .post(
                `${process.env.REACT_APP_BACKEND_ADDRESS}/api/dish/borrow`,
                {},
                {
                    headers: { 'x-api-key': `${process.env.REACT_APP_API_KEY}`, 'session-token': sessionToken },
                    params: { qid: scanId },
                },
            )
            .then(function (response) {
                //eslint-disable-line @typescript-eslint/no-unused-vars
                setBorrowDishResult({ show: true, success: true })
            })
            .catch(function (error) {
                setBorrowDishResult({ show: true, success: false })
                console.log(error)
            })
    }

    const onCancel = () => {
        setScanId('')
        setConfirm(false)
        setDishNotFound(false)
        setBorrowDishResult({ ...borrowDishResult, show: false })
    }
    return (
        <div
            style={{
                height: '100%',
                width: '100%',
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#464646',
            }}>
            <AppHeader title={'Borrow Dishes'} />

            <div className="qr-body-wrapper">
                <div className="b-text-wrapper">
                    <div className="borrow-icon">
                        <FontAwesomeIcon icon={faLeaf} color="white" fontSize="2.5em" />
                    </div>
                    <h1 className="borrow-header">
                        Use phone camera to scan QR Code or type in the ID in the box below
                    </h1>
                </div>
                <BottomTextInput
                    disabled={false}
                    value={scanId}
                    onChange={(e) => setScanId(e.target.value)}
                    onSubmit={async () => {
                        await onConfirm(scanId)
                    }}
                />

                <DishNotFound show={dishNotFound} id={scanId} onCancel={onCancel} />
                <BorrowDishSuccess
                    show={borrowDishResult.show}
                    success={borrowDishResult.success}
                    onCancel={onCancel}
                    id={scanId}
                />
            </div>
        </div>
    )
}

export default Borrow
