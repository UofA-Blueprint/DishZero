import { useState, useEffect } from "react";
import React from 'react';
import { useNavigate } from "react-router-dom";
import Scanner from "../widgets/scanner";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { faCoffee, faExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const Confirm = ({ show, onSubmit, onCancel, id }) => {
  return (
    <Modal
      onHide={onCancel}
      show={show}
      className="modal-dialog-centered modal-sm"
      centered
    >
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body className="text-center">
        <FontAwesomeIcon icon={faCoffee} size="4x" />
        <p style={{ textAlign: "center" }}>ID: {id}</p>
      </Modal.Body>
      <Modal.Footer className="justify-content-center">
        <Button variant="secondary" onClick={onSubmit}>
          Borrow
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const DishNotFound = ({ show, onCancel, id }) => {
  return (
    <Modal
      onHide={onCancel}
      show={show}
      className="modal-dialog-centered modal-sm"
      centered
    >
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body className="text-center">
        <FontAwesomeIcon
          style={{ color: '#BF4949', margin: '16 0 16 0' }}
          icon={faExclamation}
          size="4x"
        />
        <p style={{ textAlign: 'center' }}>
          Dish ID: {id} does not exist. Please try again.
        </p>
      </Modal.Body>
    </Modal>
  );
};

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
            </div>
          </>
        ) : (
          <>
            <FontAwesomeIcon
              style={{ color: '#BF4949' }}
              icon={faExclamation}
              size="4x"
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div>Failed to borrow</div>
              <div>Dish # {id} </div>
              <div>Please scan and try again</div>
            </div>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default () => {
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const previousURL = queryParams.get('previousURL');
    console.log(previousURL)
    if (previousURL?.includes("dishzero.ca")) {
      const dishID = (previousURL.match(/dishID=([^&]+)/) || "")[1];
      setConfirm(true);
      setScanId(dishID);
      onConfirm();
    }
  }, []);

  const {currentUser, sessionToken} = useAuth()
  const [scanId, setScanId] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [dishNotFound, setDishNotFound] = useState(false);
  const [borrowDishResult, setBorrowDishResult] = useState({
    show: false,
    success: false,
  });

  const navigate = useNavigate();
  const [Buffer, setBuffer] = useState(false);
  const onScan = confirm
    ? null
    : (id: string) => {
        const dishID = (id.match(/dishID=([^&]+)/) || "")[1];
        setScanId(dishID);
        setConfirm(true);
      };

  const onConfirm = async () => {
    if (!confirm) {
      return false;
    }
    setConfirm(false);
    const user = currentUser?.id || null;
    console.log("USER: " + user);
    console.log("scanid", scanId);

    axios
      .post(
        `${process.env.REACT_APP_BACKEND_ADDRESS}/api/dish/borrow`,{},
        {
          headers: { "x-api-key": `${process.env.REACT_APP_API_KEY}`, "session-token": sessionToken },
          params: { qid: scanId },
        }
      )
      .then(function (response) {
        setBorrowDishResult({ show: true, success: true });
      })
      .catch(function (error) {
        setBorrowDishResult({ show: true, success: false});
        console.log(error);
      });
  };

  const onCancel = () => {
    setScanId('');
    setConfirm(false);
    setDishNotFound(false);
    setBorrowDishResult({ ...borrowDishResult, show: false });
  };

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
        onSubmit={async () => {
          await onConfirm();
        }}
        onCancel={onCancel}
      />
      <DishNotFound show={dishNotFound} id={scanId} onCancel={onCancel} />
      <BorrowDishSuccess
        show={borrowDishResult.show}
        success={borrowDishResult.success}
        onCancel={onCancel}
        id={scanId}
      />
    </>
  );
};
