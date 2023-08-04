import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Scanner from "../widgets/scanner";
import "../styles/QRScanner.css";
import { Button, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamation } from "@fortawesome/free-solid-svg-icons";
import { config } from "../config";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const Report = ({ show, onSubmit, onCancel, id }) => {
  const conditions = ["Small Chip/Crack", "Large chunk", "Shattered"];
  const [selectedCondition, setSelectedCondition] = useState("");
  const onConditionChange = (e) => {
    setSelectedCondition(e.target.value);
  };

  const submitCondition = () => {
    setSelectedCondition("");
    onSubmit(selectedCondition);
  };

  const closeReport = () => {
    setSelectedCondition("");
    onCancel();
  };

  return show ? (
    <Modal
      backdrop={false}
      onHide={closeReport}
      show={show}
      className="modal-sm report-modal"
      contentClassName="report-modal-height"
      centered
    >
      <Modal.Header closeButton className="report-modal-header">
        <div className="report-modal-title">Report</div>
      </Modal.Header>
      <Modal.Body className="report-modal-body text-center">
        <div className="large-graphic" />
        <div style={{ marginTop: "5px" }}>ID: {id}</div>
        <div style={{ marginTop: "20px", display: "block" }}>
          <div className="text-left">
            <input
              type="radio"
              onChange={onConditionChange}
              value={conditions[0]}
              name="condition"
            />{" "}
            {conditions[0]} <br />
          </div>
          <div>
            <input
              type="radio"
              onChange={onConditionChange}
              value={conditions[1]}
              name="condition"
            />{" "}
            {conditions[1]} <br />
          </div>
          <div>
            <input
              type="radio"
              onChange={onConditionChange}
              value={conditions[2]}
              name="condition"
            />{" "}
            {conditions[2]}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="report-modal-footer justify-content-center">
        <Button
          disabled={selectedCondition === "" ? true : false}
          variant="secondary"
          onClick={submitCondition}
        >
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  ) : null;
};

const Notification = ({ show, type, onClick, id }) => {
  return show ? (
    <div className="position-absolute bottom-0 notif">
      <div className="graphic" />
      <div className="text-group">
        <div style={{ fontSize: "14px", fontWeight: 400 }}>
          Successfully {type}
        </div>
        <div style={{ fontSize: "16px", fontWeight: 600 }}>Mug ID # {id}</div>
      </div>
      <Button className="report-btn" variant="secondary" onClick={onClick}>
        <div className="octagon">
          <FontAwesomeIcon icon={faExclamation} size="xs" transform="up-2" />
        </div>
      </Button>
    </div>
  ) : null;
};

export default () => {
  const [scanId, setScanId] = useState("");
  const [showNotif, setShowNotif] = useState(false);
  const [popUp, setPopUp] = useState(false);
  const [notifType, setNotifType] = useState("returned");

  const { sessionToken } = useAuth();
  const navigate = useNavigate();

  const onScan = async (id: string) => {
    setScanId(id);
    try {
      let response = await axios.post(
        `${config.serverUrl}/api/dish/return?qid=${id}`,
        {
          returned: {
            broken: false,
            lost: false,
          },
        },
        {
          headers: {
            "x-api-key": config.apiKey,
            "session-cookie": sessionToken,
          },
        }
      );

      if (response && response.status === 200) {
        if (showNotif) setShowNotif(false);
        setNotifType("returned");
        setShowNotif(true);
      } else {
        console.log("failed to return dish, response not okay");
        console.log(response);
      }
    } catch (error: any) {
      console.log("failed to return dish");
      console.log(error);
    }
  };

  const onCancel = popUp
    ? () => {
        setPopUp(false);
      }
    : null;

  const onClick = () => {
    setPopUp(true);
  };

  const onSubmit = async (condition: string) => {
    try {
      let response = await axios.post(
        `${config.serverUrl}/api/dish/condition?qid=${scanId}`,
        { condition },
        {
          headers: {
            "x-api-key": config.apiKey,
            "session-token": sessionToken,
          },
        }
      );
      if (response && response.status === 200) {
        setPopUp(false);
        if (showNotif) {
          setShowNotif(false);
        }
        setNotifType("reported");
        setShowNotif(true);
      } else {
        console.log("failed to update dish condition, response not okay");
        console.log(response);
      }
    } catch (error: any) {
      console.log("failed to update dish conditon");
      console.log(error);
    }
  };

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
        id={scanId}
      />
    </>
  );
};
