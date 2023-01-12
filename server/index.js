const express = require("express");
const admin = require("firebase-admin");
const fs = require("fs");
const mime = require("mime");
const path = require("path");
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
  // generate the CSV file on the server
  const stringifier = await serializeDatabase();

  res.setHeader(
    "Content-disposition",
    "attachment; filename=" + "transactions.csv"
  );
  res.setHeader("Content-type", "application/csv");

  // send the file as a response to the client
  stringifier.on("readable", () => {
    const data = stringifier.read();
    res.write(data, () => {
      res.end();
    });
  });

  res.status(200);
});
