import { auth, db } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  collection, query, where, getDocs,
  getDoc, doc, deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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

  await loadShortlist(user.uid);
});

async function loadShortlist(uid) {
  const loadingEl   = document.getElementById("loading");
  const emptyEl     = document.getElementById("empty-state");
  const containerEl = document.getElementById("shortlist-container");

  try {
    const q = query(collection(db, "shortlists"), where("userId", "==", uid));
    const snapshot = await getDocs(q);

    loadingEl.classList.add("d-none");

    if (snapshot.empty) {
      emptyEl.classList.remove("d-none");
      return;
    }

    // Fetch full item details for each shortlist entry
    const rows = [];
    for (const shortlistDoc of snapshot.docs) {
      const { itemId } = shortlistDoc.data();
      if (!itemId) continue;
      const itemSnap = await getDoc(doc(db, "items", itemId));
      rows.push({
        shortlistDocId: shortlistDoc.id,
        itemData: itemSnap.exists() ? itemSnap.data() : null
      });
    }

    if (rows.length === 0) {
      emptyEl.classList.remove("d-none");
      return;
    }

    containerEl.classList.remove("d-none");
    rows.forEach(({ shortlistDocId, itemData }) => {
      containerEl.appendChild(buildRow(shortlistDocId, itemData));
    });

  } catch (err) {
    loadingEl.classList.add("d-none");
    emptyEl.classList.remove("d-none");
    emptyEl.querySelector("p").textContent = "Error: " + err.message;
    console.error(err);
  }
}

function buildRow(shortlistDocId, item) {
  const name         = item?.itemName || item?.itemname || "Item no longer available";
  const isTradeItem  = !item?.price || item?.price === "Trade" || item?.price === 0;
  const priceDisplay = isTradeItem ? "Trade" : `$${parseFloat(item.price).toFixed(2)}`;

  const row = document.createElement("div");
  row.className = "card mb-3 shadow-sm";
  row.id = `row-${shortlistDocId}`;
  row.innerHTML = `
    <div class="card-body d-flex justify-content-between align-items-center">
      <div>
        <h6 class="mb-1">${name}</h6>
        <span class="badge bg-secondary me-1">${item?.category || ""}</span>
        <span class="fw-bold text-primary">${priceDisplay}</span>
        <p class="text-muted small mb-0 mt-1">Seller: ${item?.sellerEmail || item?.selleremail || ""}</p>
      </div>
      <button class="btn btn-danger btn-sm" id="remove-${shortlistDocId}">Remove</button>
    </div>
  `;

  row.querySelector(`#remove-${shortlistDocId}`).addEventListener("click", () => {
    removeItem(shortlistDocId);
  });

  return row;
}

async function removeItem(shortlistDocId) {
  const btn = document.getElementById(`remove-${shortlistDocId}`);
  btn.disabled = true;
  btn.textContent = "Removing…";

  try {
    await deleteDoc(doc(db, "shortlists", shortlistDocId));

    document.getElementById(`row-${shortlistDocId}`).remove();

    // Show empty state if nothing left
    const containerEl = document.getElementById("items-container");
    if (containerEl.children.length === 0) {
      containerEl.classList.add("d-none");
      document.getElementById("empty-state").classList.remove("d-none");
    }

  } catch (err) {
    btn.disabled = false;
    btn.textContent = "Remove";
    console.error(err);
    alert("Failed to remove item: " + err.message);
  }
}

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
  }
});