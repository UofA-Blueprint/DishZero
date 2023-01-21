const {initializeApp, cert} = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require(process.env.PRIVATE_KEY_PATH); // generate private key from Firebase console

initializeApp({
    credential: cert(serviceAccount)
});

const db = getFirestore();

module.exports = {
    db,
}