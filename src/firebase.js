import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCm4zEyAgRORm-gNi0EiyOdGkdHNdbEnew",
  authDomain: "micromeasurable-61820.firebaseapp.com",
  projectId: "micromeasurable-61820",
  storageBucket: "micromeasurable-61820.firebasestorage.app",
  messagingSenderId: "752257809340",
  appId: "1:752257809340:web:1ff733504f0b4e14c649b9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const firestore = getFirestore(app);

// Export both app and firestore
export { app, firestore };
