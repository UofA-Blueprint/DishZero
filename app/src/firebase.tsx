import {initializeApp} from 'firebase/app'
import 'firebase/auth'
import { GoogleAuthProvider, getAuth } from 'firebase/auth'

// can change to use env variables if we don't want info on github
const app = initializeApp({
        "apiKey": "AIzaSyC0CRtoe1eoBS5hwAAJWyS8Us5C1K501mY",
        "authDomain": "dishzero-serviet.firebaseapp.com",
        "projectId": "dishzero-serviet",
        "storageBucket": "dishzero-serviet.appspot.com",
        "messagingSenderId": "273096823928",
        "appId": "1:273096823928:web:3ae7f21ca35890cc86098d",
        "measurementId": "G-YH3SYRJJ6D",
    
})

const provider = new GoogleAuthProvider();
provider.setCustomParameters({hd: 'ualberta.ca'})
const auth = getAuth(app)

export {auth, provider}

export default app