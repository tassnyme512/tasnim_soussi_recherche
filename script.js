const UNSPLASH_ACCESS_KEY = "ND1op4H2pWsat5LNMc1F2CRNDWh5G532N0mKvwERhxA";
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

let currentQuery = "";
let currentPage = 1;
let results = []; 
let allItems = []; 
let currentIndex = -1;
const useMock =
  !UNSPLASH_ACCESS_KEY || UNSPLASH_ACCESS_KEY === "ND1op4H2pWsat5LNMc1F2CRNDWh5G532N0mKvwERhxA";

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
  
  
  function generateMockResults(query, page = 1, per_page = PER_PAGE) {
    const items = [];
    const startId = (page - 1) * per_page + 10; 
    for (let i = 0; i < per_page; i++) {
      const id = (startId + i) % 1000;
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
        console.warn(
          "No Unsplash key supplied — using mock images from picsum.photos"
        );
        data = generateMockResults(q, page, PER_PAGE);
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
