const serviceAccount = require(process.env.PRIVATE_KEY_PATH); // generate private key from Firebase console
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function serializeDatabase(from = null, to = null) {
  const db = admin.firestore();
  const transactionsRef = db.collection("transactions");
  const columns = [
    "timestamp_check_out",
    "taken_by",
    "dish_id",
    "timestamp_check_in",
    "returned_by",
    "condition",
  ];
  const stringifier = stringify({ header: true, columns: columns }); // stringifier stream
  let emptyTransactions = false; // emptyTransactions flag

  // target dates
  const dateFrom = from ? new Date(from) : null;
  const dateTo = to ? new Date(to) : null;

  // query transactions
  await transactionsRef.get().then((querySnapshot) => {
    // get all transactions documents between the specified date
    let docs =
      dateFrom && dateTo
        ? querySnapshot.docs.filter((doc) => {
            return (
              doc.get("timestamp").toDate() >= dateFrom &&
              doc.get("timestamp").toDate() <= dateTo
            );
          })
        : querySnapshot.docs;

    if (docs.length === 0) emptyTransactions = true; // docs has no results

    // process every documents
    docs.forEach(async (doc) => {
      // load secondary docs
      const takenByUserDocSnapshot = await doc.get("user").get();
      const dishesDocSnapshot = await doc.get("dish").get();

      // extract fields
      const timestampCheckOut = doc.get("timestamp").toDate().toISOString();
      const takenBy = takenByUserDocSnapshot.get("id");
      const dishId = dishesDocSnapshot.get("id");

      // returned field
      const returned = doc.get("returned");
      let timestampCheckIn;
      let returnedBy;
      let condition;
      if (returned) {
        if (returned.user) {
          const returnedByUserDocSnapshot = await returned.user.get();
          returnedBy = returnedByUserDocSnapshot.get("id");
        }
        if (returned.timestamp) {
          timestampCheckIn = returned.timestamp.toDate().toISOString();
        }
        if (typeof returned.broken == "boolean") {
          condition = returned.broken.toString().toUpperCase();
        }
      }

      const row = [
        timestampCheckOut,
        takenBy,
        dishId,
        timestampCheckIn,
        returnedBy,
        condition,
      ];

      stringifier.write(row);
    });
  });

  if (emptyTransactions) return null; // empty transactions
  return stringifier;
}

module.exports = { serializeDatabase };