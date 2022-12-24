import DishAPI from "../features/api";
import { useSelector } from "react-redux";
// import { selectUserEmail } from "../features/userSlice";
// import { db } from "../firebase"

const QRCheckout = async (qid: any) => {
    // const userEmail = useSelector(selectUserEmail);
    // if (userEmail == null) {
    //     console.log("Invalid Session.");
    //     return;
    // }
    // const DishID = await DishAPI.getDishID(db, qid);
    // DishAPI.CheckOutDish(db, DishID, userEmail);
};

export default QRCheckout;
