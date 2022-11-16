import {useParams} from "react-router-dom";

const QRCodeCheckout = () => {
    const { id } = useParams();

    return (
        <>
            QR-Code: {id}
        </>
    )
}

export default QRCodeCheckout;