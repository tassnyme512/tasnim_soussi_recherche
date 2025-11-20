console.log("Commit 2 loaded");

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const clearBtn = document.getElementById("clearBtn");
const gallery = document.getElementById("gallery");
const status = document.getElementById("status");

function setStatus(text, show = true) {
  status.textContent = text;
  status.hidden = !show;
}

function filterGallery(query) {
  const q = (query || "").trim().toLowerCase();
  const cards = Array.from(gallery.querySelectorAll(".card"));
  if (!q) {
    cards.forEach((c) => (c.style.display = ""));
    setStatus("", false);
    return;
  }

  let visible = 0;
  cards.forEach((card) => {
    const tags = (card.getAttribute("data-tags") || "").toLowerCase();
    const img = card.querySelector("img");
    const alt = img && img.alt ? img.alt.toLowerCase() : "";
    const hay = tags + " " + alt;
    if (hay.indexOf(q) !== -1) {
      card.style.display = "";
      visible++;
    } else {
      card.style.display = "none";
    }
  });

  setStatus(`${visible} résultat(s) pour « ${q} »`);
}

searchBtn.addEventListener("click", () => filterGallery(searchInput.value));
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    filterGallery(searchInput.value);
  }
});
clearBtn.addEventListener("click", () => {
  searchInput.value = "";
  filterGallery("");
});

window.addEventListener("load", () => {
  const first = gallery.querySelector(".card");
  if (first) first.setAttribute("tabindex", "0");
});
