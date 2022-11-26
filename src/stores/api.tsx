import firebase from "firebase/compat";
import { collection, Timestamp, addDoc, getDocs, query, where } from "firebase/firestore";


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
    getDishesbyQuery: async function (q:any){
        const querySnapshot = await getDocs(q);
        let dishes: any = [];
        querySnapshot.forEach((doc) => {
            let docData: any = doc.data()
            dishes.push({docId: doc.id, ...docData})
        });
        return dishes;
        
    },
    getDishID: async function (db: any, user: string, qr_dish: string) {
        const q = query(collection(db, this.DishCollectionName), where("qid", "==", qr_dish));
        const dishes  = await this.getDishesbyQuery(q);
        return dishes[0];
    },
}
export default DishAPI;