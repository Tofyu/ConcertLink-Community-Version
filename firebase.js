import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAN0Cl8Z-KP6sUYFAG46-c4eeoq_q7Hvc8",
    authDomain: "concertlink-3e652.firebaseapp.com",
    projectId: "concertlink-3e652",
    storageBucket: "concertlink-3e652.appspot.com",
    messagingSenderId: "630341825141",
    appId: "1:630341825141:web:19c0be70df5ba2a1f73e3c"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
export const auth = getAuth();

