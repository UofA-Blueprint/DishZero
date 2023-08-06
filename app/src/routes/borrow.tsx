import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Scanner from "../widgets/scanner";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { faCoffee, faExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DishAPI from "../features/api";
import { FirebaseContext } from "../firebase";

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
              <div>Return by ...</div>
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
  const [scanId, setScanId] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [dishNotFound, setDishNotFound] = useState(false);
  const [borrowDishResult, setBorrowDishResult] = useState({
    show: false,
    success: false,
  });
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

    try {
      const docId = await DishAPI.addDishBorrow(scanId, user);
      if (docId === null) {
        setDishNotFound(true);
        return;
      }

      setBuffer(true);

      const transactionID = docId;

      if (!firebase?.user) {
        console.log('USER IS NULL');
        navigate(`/login/?transaction_id=${transactionID}`);
        console.log('LOGGED out user' + user);
      }
      setBorrowDishResult({ show: true, success: true });
    } catch (e) {
      console.log(e);
      setBorrowDishResult({ show: true, success: false});
    }
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
        onClose={() => navigate('/home')}
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
