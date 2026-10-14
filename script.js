// ===== 1. PHOTO DATA =====
// Each photo has an id, title, category, and image URL.
// To use your own photos, put them in the images/ folder and
// change src to something like "images/my-photo.jpg".
const photos = [
  { id: 1,  title: "Chokramudi Peak",   category: "travel",      src: "images/travel/Chokramudi_peak.jpg" },
  { id: 2,  title: "Neelakurunji 1",    category: "travel",      src: "images/travel/Neelakurunji1.jpeg" },
  { id: 3,  title: "Neelakurunji 2",    category: "travel",      src: "images/travel/Neelakurunji2.jpg" },
  { id: 3,  title: "Neelakurunji 3",    category: "travel",      src: "images/travel/Neelakurunji3.jpg" },
  { id: 4,  title: "Pollachi ",         category: "nature",      src: "images/nature/Pollachi.jpg" },
  { id: 5,  title: "Pollachi",          category: "nature",      src: "images/nature/pollachi1.jpg" },
  { id: 6,  title: "Wildflower Field",  category: "nature",      src: "https://picsum.photos/seed/nature3/800/600" },
  { id: 7,  title: "Monkey ",           category: "photography", src: "images/photography/image1.jpg" },
  { id: 8,  title: "Bison ",            category: "photography", src: "images/photography/image2.jpg" },
  { id: 9,  title: "Elephant",          category: "photography", src: "images/photography/image3.jpg" },
  { id: 10, title: "Color Grade Test",  category: "editing",     src: "https://picsum.photos/seed/edit1/800/600" },
  { id: 11, title: "Moody Retouch",     category: "editing",     src: "https://picsum.photos/seed/edit2/800/600" },
  { id: 12, title: "Black & White Edit",category: "editing",     src: "https://picsum.photos/seed/edit3/800/600" },
];

// ===== 2. LIKE STATE =====
// Keeps track of likes in memory: { photoId: { liked: true/false, count: number } }
// Starting counts are small sample numbers.
const likes = {};
photos.forEach((photo, index) => {
  likes[photo.id] = { liked: false, count: (index * 3) % 11 + 2 };
});

// ===== 3. GRAB PAGE ELEMENTS =====
const galleryContainer = document.getElementById("gallery-container");
const filterButtons = document.querySelectorAll(".filter-btn");
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");
const modalTitle = document.getElementById("modal-title");
const modalClose = document.getElementById("modal-close");

// Remember which category is selected
let currentCategory = "all";

// ===== 4. BUILD THE GALLERY =====
// Creates one card per photo that matches the selected category.
function renderGallery() {
  // Keep only photos in the chosen category ("all" keeps everything)
  const visiblePhotos = photos.filter(
    (photo) => currentCategory === "all" || photo.category === currentCategory
  );

  // Turn each photo into card HTML and put it on the page
  galleryContainer.innerHTML = visiblePhotos
    .map((photo) => {
      const like = likes[photo.id];
      return `
        <article class="card" data-id="${photo.id}" data-category="${photo.category}">
          <div class="card-image">
            <img src="${photo.src}" alt="${photo.title}" loading="lazy" />
            <span class="hover-title">${photo.title}</span>
          </div>
          <div class="card-footer">
            <h3 class="card-title">${photo.title}</h3>
            <button class="like-btn ${like.liked ? "liked" : ""}" aria-label="Like ${photo.title}">
              <span class="heart">${like.liked ? "♥" : "♡"}</span>
              <span class="like-count">${like.count}</span>
            </button>
          </div>
        </article>
      `;
    })
    .join("");
}

// ===== 5. CATEGORY FILTER =====
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Move the "active" style to the clicked button
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    // Save the chosen category and redraw the gallery
    currentCategory = button.dataset.category;
    renderGallery();
  });
});

// ===== 6. CLICKS INSIDE THE GALLERY (like + preview) =====
// One listener on the container handles every card, even after re-rendering.
galleryContainer.addEventListener("click", (event) => {
  const card = event.target.closest(".card");
  if (!card) return;
  const id = Number(card.dataset.id);

  // Like button clicked: toggle liked state and update the count
  const likeBtn = event.target.closest(".like-btn");
  if (likeBtn) {
    const like = likes[id];
    like.liked = !like.liked;
    like.count += like.liked ? 1 : -1;

    likeBtn.classList.toggle("liked", like.liked);
    likeBtn.querySelector(".heart").textContent = like.liked ? "♥" : "♡";
    likeBtn.querySelector(".like-count").textContent = like.count;
    return;
  }

  // Image clicked: open the modal
  if (event.target.closest(".card-image")) {
    const photo = photos.find((p) => p.id === id);
    openModal(photo);
  }
});

// ===== 7. MODAL =====
function openModal(photo) {
  modalImg.src = photo.src;
  modalImg.alt = photo.title;
  modalTitle.textContent = photo.title;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

// Close with the X button
modalClose.addEventListener("click", closeModal);

// Close when clicking the dark area outside the image
modal.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});

// Bonus: close with the Escape key
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeModal();
});

// ===== 8. START =====
renderGallery();
