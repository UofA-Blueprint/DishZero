import { createContext, useEffect, useState } from 'react'
import { initializeApp } from "firebase/app";
import { getAuth, User } from "firebase/auth";
import { GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// This file stores the firebase configuration credentials and should not be changed.
// All the required functionalities (which themselves require these credentials) have been exported
// and can be imported in another file. Example: App.tsx, line: 7

const firebaseConfig = {
    apiKey: "AIzaSyC0CRtoe1eoBS5hwAAJWyS8Us5C1K501mY",
    authDomain: "dishzero-serviet.firebaseapp.com",
    projectId: "dishzero-serviet",
    storageBucket: "dishzero-serviet.appspot.com",
    messagingSenderId: "273096823928",
    appId: "1:273096823928:web:3ae7f21ca35890cc86098d",
    measurementId: "G-YH3SYRJJ6D",
};

interface AppFirebase {
    user: User | null
}

const app = initializeApp(firebaseConfig);

const GoogleAuth = new GoogleAuthProvider();
GoogleAuth.setCustomParameters({hd: 'ualberta.ca'})

const FirebaseContext = createContext<AppFirebase | null>(null);
const FirebaseAuth = getAuth(app);
const FirebaseDatabase = getFirestore(app);

export { FirebaseContext, GoogleAuth, FirebaseAuth, FirebaseDatabase}

export default ({ children }) => {
    const [user, setUser] = useState<User | null>(FirebaseAuth.currentUser);
    
    const firebase: AppFirebase = {
        user: user,
    }

    useEffect(() => {
        const unsubscribe = FirebaseAuth.onAuthStateChanged(setUser);
        return unsubscribe;
    }, []);

    return (
        <FirebaseContext.Provider value={firebase}>
            {children}
        </FirebaseContext.Provider>
    )
}
