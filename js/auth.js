// Import Firebase Authentication
import { auth } from "./firebase.js";

import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

// Get HTML elements
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const signInButton = document.getElementById("signInButton");
const messageArea = document.getElementById("messageArea");
const logoutButton = document.getElementById("logoutButton");

// Run login function
// when user clicks sign in button
signInButton.addEventListener("click", async function () {

// get email and password entered by user
const email = emailInput.value;
const password = passwordInput.value; 

// try login with Firebase
try {
    // try login with Firebase
    await signInWithEmailAndPassword(auth, email, password);

    // if login successful => show success message, redirect to home page
    messageArea.textContent = "Login successful";
    messageArea.style.color = "green";
    window.location.href = "index.html";

  } catch (error) {
    // if login fails => show error message
    messageArea.textContent = "Wrong email or password.";
    messageArea.style.color = "red";
  }
});

//Run logout function
// when user clicks lgout button
logoutButton.addEventListener(
    "click",
    async function () {

    try {
      // try logout from Firebase
      await signOut(auth);

      console.log("Logout successful");

    } catch (error) {

      console.log("Logout failed");

    }
  }
);





