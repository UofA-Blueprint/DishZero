import firebase from "firebase/compat";
import { collection, query, where, getDocs } from "firebase/firestore";

const DishApi = {
    collectionName: "dishes",

    getAvailableDishes: async function (db: any) {
        const q = query(collection(db, this.collectionName), where("status", "==", 0));
        const querySnapshot = await getDocs(q);
        let dishesAvail: any = [];
        querySnapshot.forEach((doc) => {
            dishesAvail.push(doc.data())
        });
        return dishesAvail;
    }
}

export default DishApi;