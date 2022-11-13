import firebase from 'firebase/app';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from 'firebase/auth';



const firebaseConfig = {
    apiKey: "AIzaSyC0CRtoe1eoBS5hwAAJWyS8Us5C1K501mY",
    authDomain: "dishzero-serviet.firebaseapp.com",
    projectId: "dishzero-serviet",
    storageBucket: "dishzero-serviet.appspot.com",
    messagingSenderId: "273096823928",
    appId: "1:273096823928:web:3ae7f21ca35890cc86098d",
    measurementId: "G-YH3SYRJJ6D"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();


export {auth, provider}