// Import auth from firebase.js
import { auth } from "./firebase-auth.js";

// Import auth state listener from Firebase Auth
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";


// Get HTML element for displaying current user email
const currentUserEmail =
  document.getElementById("currentUserEmail");


// Listen for authentication state
onAuthStateChanged(auth, function (user) {

  // If user is logged in
  if (user) {

    // Display current user email on index.html
    currentUserEmail.textContent =
      "Logged in as: " + user.email;

  } else {

    // If user is not logged in, redirect to login page
    window.location.href = "login.html";
  }
});