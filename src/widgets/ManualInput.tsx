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

    <div className="start-0 position-fixed bottom-0 w-100 px-5" >
      <div>
      
      <Form onSubmit={handleSubmit}>

        <InputGroup className="mb-3">
          
          <InputGroup.Text className="search-bar">
            <FontAwesomeIcon icon={faSearch} />
          </InputGroup.Text>
          <Form.Text className="text-muted">

          </Form.Text>

          <Form.Control className="search-bar" value={DishID} onChange={(e) => setDishID(e.target.value)} type="text" placeholder="Enter dish id #" />
          
          <Button onSubmit={handleSubmit} variant="light" type="submit" className="mr-sm-2 search-bar search-button">
            Enter
          </Button>
          
        </InputGroup >
      </Form>
      </div>
    </div>
  )
}

export default ManualInput