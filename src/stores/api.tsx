import firebase from "firebase/compat";
import { collection, Timestamp, addDoc } from "firebase/firestore";
import { firestore } from "../firebase";

const DishAPI = {
    TransactionsCollectionName: "transactions",
    DishCollectionName: "dishes",
    UserCollectionName: "users",

    CheckOutDish: async function (user: string, dish: string) {
        const docData = {
            dish: dish,
            user: user,
            returned: {},
            timestamp: Timestamp.fromDate(new Date(Date.now())),
        }

        const docRef = await addDoc(collection(firestore, this.TransactionsCollectionName), docData);
        return docRef
    },
}
export default DishAPI;