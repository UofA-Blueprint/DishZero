import { Button, InputGroup } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee, faSearch } from '@fortawesome/free-solid-svg-icons'
import ScanQRCode from "./ScanQRCode";

const CheckOutInput = ({setPopUp, DishID,setDishID}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    setPopUp(true)
    return false;
  }
  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <ScanQRCode setDishID={setDishID} />
        <InputGroup className="mb-3">
          <InputGroup.Text>
            <FontAwesomeIcon icon={faSearch} />
          </InputGroup.Text>
          <Form.Text className="text-muted">

          </Form.Text>
          <Form.Control value={DishID} onChange={(e) => setDishID(e.target.value)} type="text" placeholder="Enter dish id #" />
          <Button onSubmit={handleSubmit} variant="outline-primary" type="submit" className="mr-sm-2">
            Search
          </Button>
        </InputGroup >
      </Form>
    </div>
  )
}

export default CheckOutInput