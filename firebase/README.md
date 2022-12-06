## Quick Documentation

These files are created using firebase cli. This makes it convenient to track changes in the firebase repository rather than uncommited version control on Firebase.


First, follow ![this tutorial](https://firebase.google.com/docs/cli) to set up firebase cli on your system. 

Login with ``firebase login`` with your credentials.

If you want to recreate these files, try running

``firebase init firestore``

For this specific task, we can deploy rules using the following command

``firebase deploy --only firestore:rules``


Note: This command in the security rules allows all users read/write request
``match /{document=**} { // Allow r/w for now
  		allow read, write: if true;
  	}`` 

Thanks