import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Scanner from "../widgets/scanner";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { faCoffee, faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DishAPI from "../features/api";
import { FirebaseContext } from "../firebase";
import Login from "./login";
import { GoogleAuth, FirebaseAuth } from "../firebase";
import { signInWithPopup } from "firebase/auth";

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

const BorrowError = ({ show, onCancel, id }) => {
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
          style={{ color: 'red', margin: '16 0 16 0' }}
          icon={faCircleExclamation}
          size="4x"
        />
        <p style={{ textAlign: 'center' }}>
          Dish ID: {id} does not exist. Please try again
        </p>
      </Modal.Body>
    </Modal>
  );
};

export default () => {
  const [scanId, setScanId] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [borrowError, setBorrowError] = useState(false);
  const firebase = useContext(FirebaseContext);
  const navigate = useNavigate();
  const [Buffer, setBuffer] = useState(false);
  const onScan = confirm
    ? null
    : (id: string) => {
        setScanId(id);
        setConfirm(true);
      };

  const onConfirm = async () => {
    if (!confirm) {
      return false;
    }
    setConfirm(false);
    const user = firebase?.user?.uid || null;
    console.log("USER: " + user);
    const docId = await DishAPI.addDishBorrow(scanId, user);
    if (docId === null) {
      setBorrowError(true);
    }

    setBuffer(true);

    console.log("doc ref" + docId);
    const transactionID = docId;

    if (!firebase?.user) {
      console.log("USER IS NULL");
      navigate(`/login/?transaction_id=${transactionID}`);
      console.log("LOGGED out user" + user);
    }

  };

  const onCancel = () => {
    setScanId('');
    setConfirm(false);
    setBorrowError(false);
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
      <BorrowError
        show={borrowError}
        id={scanId}
        onCancel={onCancel}
       />
    </>
  );
};
