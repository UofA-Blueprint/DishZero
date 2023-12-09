import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore, Timestamp, FieldValue, Filter } from 'firebase-admin/firestore'
import * as admin from 'firebase-admin'
const serviceAccount = require('../../credentials.json')

initializeApp({
    credential: cert(serviceAccount),
})

const db = getFirestore()
const auth = admin.auth()

export { db, Timestamp, FieldValue, Filter, auth }
