// firebase.js
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut 
} from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAzBNj20JCE39AUvRXWoV5VlgNaiL-o_94",
  authDomain: "sendora-9e14f.firebaseapp.com",
  databaseURL: "https://sendora-9e14f-default-rtdb.firebaseio.com",
  projectId: "sendora-9e14f",
  storageBucket: "sendora-9e14f.appspot.com",
  messagingSenderId: "844599229027",
  appId: "1:844599229027:web:a6d6751f4d50d6680dd656",
  measurementId: "G-HEYHYSGKBL"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getDatabase(app);
export { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail, 
  sendEmailVerification, 
  signOut 
};