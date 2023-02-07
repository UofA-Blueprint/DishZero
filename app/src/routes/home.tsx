import { Link } from "react-router-dom";
import { faAngleDoubleLeft, faQrcode } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import scan_icon from "../assets/scan.svg";

export default () => {
  return (
    <div className="position-absolute bottom-0 end-0">
      <Link to={"/borrow"}>
        <img src={scan_icon} alt="scan icon" />
      </Link>
    </div>
  );
};
