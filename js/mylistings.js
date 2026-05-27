import { auth, db } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  document.getElementById("user-email").textContent = user.email;

  document.getElementById("signout-btn").addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "login.html";
  });

  await loadListings(user.uid);
});

async function loadListings(uid) {
  const loadingEl   = document.getElementById("loading");
  const emptyEl     = document.getElementById("empty-state");
  const containerEl = document.getElementById("mylistings-container");

  try {
    const q = query(collection(db, "items"), where("sellerUID", "==", uid));
    const snapshot = await getDocs(q);

    loadingEl.classList.add("d-none");

    if (snapshot.empty) {
      emptyEl.classList.remove("d-none");
      return;
    }

    containerEl.classList.remove("d-none");
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

function buildCard(item) {
  const isTradeItem  = !item.price || item.price === "Trade" || item.price === 0;
  const priceDisplay = isTradeItem ? "Trade" : `$${parseFloat(item.price).toFixed(2)}`;
  const imgSrc       = item.image ? `images/${item.image}` : "images/placeholder.png";

  const col = document.createElement("div");
  col.className = "col-sm-6 col-md-4 col-lg-3";
  col.innerHTML = `
    <div class="card h-100 shadow-sm">
      <img src="${imgSrc}"
           class="card-img-top card-img-fixed-sm"
           alt="${item.itemName || ''}"
           onerror="this.src='https://placehold.co/400x300?text=No+Image'"/>
      <div class="card-body d-flex flex-column">
        <h6 class="card-title">${item.itemName || "Unnamed Item"}</h6>
        <p class="card-text text-muted small flex-grow-1">${item.description || ""}</p>
        <div class="d-flex justify-content-between align-items-center mt-2">
          <span class="badge bg-secondary">${item.category || "Uncategorised"}</span>
          <span class="fw-bold text-primary">${priceDisplay}</span>
        </div>
        <p class="text-muted small mt-2 mb-0">Seller: ${item.sellerEmail || ""}</p>
        <span class="badge bg-success mt-2">Your listing</span>
      </div>
    </div>
  `;
  return col;
}

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
  }
});