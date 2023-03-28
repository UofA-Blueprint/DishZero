import { createContext, useEffect, useState } from 'react'
import { initializeApp } from "firebase/app";
import { getAuth, User as FirebaseUser } from "firebase/auth";
import { GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDoc, doc } from "firebase/firestore";

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

enum Role {
    BASIC = "basic",
    VOLUNTEER = "volunteer",
    ADMIN = "admin"
}

interface User {
    user: FirebaseUser,
    role: Role
}

const app = initializeApp(firebaseConfig);

const GoogleAuth = new GoogleAuthProvider();
GoogleAuth.setCustomParameters({hd: 'ualberta.ca'})

const FirebaseContext = createContext<User | null>(null);
const FirebaseAuth = getAuth(app);
const FirebaseDatabase = getFirestore(app);

export { FirebaseContext, GoogleAuth, FirebaseAuth, FirebaseDatabase, Role}

export default ({ children }) => {
    const [user, setUser] = useState<FirebaseUser | null>(FirebaseAuth.currentUser);
    const [role, setRole] = useState<Role>(Role.BASIC)

    let firebase: User | null = null
    if (user != null) {
        firebase = {
            user: user,
            role: role
        }
    }
    

    useEffect(() => {
        const unsubscribe = FirebaseAuth.onAuthStateChanged(setUser);
        return unsubscribe;
    }, []);

    useEffect(() => {
        let subscribed = true
        if (user != null) {
            const docRef = doc(FirebaseDatabase, "users", user.uid);
            getDoc(docRef).then((doc) => {
                if (subscribed) {
                    let role = Role.BASIC
                    if (doc.exists()) {
                        role = doc.data().role
                    }
    
                    // Filter out any "erroneous" values
                    if (role != Role.ADMIN && role != Role.VOLUNTEER) {
                        role = Role.BASIC
                    }
                    setRole(role)
                }
            })
        }
        return () => {subscribed = false};
    }, [user])

    return (
        <FirebaseContext.Provider value={firebase}>
            {children}
        </FirebaseContext.Provider>
    )
}
