/* app.js - version robuste avec fallback
   - Si UNSPLASH_ACCESS_KEY absent, on utilise des images de demo (picsum.photos).
   - Garde la même UI : recherche, load more, modal.
*/

const UNSPLASH_ACCESS_KEY = "ND1op4H2pWsat5LNMc1F2CRNDWh5G532N0mKvwERhxA"; // <-- mets ta clé réelle ici pour utiliser l'API
const PER_PAGE = 12;

// DOM
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const orientationSelect = document.getElementById("orientation");
const gallery = document.getElementById("gallery");
const status = document.getElementById("status");
const loadMoreBtn = document.getElementById("loadMore");
const loadMoreWrap = document.getElementById("loadMoreWrap");

const modal = document.getElementById("modal");
const modalImg = document.getElementById("modalImg");
const modalCaption = document.getElementById("modalCaption");
const modalClose = document.getElementById("modalClose");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

document.getElementById("year").textContent = new Date().getFullYear();

// state
let currentQuery = "";
let currentPage = 1;
let results = []; // page results
let allItems = []; // accumulated
let currentIndex = -1;

const useMock =
  !UNSPLASH_ACCESS_KEY || UNSPLASH_ACCESS_KEY === "YOUR_UNSPLASH_ACCESS_KEY";

// helpers
function setStatus(msg) {
  status.textContent = msg;
  console.log("[STATUS]", msg);
}
function escapeHtml(str) {
  return String(str).replace(
    /[&<>"']/g,
    (s) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[
        s
      ])
  );
}
function clearGallery() {
  gallery.innerHTML = "";
  allItems = [];
  currentPage = 1;
}
function createCard(item, index) {
  const a = document.createElement("a");
  a.href = item.links && item.links.html ? item.links.html : "#";
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.className = "card";
  a.dataset.index = index;

  const img = document.createElement("img");
  img.alt = item.alt_description || item.description || "Photo";
  img.loading = "lazy";
  img.src = item.urls.small;

  const meta = document.createElement("div");
  meta.className = "meta";
  meta.textContent = item.user && item.user.name ? item.user.name : "Auteur";

  a.appendChild(img);
  a.appendChild(meta);

  a.addEventListener("click", (e) => {
    e.preventDefault();
    openModal(index);
  });

  return a;
}

// Mock data generator (picsum.photos) used when no API key
function generateMockResults(query, page = 1, per_page = PER_PAGE) {
  const items = [];
  const startId = (page - 1) * per_page + 10; // just pick some ids
  for (let i = 0; i < per_page; i++) {
    const id = (startId + i) % 1000; // picsum has many ids
    const w = 800;
    const h = 600;
    const smallW = 400;
    const smallH = 300;
    const urls = {
      small: `https://picsum.photos/id/${id}/${smallW}/${smallH}`,
      regular: `https://picsum.photos/id/${id}/${w}/${h}`,
      full: `https://picsum.photos/id/${id}/${w}/${h}`,
    };
    items.push({
      id: `mock-${id}-${page}-${i}`,
      alt_description: `Image de demo — ${escapeHtml(query)}`,
      description: `Image demo "${escapeHtml(query)}"`,
      urls,
      user: { name: `Demo auteur ${id}` },
      links: { html: urls.regular },
    });
  }
  return { results: items, total_pages: 10 };
}

// Unsplash search (only called when key present)
async function searchUnsplash(query, page = 1, orientation = "") {
  const params = new URLSearchParams({
    query,
    page: String(page),
    per_page: String(PER_PAGE),
  });
  if (orientation) params.set("orientation", orientation);

  const url = `https://api.unsplash.com/search/photos?${params.toString()}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Unsplash API error: ${res.status} ${res.statusText} — ${text}`
    );
  }
  return res.json();
}

async function performSearch(q, page = 1, orientation = "") {
  try {
    setStatus(`Recherche: "${q}" — page ${page}...`);
    if (page === 1) clearGallery();
    loadMoreWrap.style.display = "none";

    let data;
    if (useMock) {
      // fallback: generate mock results so UI always shows something
      console.warn(
        "No Unsplash key supplied — using mock images from picsum.photos"
      );
      data = generateMockResults(q, page, PER_PAGE);
      // small delay to simulate network
      await new Promise((r) => setTimeout(r, 300));
    } else {
      data = await searchUnsplash(q, page, orientation);
    }

    results = data.results || [];

    if (results.length === 0 && page === 1) {
      setStatus(`Aucun résultat pour "${q}".`);
      return;
    }

    results.forEach((it, i) => {
      const idx = allItems.length + i;
      const card = createCard(it, idx);
      gallery.appendChild(card);
    });

    allItems = allItems.concat(results);

    setStatus(`Résultats pour "${q}" — affichés: ${allItems.length}`);
    if (data.total_pages && page < data.total_pages) {
      loadMoreWrap.style.display = "block";
    } else {
      loadMoreWrap.style.display = "none";
    }
  } catch (err) {
    console.error(err);
    setStatus(err.message || "Erreur pendant la recherche.");
  }
}

// events
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const q = searchInput.value.trim();
  if (!q) {
    setStatus("Merci d’entrer un mot-clé.");
    return;
  }
  currentQuery = q;
  currentPage = 1;
  performSearch(currentQuery, currentPage, orientationSelect.value);
});

loadMoreBtn.addEventListener("click", () => {
  currentPage += 1;
  performSearch(currentQuery, currentPage, orientationSelect.value);
});

// modal functions
function openModal(index) {
  currentIndex = index;
  const item = allItems[index];
  if (!item) return;
  modalImg.src = item.urls.regular || item.urls.full || item.urls.small;
  modalImg.alt = item.alt_description || "Photo agrandie";
  modalCaption.textContent = `${
    item.user && item.user.name ? item.user.name : "Auteur"
  } — ${item.description || item.alt_description || ""}`;
  modal.setAttribute("aria-hidden", "false");
  modal.style.display = "flex";
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.setAttribute("aria-hidden", "true");
  modal.style.display = "none";
  modalImg.src = "";
  document.body.style.overflow = "";
  currentIndex = -1;
}

function showPrev() {
  if (currentIndex > 0) openModal(currentIndex - 1);
}
function showNext() {
  if (currentIndex < allItems.length - 1) openModal(currentIndex + 1);
}

modalClose.addEventListener("click", closeModal);
prevBtn.addEventListener("click", showPrev);
nextBtn.addEventListener("click", showNext);

document.addEventListener("keydown", (e) => {
  if (modal.style.display === "flex") {
    if (e.key === "Escape") closeModal();
    if (e.key === "ArrowLeft") showPrev();
    if (e.key === "ArrowRight") showNext();
  }
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

// init
searchInput.focus();
setStatus(
  useMock
    ? "Mode demo (pas de clé API). Tapez un mot-clé et cliquez Rechercher."
    : "Prêt — entre un mot-clé et clique sur Rechercher."
);
