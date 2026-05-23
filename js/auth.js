// Import Firebase Authentication
import { auth } from "./firebase-auth.js";

import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Get HTML elements
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const signInButton = document.getElementById("signInButton");
const messageArea = document.getElementById("messageArea");
const logoutButton = document.getElementById("logoutButton");

// Run login function - when user clicks sign in button
if (signInButton) {
 
  signInButton.addEventListener("click", async function () {
 
    // Get the values the user typed in, trimming extra whitespace
    const email    = emailInput.value.trim();
    const password = passwordInput.value.trim();
 
    // Basic validation: make sure neither field is empty
    if (!email || !password) {
      messageArea.textContent = "Please enter your email and password.";
      messageArea.style.color = "red";
      return; 
    }
 
    try {
      // Ask Firebase to sign in with the provided email and password
      // If the credentials are wrong, Firebase will throw an error
      await signInWithEmailAndPassword(auth, email, password);
 
      // Sign-in succeeded — show a success message then redirect
      messageArea.textContent = "Login successful! Redirecting...";
      messageArea.style.color = "green";
 
      window.location.href = "index.html"; // Go to the Welcome page
 
    } catch (error) {
      // Sign-in failed — log the error code and show a friendly message
      console.error("Login error:", error.code, error.message);
      messageArea.textContent = "Wrong email or password. Please try again.";
      messageArea.style.color = "red";
    }
  });
}

//Run logout function
// when user clicks lgout button

if (logoutButton) {
 
  logoutButton.addEventListener("click", async function () {
 
    try {
      // Tell Firebase to sign the current user out
      await signOut(auth);
 
      console.log("Sign out successful.");
 
      // After signing out, redirect back to the login page
      window.location.href = "login.html";
 
    } catch (error) {
      // Sign-out errors are rare but log them just in case
      console.error("Sign out error:", error.message);
    }
  });
}
 





