import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import { Container, Nav } from 'react-bootstrap'
import Navbar from 'react-bootstrap/Navbar';

const CheckOutTop = ({ style }) => {
  return (
    <div>
      <Navbar style={style} bg="dark" expand="lg" variant="dark">
        <Container>
          <Navbar.Brand> Scan QRCode
          </Navbar.Brand>
          <Navbar.Text>
            <FontAwesomeIcon icon={faClose} />
          </Navbar.Text>
        </Container>
      </Navbar>
    </div>
  )
}

export default CheckOutTop