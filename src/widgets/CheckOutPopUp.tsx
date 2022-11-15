import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const CheckOutPopUp = ({setPopUp, PopUp, DishID}) => {
  return (
    <div>
      <Modal onHide={()=>setPopUp(false)} show={PopUp} className="modal-dialog-centered modal-sm" centered>
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p style={{ textAlign: 'center' }}>ID : {DishID}</p>
          <FontAwesomeIcon icon={faCoffee} size="4x" />
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="secondary" onClick={()=>setPopUp(false)}>
            Check Out
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default CheckOutPopUp