import { auth, db } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { collection, getDocs, doc, setDoc, getDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

let currentUser = null;
let allItems    = []; // [{ id, data, isShortlisted }]

// ── Auth guard ──────────────────────────────────────────────
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }
  currentUser = user;
  document.getElementById("user-email").textContent = user.email;
  await loadItems();
});

document.getElementById("signout-btn").addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "login.html";
});

// ── Filters ─────────────────────────────────────────────────
document.getElementById("search-input").addEventListener("input", renderFiltered);
document.getElementById("category-filter").addEventListener("change", renderFiltered);

// ── Load from Firestore ──────────────────────────────────────
async function loadItems() {
  const snapshot = await getDocs(collection(db, "items"));

  // Remove the logged-in user's own listings
  const otherDocs = snapshot.docs.filter(d => d.data().sellerUID !== currentUser.uid);

  // Check all shortlist statuses in parallel (one round-trip instead of N)
  const shortlistChecks = otherDocs.map(d =>
    getDoc(doc(db, "shortlists", `${currentUser.uid}_${d.id}`))
  );
  const shortlistSnaps = await Promise.all(shortlistChecks);

  allItems = otherDocs.map((d, i) => ({
    id:            d.id,
    data:          d.data(),
    isShortlisted: shortlistSnaps[i].exists()
  }));

  document.getElementById("loading").classList.add("d-none");
  renderFiltered();
}

// ── Render (with current filter values) ─────────────────────
function renderFiltered() {
  const query    = document.getElementById("search-input").value.toLowerCase();
  const category = document.getElementById("category-filter").value;

  const filtered = allItems.filter(({ data }) => {
    const matchesSearch =
      !query ||
      (data.itemName || data.itemname || "").toLowerCase().includes(query) ||
      (data.description || "").toLowerCase().includes(query);
    const matchesCategory = !category || data.category === category;
    return matchesSearch && matchesCategory;
  });

  const container  = document.getElementById("items-container");
  const emptyState = document.getElementById("empty-state");

  container.innerHTML = "";

  if (filtered.length === 0) {
    container.classList.add("d-none");
    emptyState.classList.remove("d-none");
    return;
  }

  emptyState.classList.add("d-none");
  container.classList.remove("d-none");

  filtered.forEach(({ id, data: item, isShortlisted }) => {
    const priceLabel = `$${item.price}${item.trade ? ' <span class="badge bg-warning text-dark ms-1">🔄 Open to Trade</span>' : ''}`;

    const col = document.createElement("div");
    col.className = "col-md-4";
    col.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="${item.image || "https://placehold.co/400x200?text=No+Image"}"
             class="card-img-top card-img-fixed"
             onerror="this.src='https://placehold.co/400x200?text=No+Image'"/>
        <div class="card-body d-flex flex-column">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <h5 class="card-title mb-0">${item.itemName || item.itemname}</h5>
            <span class="badge bg-secondary">${item.category}</span>
          </div>
          <p class="card-text text-muted small flex-grow-1">${item.description}</p>
          <p class="fw-bold text-primary mb-1 d-flex align-items-center">${priceLabel}</p>
          <p class="text-muted small mb-3">Seller: ${item.sellerEmail || item.selleremail}</p>
          <button
            class="btn shortlist-btn ${isShortlisted ? "btn-success" : "btn-outline-primary"}"
            data-id="${id}"
            data-name="${item.itemName || item.itemname}"
            data-shortlisted="${isShortlisted}">
            ${isShortlisted ? "✓ Shortlisted" : "🤍 Shortlist"}
          </button>
        </div>
      </div>
    `;
    container.appendChild(col);
  });

  container.querySelectorAll(".shortlist-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      if (btn.dataset.shortlisted === "true") {
        removeFromShortlist(btn);
      } else {
        addToShortlist(btn);
      }
    });
  });
}

// ── Add to shortlist ─────────────────────────────────────────
async function addToShortlist(btn) {
  btn.disabled    = true;
  btn.textContent = "Adding…";

  const itemId   = btn.dataset.id;
  const itemName = btn.dataset.name;

  await setDoc(doc(db, "shortlists", `${currentUser.uid}_${itemId}`), {
    userId:   currentUser.uid,
    itemId:   itemId,
    itemName: itemName,
    addedAt:  new Date()
  });

  // Keep in-memory state in sync so filter re-renders reflect the change
  const entry = allItems.find(i => i.id === itemId);
  if (entry) entry.isShortlisted = true;

  btn.textContent = "✓ Shortlisted";
  btn.classList.replace("btn-outline-primary", "btn-success");
  btn.dataset.shortlisted = "true";
  btn.disabled = false;

  showToast(`"${itemName}" added to your shortlist!`);
}

// ── Toast notification ───────────────────────────────────────
// Shows a green message at the bottom-right for 3 seconds,
// then hides itself automatically.
function showToast(message) {
  const toastEl = document.getElementById("shortlist-toast");
  document.getElementById("toast-message").textContent = message;

  // Make the toast visible
  toastEl.classList.remove("d-none");

  // Use Bootstrap's built-in Toast class to handle the animation
  const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
  toast.show();

  // After Bootstrap hides it, add d-none back so it resets cleanly
  toastEl.addEventListener("hidden.bs.toast", () => {
    toastEl.classList.add("d-none");
  }, { once: true }); // { once: true } means this listener only fires once
}

async function removeFromShortlist(btn) {
  btn.disabled = true;
  btn.textContent = "Removing…";

  const itemId = btn.dataset.id;

  await deleteDoc(doc(db, "shortlists", `${currentUser.uid}_${itemId}`));

  const entry = allItems.find(i => i.id === itemId);
  if (entry) entry.isShortlisted = false;

  btn.textContent = "🤍 Shortlist";
  btn.classList.replace("btn-success", "btn-outline-primary");
  btn.dataset.shortlisted = "false";
  btn.disabled = false;
}
