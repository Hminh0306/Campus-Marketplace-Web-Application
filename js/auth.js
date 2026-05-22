// Import Firebase Authentication
import { auth } from "firebase'js";

import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js"


// Get HTML elements
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const signInButton = document.getElementById("signInButton");
const messageArea = document.getElementById("messageArea");

// Run login function
// when user clicks sign in button
signInButton.addEventListener("click");

// get email and password entered by user
emailInput.value 
passwordInput.value

// try login with Firebase
await signInWithEmailAndWord(auth, emailInput, password);

// if login successful => show success message, redirect to home page
messageArea.textContext = "Login successful";
messageArea.style.color = "green";
window.location.href = "index.html";



// if login fails
// show error message