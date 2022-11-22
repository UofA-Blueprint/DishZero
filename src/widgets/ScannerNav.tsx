import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Container } from 'react-bootstrap'
import Navbar from 'react-bootstrap/Navbar';
import X_icon from "../styles/X_icon.svg"
const CloseIcon = () =>{
  return (
    <div className="position-absolute translate-middle" style={{"top":"50%","right":"10px"}}>
      <img src={X_icon} style={{width:"1em"}} />
    </div>
  )
}
const ScannerNav = ({ handleClose, title, style }) => {
  return (
    <div>
      <Navbar className="justify-content-space-between qr-scan-nav" style={style} bg="light" expand="lg" variant="light">
        <Container>
          <div />
          <Navbar.Brand style={{marginRight:"0px"}}> {title}
          </Navbar.Brand>
          <Navbar.Text style={{ cursor: "pointer" }} onClick={handleClose}>
            {/* <FontAwesomeIcon icon={faClose} /> */}
            <CloseIcon />
          </Navbar.Text>
        </Container>
      </Navbar>
    </div>
  )
}

export default ScannerNav