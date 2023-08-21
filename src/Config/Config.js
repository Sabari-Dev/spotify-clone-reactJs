// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB2-3epQXFYTYunHijcSHRxH6Dj65bNrnQ",
  authDomain: "spotify-clone-54db6.firebaseapp.com",
  projectId: "spotify-clone-54db6",
  storageBucket: "spotify-clone-54db6.appspot.com",
  messagingSenderId: "1056339085744",
  appId: "1:1056339085744:web:158737cba094e078c9ee75",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
