import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


// ── Check login status ──────────────────────────────────────
// This runs when the page loads.
// If the user is not logged in, send them back to login.html.
// If logged in, show their email and load their own listings.
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  // Show logged-in user email in the navbar
  document.getElementById("user-email").textContent = user.email;

  // Sign out button
  document.getElementById("signout-btn").addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "login.html";
  });

  // Load only listings created by this user
  await loadListings(user.uid);
});


// ── Load current user's listings from Firestore ──────────────
// Firestore collection: items
// Only documents where sellerUID matches current user's UID are shown.
async function loadListings(uid) {
  const loadingEl   = document.getElementById("loading");
  const emptyEl     = document.getElementById("empty-state");
  const containerEl = document.getElementById("mylistings-container");

  try {
    const q = query(
      collection(db, "items"),
      where("sellerUID", "==", uid)
    );

    const snapshot = await getDocs(q);

    // Hide loading message after data is loaded
    loadingEl.classList.add("d-none");

    // If user has no listings, show empty state
    if (snapshot.empty) {
      emptyEl.classList.remove("d-none");
      return;
    }

    // Show listings container
    containerEl.classList.remove("d-none");

    // Create one card for each listing
    snapshot.forEach((doc) => {
      const item = doc.data();
      containerEl.appendChild(buildCard(item));
    });

  } catch (err) {
    loadingEl.classList.add("d-none");
    emptyEl.classList.remove("d-none");
    emptyEl.querySelector("p").textContent = "Error: " + err.message;
    console.error(err);
  }
}


// ── Build listing card ──────────────────────────────────────
// This function creates the HTML card for one item.
function buildCard(item) {
  const isTradeItem =
    !item.price ||
    item.price === "Trade" ||
    item.price === 0;

  const priceDisplay = isTradeItem
    ? "Trade"
    : `$${parseFloat(item.price).toFixed(2)}`;

  // Image logic:
  // 1. If item.image is a full URL, use it directly.
  // 2. If item.image is a file name, load it from images folder.
  // 3. If no image exists, use placeholder.
  let imgSrc = "images/placeholder.png";

  if (item.image) {
    if (item.image.startsWith("http")) {
      imgSrc = item.image;              // Firebase/online image URL
    } else if (item.image.startsWith("images/")) {
      imgSrc = item.image;              // already includes images/
    } else {
      imgSrc = `images/${item.image}`;  // local image filename
    }
  }

  const col = document.createElement("div");
  col.className = "col-sm-6 col-md-4 col-lg-3";

  col.innerHTML = `
    <div class="card h-100 shadow-sm">
      <img
        src="${imgSrc}"
        class="card-img-top card-img-fixed-sm"
        alt="${item.itemName || 'Listing image'}"
        onerror="this.src='https://placehold.co/400x300?text=No+Image'"
      />

      <div class="card-body d-flex flex-column">
        <h6 class="card-title">
          ${item.itemName || "Unnamed Item"}
        </h6>

        <p class="card-text text-muted small flex-grow-1">
          ${item.description || ""}
        </p>

        <div class="d-flex justify-content-between align-items-center mt-2">
          <span class="badge bg-secondary">
            ${item.category || "Uncategorised"}
          </span>

          <span class="fw-bold text-primary">
            ${priceDisplay}
          </span>
        </div>

        <p class="text-muted small mt-2 mb-0">
          Seller: ${item.sellerEmail || ""}
        </p>

        <span class="badge bg-success mt-2">
          Your listing
        </span>
      </div>
    </div>
  `;

  return col;
}