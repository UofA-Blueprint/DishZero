import firebase from "firebase/compat";
import { collection, query, where, getDocs, getDoc, updateDoc, doc } from "firebase/firestore";


const DishAPI = {
    collection: "dishes",

    executeQuery: async (q:any)=>{
        const querySnapshot = await getDocs(q);
        let dishes: any  = []
        querySnapshot.forEach(doc=>{
            let docData: any  = doc.data()
            dishes.push({docID:doc.id,...docData})
        })
        return dishes;
    },
    getAvailableDishes: async function (db: any) {
        const q = query(collection(db, this.collection), where("status", "==", 1));
        let dishesAvail: any = await this.executeQuery(q);
        return dishesAvail;
    },
    checkDishAvailability: async function(db:any,id:number){
        // const docRef =  doc(db, this.collection, "1");
        // const docSnap = await getDoc(docRef);
        const q = query(collection(db,this.collection),where("id","==",id))
        let avail = await(this.executeQuery(q))
        // console.log(docSnap.data())
        console.log(avail)
        return (avail.length==0)
        // querySnapshot.forEach(doc=>{
        //     let docData: any  = doc.data()
        //     dishes.push({docID:doc.id,...docData})
        // })
        // return docSnap.exists();
        // retr/getDoc(docRef)
        // return avail;
    },
    checkOutDish: async function(db: any, dish: any) {
        await updateDoc(doc(db, this.collection, dish), {
            status: 0
        });
    },
}
export default DishAPI;