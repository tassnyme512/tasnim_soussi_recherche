// Afficher un message dans la console
console.log("Galerie photo chargée ✅");

// Petit effet : afficher un message quand on clique sur une image
const photos = document.querySelectorAll(".photo img");

photos.forEach((img, index) => {
  img.addEventListener("click", () => {
    alert(`Tu as cliqué sur l'image ${index + 1}`);
  });
});
