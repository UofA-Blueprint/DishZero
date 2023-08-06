import { collection, Timestamp, getDoc, getDocs, query, where, runTransaction, doc, orderBy, limit } from "firebase/firestore";
import { FirebaseDatabase } from "../firebase";

const TransactionsCollectionName = "transactions-new"
const DishCollectionName = "dishes"
const UserCollectionName = "users"
const QRCollectionName = "qr-codes"

const DishAPI = {
  getUserActiveDishes: function (uid: string) {
    try {
      const result = runTransaction(FirebaseDatabase, async (transaction) => {
        const q = query(collection(FirebaseDatabase, TransactionsCollectionName), where("user", "==", uid), where("returned", "==", null), orderBy("timestamp", "desc"));
        const qSnapshot = await getDocs(q);
        const transactions = qSnapshot.docs.map((doc) => doc.data());
        var dishRefs = transactions.reduce((t, dishRefs) => {
          dishRefs.push(t.dish);
          return dishRefs;
        }, []);
        var dishes = dishRefs.reduce(async (dishRef, dishes) => {
          dishes.push(await transaction.get(dishRef))
        });
        return dishes.map((dish) => dish.data());
      });
    } catch (err) {
      alert("There was an issue getting active dishes.\nError: " + err);
      console.log(err);
      return [];
    }
  },
  addNewDish: async function (qr: string, type: string) {
    const qrRef = doc(FirebaseDatabase, QRCollectionName, qr);
    try {
      const result = await runTransaction(FirebaseDatabase, async (transaction) => {
        const qrDoc = await transaction.get(qrRef);
        if (qrDoc.exists()) {
          alert("QR code already registered");
        } else {
          const dishRef = doc(collection(FirebaseDatabase, DishCollectionName));
          const dishData = { type: type, qid: qr, registered: Timestamp.now() };
          await transaction.set(dishRef, dishData);
          const qrData = { dish: dishRef };
          await transaction.set(qrRef, qrData);
        }
      });
    } catch (err) { 
      alert("There was an issue adding the dish to the database.")
      console.log(err);
    }
  },
  addDishBorrow: async function (qr: string, user: string | null) {

    console.log(FirebaseDatabase, QRCollectionName, qr)
    const qrRef = doc(FirebaseDatabase, QRCollectionName, qr);

      const out = await runTransaction(FirebaseDatabase, async (transaction) => {
        const qrDoc = await transaction.get(qrRef)
        if (!qrDoc.exists()) {
          return null;
        }

        const dishRef = doc(FirebaseDatabase, "dishes", qrDoc.data().dishID);
        const dishSnap = await getDoc(dishRef);

        if (dishSnap.exists()) {
          const dish = dishSnap.data();
          const docData = {
            dish: dish,
            user: user,
            timestamp: Timestamp.now(),
          }
          const docRef = doc(collection(FirebaseDatabase, TransactionsCollectionName));
          transaction.set(docRef, docData);
          return docRef.id;
        }
      });
      return out;
  },

  updateDishReturn: async function (qr: string) {
    const qrRef = doc(FirebaseDatabase, QRCollectionName, qr);

      await runTransaction(FirebaseDatabase, async (transaction) => {
        const qrDoc = await transaction.get(qrRef)
        if (!qrDoc.exists()) {
          throw "QR code not registered";
        }
        
        const dish = qrDoc.data().dish;
        // get most recent transaction for the given qr code
        const q = query(collection(FirebaseDatabase, TransactionsCollectionName), where("dish", "==", dish), orderBy("timestamp", "desc"), limit(1));
        const qSnapshot = await getDocs(q);
        const docRef = qSnapshot.docs[0].ref;

        // TODO: handle no existing qr code case
        transaction.update(docRef, { returned: {timestamp: Timestamp.now()} });
        return "docRef";
      });
      return null;
  },

  updateDishCondition: async function (qr: string, condition: string) {
    const qrRef = doc(FirebaseDatabase, QRCollectionName, qr);
    console.log("Transaction run for", qr)

    try {
      await runTransaction(FirebaseDatabase, async (transaction) => {
        const qrDoc = await transaction.get(qrRef)
        if (!qrDoc.exists()) {
          throw "QR code not registered";
        }
        
        const dish = qrDoc.data().dish;

        // get most recent transaction for the given qr code
        const q = query(collection(FirebaseDatabase, TransactionsCollectionName), where("dish", "==", dish), orderBy("timestamp", "desc"), limit(1));
        const qSnapshot = await getDocs(q);
        const doc = qSnapshot.docs[0];
        if (doc) {
          let returned = doc.data().returned;
          returned["condition"] = condition;

          // TODO: handle no existing qr code case
          transaction.update(doc.ref, { returned: returned });
        }
        return doc.ref;
      });
      console.log("Transaction successfully committed!");
    } catch (e) {
      console.log("Transaction failed:", e);
    }
  },
  updateDocWithuserId: async function (transaction_id: string, user_id: string) {
    const transactionRef = doc(FirebaseDatabase, TransactionsCollectionName, transaction_id);
    console.log("Transaction run for", transaction_id)


    try {
      await runTransaction(FirebaseDatabase, async (transaction) => {
        const doc = await transaction.get(transactionRef);
        
        if (doc) {
          let returned = doc.data();
          transaction.update(doc.ref, { user: user_id });
        }
        return doc.ref;
      });
      console.log("Transaction successfully committed!");
    } catch (e) {
      console.log("Transaction failed:", e);
    }
  }
}
export default DishAPI;
