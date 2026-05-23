// js/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyATr3nykFWbz80ZSJdTAiykhmk4MJSse4Y",
  authDomain: "campus-bd130.firebaseapp.com",
  projectId: "campus-bd130",
  storageBucket: "campus-bd130.firebasestorage.app",
  messagingSenderId: "360523767817",
  appId: "1:360523767817:web:0422f53ea05ad1d65498d8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };