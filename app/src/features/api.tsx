import { collection, Timestamp, addDoc, getDocs, query, where, runTransaction, doc } from "firebase/firestore";
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
}
export default DishAPI;
