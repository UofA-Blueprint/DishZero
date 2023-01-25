/*
  Should we make const db = admin.firestore(); global?
  Function definition in another files
  Users incorrectly defined
  Where should I define the route dir for /admin?
  Another port number for DishZero
  Installed cors, is it fine?
*/


const express = require("express");
const admin = require("firebase-admin");
const { stringify } = require("csv-stringify");
const { response } = require("express");
var cors = require('cors')
var bodyParser = require('body-parser')

// var jsonParser = bodyParser.json()

// const { initializeApp, } = require('firebase-admin/app');

require("dotenv").config();

// initialize express
const app = express();
app.use(bodyParser.json())

app.use(cors())

const PORT = 8000;
app.listen(PORT, () => console.log("listening on port " + PORT));

// initialize Firebase Admin
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


async function getRole(user_id){
  const db = admin.firestore();
  const usersRef = db.collection("users");
  const userDoc = usersRef.doc(user_id);
  const userDocSnapshot = await userDoc.get();
  if (!userDocSnapshot.exists) {
    // throw new Error ("User doesn't exists!");
    return false;
  }
  console.log(userDocSnapshot)
  // catch(error=>{
  //   throw new Error ("Error getting document");
  // })
  // .then(async (userDocSnapshot)=>{
  //   if (!userDocSnapshot.exists) {
  //     throw new Error ("User doesn't exists!");
  //   }
  //   console.log(userDocSnapshot);
  //   }).catch(error=>{
  //     console.log(error)
  //     throw new Error ("Error updating document");
  //   })
  // // });
  // return true
}

async function changeRole(user_id,newrole){
  const db = admin.firestore();
  const usersRef = db.collection("users");
  const userDoc = usersRef.doc(user_id);
  await userDoc.get().
  catch(error=>{
    throw new Error ("Error getting document");
  })
  .then(async (userDocSnapshot)=>{
    if (!userDocSnapshot.exists) {
      throw new Error ("User doesn't exists!");
    }
    await userDoc.update({role: newrole}).then((result)=>{
      // return true
    }).catch(error=>{
      throw new Error ("Error updating document");
    })
  });
  return true
}

async function checkAdmin(req){
  
  let token = req.body.idToken;
  // Creating charge
  let decodedToken = await admin.auth().verifyIdToken(token);
  // console.log(decodedToken.uid)
  const role = await getRole(decodedToken.uid)
  // Checking if user is admin
  return (decodedToken.uid === adminId);
}

app.post("/api/v1/whoami", async (req, res, next) => {
  try{
    const res = await checkAdmin(req);
    res.json({isAdmin:res})
  } catch(err){
    console.log(err)
    res.status(500).json({
      error:err.message 
    })
  }
})
app.get("/api/v1/useractions/changerole", async (req, res, next) => {
  try{
    const user_id = req.query.userid;
    const new_role = req.query.new_role;
    const result = await changeRole(user_id,new_role);

    res.json({result:result})
  } catch(err){
    console.log(err)
    res.status(500).json({
      error:err.message 
    })
  }
})
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
