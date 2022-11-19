import DishAPI from "../stores/api"
import { useSelector } from 'react-redux';
import { selectUserEmail } from '../features/userSlice';

const QRCheckout = async (DishID: any) => {
    const userEmail = useSelector(selectUserEmail);
    if (userEmail == null) {
        console.log("Invalid Session.");
        return;
    }
    DishAPI.CheckOutDish(userEmail, DishID)
}

export default QRCheckout;