import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Scanner from "../widgets/scanner"
import DishAPI from "../features/api"
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamation } from '@fortawesome/free-solid-svg-icons'

const Report = ({ show, onSubmit, onCancel }) => {
    return show ? (
        <div className="report-wrapper">

        </div>
    ) : null;
}

const Notification = ({ show, type, onClick, id }) => {
    return show ? (
        <div className="position-absolute notif">
            <div className="graphic"/>
            <div className="text-group">
                <div style={{fontSize: "14px", fontWeight: 400}}>Successfully {type}</div>
                <div style={{fontSize: "16px", fontWeight: 600}}>Mug ID # {id}</div>
            </div>
            <Button className="report-btn" variant="secondary" onClick={onClick}>
                <div className="octagon">
                    <FontAwesomeIcon icon={faExclamation} size="xs" transform="up-2"/>
                </div>
            </Button>
        </div>
    ) : null;
}

export default () => {
    const [scanId, setScanId] = useState("")
    const [showNotif, setShowNotif] = useState(false);
    const [popUp, setPopUp] = useState(false);
    const [notifType, setNotifType] = useState("returned");

    const navigate = useNavigate()

    const onScan = (id: string) => {
        setScanId(id);
        DishAPI.updateDishReturn(id);
        // if an animation is added, this will re-trigger it
        if (showNotif)
            setShowNotif(false);
        setNotifType("returned");
        setShowNotif(true);
    }

    const onCancel = popUp ? () => {
        setPopUp(false)
    } : null

    const onClick = () => {
        setPopUp(true);
        console.log("showing pop up");
    }

    const onSubmit = (condition: string) => {
        console.log(condition);
        DishAPI.updateDishCondition(scanId, condition);
        setPopUp(false);
        if (showNotif)
            setShowNotif(false);
        setNotifType("reported");
        setShowNotif(true);
    }

    return (
        <>
            <Scanner
                mode="Scan Dishes"
                onScan={onScan}
                onClose={() => navigate("/home")}
            />
            <Notification
                show={showNotif}
                type={notifType}
                onClick={onClick}
                id={scanId}
            />
            <Report
                show={popUp}
                onSubmit={onSubmit}
                onCancel={onCancel}
            />
        </>
    )
}