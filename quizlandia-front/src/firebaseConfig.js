import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDn7RkPHJZsBfMQv96FCaDFMRJ2ofCZlVU",
  authDomain: "quizlandia-eb201.firebaseapp.com",
  projectId: "quizlandia-eb201",
  storageBucket: "quizlandia-eb201.appspot.com",
  messagingSenderId: "612825819449",
  appId: "1:612825819449:web:2d0f73e2b307520d6d20e8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };