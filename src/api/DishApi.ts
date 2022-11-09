import firebase from "firebase/compat";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";

const DishApi = {
    collectionName: "dishes",

    executeQueryAndGetDishes: async function(q: any) {
        const querySnapshot = await getDocs(q);
        let dishes: any = [];
        querySnapshot.forEach((doc) => {
            let docData: any = doc.data()
            dishes.push({docId: doc.id, ...docData})
        });
        return dishes;
    },

    getAvailableDishes: async function (db: any) {
        const q = query(collection(db, this.collectionName), where("status", "==", 0));
        const querySnapshot = await getDocs(q);
        let dishesAvail: any = await this.executeQueryAndGetDishes(q);
        return dishesAvail;
    },

    getAllDishes: async function(db: any) {
        const q = query(collection(db, this.collectionName));
        let dishes: any = await this.executeQueryAndGetDishes(q);;
        return dishes;
    },

    checkOutDish: async function(db: any, dish: any) {
        await updateDoc(doc(db, this.collectionName, dish.docId), {
            status: 1
        });
    },

    checkInDish: async function(db: any, dish: any) {
        await updateDoc(doc(db, this.collectionName, dish.docId), {
            status: 0
        });
    },
}

export default DishApi;