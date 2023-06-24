import { initializeApp, applicationDefault, cert } from 'firebase-admin/app'
import { getFirestore, Timestamp, FieldValue, Filter } from 'firebase-admin/firestore'
const serviceAccount = require('../../credentials.json')

initializeApp({
    credential: cert(serviceAccount),
})

const db = getFirestore()

export { db, Timestamp, FieldValue, Filter }
