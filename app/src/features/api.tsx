import { collection, Timestamp, addDoc, getDocs, query, where, runTransaction, doc, orderBy, limit } from "firebase/firestore";
import { FirebaseDatabase } from "../firebase";

const TransactionsCollectionName = "transactions"
const DishCollectionName = "dishes"
const UserCollectionName = "users"
const QRCollectionName = "qr-codes"

const DishAPI = {
  addDishBorrow: async function (qr: string, user: string | null) {

    console.log(FirebaseDatabase, QRCollectionName, qr)
    const qrRef = doc(FirebaseDatabase, QRCollectionName, qr);

    console.log("Transaction run for", qr, user)

    try {
      await runTransaction(FirebaseDatabase, async (transaction) => {
        const qrDoc = await transaction.get(qrRef)
        if (!qrDoc.exists()) {
          throw "QR code not registered";
        }

        const dish = qrDoc.data().dish

        const docData = {
          dish: dish,
          user: user,
          timestamp: Timestamp.now(),
        }

        const docRef = doc(collection(FirebaseDatabase, TransactionsCollectionName));

        // TODO: handle no existing qr code case
        await transaction.set(docRef, docData);

        return docRef;
      });
      console.log("Transaction successfully committed!");
    } catch (e) {
      console.log("Transaction failed: ", e);
    }
  },

  updateDishReturn: async function (qr: string) {
    console.log(FirebaseDatabase, QRCollectionName, qr)
    const qrRef = doc(FirebaseDatabase, QRCollectionName, qr);

    console.log("Transaction run for ", qr)

    try {
      await runTransaction(FirebaseDatabase, async (transaction) => {
        const qrDoc = await transaction.get(qrRef)
        if (!qrDoc.exists()) {
          throw "QR code not registered";
        }
        
        const dish = qrDoc.data().dish;

        // get most recent transaction for the given qr code
        const q = query(collection(FirebaseDatabase, TransactionsCollectionName), where("dish", "==", dish), orderBy("timestamp", "desc"), limit(1));
        const docRef = await getDocs(q);

        // TODO: handle no existing qr code case
        transaction.update(docRef, { returned: [{timestamp: Timestamp.now()}] });

        return docRef;
      });
      console.log("Transaction successfully committed!");
    } catch (e) {
      console.log("Transaction failed: ", e);
    }
  },

  updateDishCondition: async function (qr: string, condition: string) {
    console.log(FirebaseDatabase, QRCollectionName, qr)
    const qrRef = doc(FirebaseDatabase, QRCollectionName, qr);

    console.log("Transaction run for ", qr)

    try {
      await runTransaction(FirebaseDatabase, async (transaction) => {
        const qrDoc = await transaction.get(qrRef)
        if (!qrDoc.exists()) {
          throw "QR code not registered";
        }
        
        const dish = qrDoc.data().dish;

        // get most recent transaction for the given qr code
        const q = query(collection(FirebaseDatabase, TransactionsCollectionName), where("dish", "==", dish), orderBy("timestamp", "desc"), limit(1));
        const docRef = await getDocs(q);
        const doc = await transaction.get(docRef);

        let returned = doc.data().returned;
        returned["condition"] = condition;

        // TODO: handle no existing qr code case
        transaction.update(docRef, { returned: returned });

        return docRef;
      });
      console.log("Transaction successfully committed!");
    } catch (e) {
      console.log("Transaction failed: ", e);
    }
  },
}
export default DishAPI;
