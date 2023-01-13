import {initializeApp, cert} from 'firebase-admin/app';
import serviceAccount from "./secrets/dishzero-serviet-firebase-adminsdk-bcfs3-a76bae2ee3.json" assert { type: "json" };
import { getFirestore } from 'firebase-admin/firestore';

initializeApp({
    credential: cert(serviceAccount)
});

const db = getFirestore();

export default db;