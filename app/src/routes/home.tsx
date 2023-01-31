import {
    Link
} from "react-router-dom";
import { faAngleDoubleLeft, faQrcode } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default () => {

    return (
        <div className="position-absolute bottom-0 end-0">
            <Link to={"/borrow"}>
                <FontAwesomeIcon icon={faQrcode} size="4x" />
            </Link>
        </div>
    )
}
