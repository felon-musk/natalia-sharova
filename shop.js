// Builds the shop grid and the detail view from the list in artworks.js.
// You shouldn't need to edit this file to add or change paintings.

const money = n => "$" + n.toLocaleString("en-US");

// e.g. "Acrylic • 24 × 24 in"
function materialLine(art) {
  if (art.type === "print") return "Fine art print";
  return [art.medium, art.size].filter(Boolean).join(" • ") || "Original painting";
}

function priceLabel(art) {
  if (art.status === "sold") return "Sold";
  if (art.type === "print") return "From " + money(Math.min(...art.options.map(o => o.price)));
  return art.price ? money(art.price) : "Price on request";
}

function renderGrid(filter = "original") {
  const grid = document.getElementById("grid");
  grid.innerHTML = "";
  ARTWORKS.forEach((art, i) => {
    if (art.type !== filter) return;
    const card = document.createElement("article");
    card.className = "card" + (art.status === "sold" ? " sold" : "");
    card.tabIndex = 0;
    card.innerHTML = `
      <div class="card-media">
        ${art.status === "sold" ? '<span class="tag">Sold</span>' : art.type === "print" ? '<span class="tag">Print</span>' : ""}
        <img src="${art.images[0]}" alt="${art.title}" loading="lazy">
        ${art.room ? `<img class="room" src="${art.room}" alt="${art.title} shown in a room" loading="lazy">` : ""}
      </div>
      <h3>${art.title}</h3>
      <div class="meta">${materialLine(art)}</div>
      ${art.status === "sold" ? "" : `<div class="price">${priceLabel(art)}</div>`}`;
    card.addEventListener("click", () => openDetail(i));
    card.addEventListener("keydown", e => { if (e.key === "Enter") openDetail(i); });
    grid.appendChild(card);
  });
}

function openDetail(i) {
  const art = ARTWORKS[i];
  const photos = [...art.images, ...(art.room ? [art.room] : [])];
  const d = document.getElementById("detail");
  let chosen = art.type === "print" ? art.options[0] : null;

  const inquire = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Inquiry: " + art.title)}`;

  d.querySelector(".detail-inner").innerHTML = `
    <div>
      <div class="detail-main"><img id="mainPhoto" src="${photos[0]}" alt="${art.title}"></div>
      ${photos.length > 1 ? `<div class="thumbs">${photos.map((p, n) =>
        `<button class="${n ? "" : "active"}" data-src="${p}" aria-label="Photo ${n + 1}"><img src="${p}" alt=""></button>`).join("")}</div>` : ""}
    </div>
    <div class="detail-info">
      <h2>${art.title}</h2>
      <div class="kind">${materialLine(art)}${art.year ? ", " + art.year : ""}</div>
      <div class="price" id="detailPrice">${chosen ? money(chosen.price) : priceLabel(art)}</div>
      ${chosen ? `<div class="sizes">${art.options.map((o, n) =>
        `<button class="${n ? "" : "active"}" data-n="${n}">${o.size}</button>`).join("")}</div>` : ""}
      ${art.type === "print" ? `<dl><dt>Medium</dt><dd>${art.medium}</dd></dl>` : ""}
      <p class="desc">${art.description || ""}</p>
      <a class="btn" id="buyBtn" target="_blank" rel="noopener"></a>
      <p class="small-note" id="buyNote"></p>
    </div>`;

  const buyBtn = d.querySelector("#buyBtn");
  const note = d.querySelector("#buyNote");
  function updateBuy() {
    const link = chosen ? chosen.buyLink : art.buyLink;
    if (art.status === "sold") {
      buyBtn.textContent = "Inquire about similar work"; buyBtn.href = inquire; buyBtn.removeAttribute("target");
      note.textContent = "This painting has found a home.";
    } else if (link) {
      buyBtn.textContent = "Purchase"; buyBtn.href = link; buyBtn.target = "_blank";
      note.textContent = "Secure checkout. Free shipping within the US.";
    } else {
      buyBtn.textContent = "Inquire to purchase"; buyBtn.href = inquire; buyBtn.removeAttribute("target");
      note.textContent = "";
    }
  }
  updateBuy();

  d.querySelectorAll(".thumbs button").forEach(b => b.addEventListener("click", () => {
    d.querySelector("#mainPhoto").src = b.dataset.src;
    d.querySelectorAll(".thumbs button").forEach(x => x.classList.toggle("active", x === b));
  }));
  d.querySelectorAll(".sizes button").forEach(b => b.addEventListener("click", () => {
    chosen = art.options[b.dataset.n];
    d.querySelector("#detailPrice").textContent = money(chosen.price);
    d.querySelectorAll(".sizes button").forEach(x => x.classList.toggle("active", x === b));
    updateBuy();
  }));

  d.classList.add("open");
  d.scrollTop = 0;
  document.body.style.overflow = "hidden";
}

function closeDetail() {
  document.getElementById("detail").classList.remove("open");
  document.body.style.overflow = "";
}

document.addEventListener("DOMContentLoaded", () => {
  renderGrid();
  // Hide the Prints tab until there are prints in the shop list
  if (!ARTWORKS.some(a => a.type === "print")) document.querySelector(".filters").style.display = "none";
  document.querySelectorAll(".filters button").forEach(b => b.addEventListener("click", () => {
    document.querySelectorAll(".filters button").forEach(x => x.classList.toggle("active", x === b));
    renderGrid(b.dataset.filter);
  }));
  document.querySelector(".detail-close").addEventListener("click", closeDetail);
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeDetail(); });
});
