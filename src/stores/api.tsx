import firebase from "firebase/compat";
import { collection, Timestamp, addDoc } from "firebase/firestore";


const DishAPI = {
    TransactionsCollectionName: "transactions",
    DishCollectionName: "dishes",
    UserCollectionName: "users",

    CheckOutDish: async function (db: any, user: string, dish: string) {
        const docData = {
            dish: dish,
            user: user,
            returned: {},
            timestamp: Timestamp.fromDate(new Date(Date.now())),
        }

        const docRef = await addDoc(collection(db, this.TransactionsCollectionName), docData);
        return docRef
    },
}
export default DishAPI;