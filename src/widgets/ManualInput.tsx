import { Button, InputGroup } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

const ManualInput = ({ setFacingMode, FacingMode, setPopUp, DishID, setDishID }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    setPopUp(true)
    return false;
  }
  return (

    <div className="start-0 position-fixed bottom-0 w-100 px-2" >
      <div>
      
      <Form onSubmit={handleSubmit}>

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
    </div>
  )
}

export default ManualInput