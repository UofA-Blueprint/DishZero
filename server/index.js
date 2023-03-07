const express = require("express");
const admin = require("firebase-admin");
const serverless = require('serverless-http');
const { stringify } = require("csv-stringify");
require("dotenv").config();
import { serializeDatabase } from "./fb_function";

// initialize express
const app = express();
const PORT = 3000;
app.listen(PORT, () => console.log("listening on port " + PORT));


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

// defining serverless function
module.exports.handler = serverless(app)
