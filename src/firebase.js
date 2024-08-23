import firebase from 'firebase';

const firebaseConfig = firebase.initializeApp({
    apiKey: "AIzaSyB4GpFcV29DI9JkNs71xtW4X8dQaGXsIFw",
    authDomain: "instagram-estudo.firebaseapp.com",
    projectId: "instagram-estudo",
    storageBucket: "instagram-estudo.appspot.com",
    messagingSenderId: "270744678936",
    appId: "1:270744678936:web:ffcaa6ef9ee3dc52fb896d",
    measurementId: "G-5X7L1W7M38"
  });

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
const functions = firebase.functions();

export {db, auth, storage, functions}