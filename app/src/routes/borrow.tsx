import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Scanner from "../widgets/scanner";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { faCoffee } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DishAPI from "../features/api";
import { FirebaseContext } from "../firebase";
import Login from "./login";
import { GoogleAuth, FirebaseAuth } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import Cookies from 'js-cookie';
import axios from "axios";



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
        <p style={{ textAlign: "center" }}>ID : {id}</p>
        <FontAwesomeIcon icon={faCoffee} size="4x" />
      </Modal.Body>
      <Modal.Footer className="justify-content-center">
        <Button variant="secondary" onClick={onSubmit}>
          Borrow
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default () => {
  const sessionToken = Cookies.get('sessionToken')
  const [scanId, setScanId] = useState("");
  const [confirm, setConfirm] = useState(false);
  const firebase = useContext(FirebaseContext);
  const navigate = useNavigate();
  const [Buffer, setBuffer] = useState(false);
  const onScan = confirm
    ? null
    : (id: string) => {
        setScanId(id);
        setConfirm(true);
      };

  const OnConfirm = async () => {
    if (!confirm) {
      return false;
    }
    setConfirm(false);
    const user = firebase?.user?.uid || null;
    console.log("USER: " + user);
    console.log("scanid", scanId)

    axios.post(`${process.env.REACT_APP_BACKEND_ADDRESS}/api/dish/borrow`, {}, {headers:{"x-api-key":"test","session-token":sessionToken}, params:{"qid":scanId}})
    .then(function (response) {
      navigate("/home")
    })
    .catch(function (error) {
      alert(error.response.data.message)
      console.log(error.response.data.message);
    });
    
    // const docId = await DishAPI.addDishBorrow(scanId, user);
    // setBuffer(true);

    // console.log("doc ref" + docId);
    // const transactionID = docId;

    // if (!firebase?.user) {
    //   console.log("USER IS NULL");
    //   navigate(`/login/?transaction_id=${transactionID}`);
    // }
    // console.log("Logged out user" + user);
  };

  const onCancel = confirm
    ? () => {
        setScanId("");
        setConfirm(false);
      }
    : null;

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
          await OnConfirm();
        }}
        onCancel={onCancel}
      />
    </>
  );
};
