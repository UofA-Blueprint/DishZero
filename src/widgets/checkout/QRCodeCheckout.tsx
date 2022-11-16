import {useParams} from "react-router-dom";

const QRCodeCheckout = () => {
    const { id } = useParams();

    return (
        <>
            {/*TODO: Add QR code functionality*/}
            QR-Code: {id}
        </>
    )
}

export default QRCodeCheckout;