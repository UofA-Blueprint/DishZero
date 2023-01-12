const express = require("express");
const admin = require("firebase-admin");
const { stringify } = require("csv-stringify");
require("dotenv").config();

// initialize express
const app = express();
const PORT = 3000;
app.listen(PORT, () => console.log("listening on port " + PORT));

// initialize Firebase Admin
const serviceAccount = require(process.env.PRIVATE_KEY_PATH); // generate private key from Firebase console
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function serializeDatabase() {
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

  // query transactions
  transactionsRef.get().then((querySnapshot) => {
    // get all transactions documents
    let docs = querySnapshot.docs;

    // process every documents
    docs.forEach(async (doc) => {
      // load secondary docs
      const takenByUserDocSnapshot = await doc.get("user").get();
      const dishesDocSnapshot = await doc.get("dish").get();

      // extract fields
      const timestampCheckOut = doc.get("timestamp").toDate().toISOString();
      const takenBy = takenByUserDocSnapshot.get("id");
      // const takenBy = takenByUserDocSnapshot.get("email").split("@")[0];
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
          // returnedBy = returnedByUserDocSnapshot.get("email").split("@")[0];
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

  return stringifier;
}

app.get("/api/v1/transactions", async (req, res) => {
  // generate stringifier stream containing the csv data
  const stringifier = await serializeDatabase();

  // set the response header to be an attachment
  res.setHeader(
    "Content-disposition",
    "attachment; filename=" + "transactions.csv"
  );
  res.setHeader("Content-type", "application/csv");

  // write the csv data to the response object
  stringifier.on("readable", () => {
    let data;
    while ((data = stringifier.read())) {
      res.write(data); // keep writing data to response until reaches end of stringifier
    }

    stringifier.end(); // end stringifier
    res.end(); // end response
  });

  res.status(200);
});
