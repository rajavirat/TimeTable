// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA5My9rrC8WdXurddCOug6-rMOKiPw7F_U", // You need to add your actual API key
  authDomain: "time-table-generator-5c5a2.firebaseapp.com",
  projectId: "time-table-generator-5c5a2",
  storageBucket: "time-table-generator-5c5a2.firebasestorage.app",
  messagingSenderId: "1013597823425",
  appId: "1:1013597823425:web:5b348ad798e53cf17f8f40",
  measurementId: "G-GGM02HT77X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

// Export for use in other files
export { app, analytics, db, auth };