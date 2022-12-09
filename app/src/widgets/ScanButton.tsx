import { Button } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQrcode } from '@fortawesome/free-solid-svg-icons'

const ScanButton = ({onClick,style}) => {
  return (
    <div style={style} className="position-absolute bottom-0 end-0">
      <Button onClick={onClick} variant="primary">
        <FontAwesomeIcon icon={faQrcode} size="4x" />
        {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M48 32C21.5 32 0 53.5 0 80v96c0 26.5 21.5 48 48 48h96c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48H48zm80 64v64H64V96h64zM48 288c-26.5 0-48 21.5-48 48v96c0 26.5 21.5 48 48 48h96c26.5 0 48-21.5 48-48V336c0-26.5-21.5-48-48-48H48zm80 64v64H64V352h64zM256 80v96c0 26.5 21.5 48 48 48h96c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48H304c-26.5 0-48 21.5-48 48zm64 16h64v64H320V96zm32 352v32h32V448H352zm96 0H416v32h32V448zM416 288v32H352V288H256v96 96h64V384h32v32h96V352 320 288H416z" /></svg> */}
      </Button>
    </div>
  )
}

export default ScanButton