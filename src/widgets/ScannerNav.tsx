import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Container } from 'react-bootstrap'
import Navbar from 'react-bootstrap/Navbar';

const CheckOutTop = ({ title, style }) => {
  return (
    <div>
      <Navbar style={style} bg="dark" expand="lg" variant="dark">
        <Container>
          <Navbar.Brand> Scan QRCode | {title}
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