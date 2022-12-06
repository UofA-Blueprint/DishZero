import firebase from "firebase/compat";
import { collection, Timestamp, addDoc, getDocs, query, where, updateDoc, doc } from "firebase/firestore";


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

    CheckInDish: async function (db: any, transaction: any) {
        const returnedData = {
            timestamp: Timestamp.fromDate(new Date(Date.now())),
        }
        await updateDoc(doc(db, this.TransactionsCollectionName, transaction.docId), {
            "returned": returnedData,
        })
    },

    UpdateDishCondition: async function (db: any, transaction: any, condition: string) {
        await updateDoc(doc(db, this.TransactionsCollectionName, transaction.docId), {
            "returned.condition": condition,
        })
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

    // returns the most recent transaction given a query
    getTransaction: async function (db: any, dish: any){
        const q = query(collection(db, DishAPI.TransactionsCollectionName), where("dish", "==", dish)); 
        const querySnapshot = await getDocs(q);
        let transactions: any = [];
        querySnapshot.forEach((doc) => {
            let docData: any = doc.data()
            transactions.push({docId: doc.id, ...docData})
        });
        if (transactions.length > 1) {
            let recent: any = transactions[0].timestamp;
            for (let transaction of transactions) {
                if (transaction.timestamp > recent)
                    recent = transaction.timestamp;
            }
            for (let transaction of transactions) {
                if (transaction.timestamp == recent) {
                    return transaction;
                }
            }
        } else {
            return transactions[0];
        }
    },

    getDishID: async function (db: any, user: string, qr_dish: string) {
        const q = query(collection(db, this.DishCollectionName), where("qid", "==", qr_dish));
        const dishes  = await this.getDishesbyQuery(q);
        return dishes[0];
    },
}
export default DishAPI;