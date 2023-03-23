const express = require("express");
const admin = require("firebase-admin");
const { stringify } = require("csv-stringify");

require("dotenv").config();

// initialize express
const app = express();
const PORT = 3000;
app.listen(PORT, () => console.log("listening on port " + PORT));
const scheduledJobsRouter = require("./routes/scheduledJobs.js");
const dishDataRouter = require("./routes/dishData");
const {router: updateConfigRouter} = require("./routes/updateConfig.js");

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

app.get("/api/v1/transactions", async (req, res) => {
  // get query parameters
  const from = req.query.from;
  const to = req.query.to;

  // generate stringifier stream containing the csv data
  const stringifier = await serializeDatabase(from, to);

  // set the response to be an attachment
  res.setHeader(
    "Content-disposition",
    "attachment; filename=" + "transactions.csv"
  );
  res.setHeader("Content-type", "text/csv");
  res.status(200);

  // transactions is not empty
  if (stringifier) {
    // write the csv data to the response object
    stringifier.on("readable", () => {
      let data;
      while ((data = stringifier.read())) {
        res.write(data); // keep writing data to response until reaches end of stringifier
      }

      stringifier.end(); // end stringifier
      res.end(); // end response
    });
  }

  // transactions is empty
  else res.end();
});

app.use('/scheduledJobs', scheduledJobsRouter.router);
app.use('/updateConfig', updateConfigRouter);
app.use('/dish', dishDataRouter.router);