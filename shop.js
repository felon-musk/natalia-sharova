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

function makeCard(art, i) {
  const card = document.createElement("article");
  card.className = "card reveal" + (art.status === "sold" ? " sold" : "");
  card.tabIndex = 0;
  card.innerHTML = `
    <div class="card-media">
      ${art.type === "print" ? '<span class="tag">Print</span>' : ""}
      <img src="${art.images[0]}" alt="${art.title}" loading="lazy">
      ${art.room ? `<img class="room" src="${art.room}" alt="${art.title} shown in a room" loading="lazy">` : ""}
    </div>
    <h3>${art.title}</h3>
    <div class="meta">${materialLine(art)}</div>
    ${art.status === "sold" ? '<div class="status sold"><span class="dot"></span>Sold</div>' : ""}
    ${art.status === "sold" ? "" : `<div class="price">${priceLabel(art)}</div>`}`;
  card.addEventListener("click", () => openDetail(i));
  card.addEventListener("keydown", e => { if (e.key === "Enter") openDetail(i); });
  return card;
}

function renderGrid(filter = "original") {
  const grid = document.getElementById("grid");
  grid.innerHTML = "";
  const items = ARTWORKS.map((art, i) => [art, i]).filter(([art]) => art.type === filter);
  if (typeof LAYOUT !== "undefined" && LAYOUT === "staggered") renderStaggered(grid, items);
  else {
    grid.className = "grid";
    items.forEach(([art, i], n) => {
      const card = makeCard(art, i);
      card.style.transitionDelay = (n % 3) * 0.12 + "s"; // paintings in a row appear one after another
      grid.appendChild(card);
    });
  }
  observeReveals(grid);
}

// Staggered layout: paintings sized relative to their real dimensions, in pairs that shift
// left, right and down. Every size and gap is a % of the page width, so it scales with the window.
// Placement for each pair (a = left painting, b = right painting): ml/mr = space on the left/right, mt = drop from the top.
const STAGGER_PATTERN = [
  { a: { ml: 4,  mt: 0 }, b: { mr: 9,  mt: 7 } },
  { a: { ml: 26, mt: 5 }, b: { mr: 0,  mt: 0 } },
  { a: { ml: 3,  mt: 8 }, b: { mr: 10, mt: 0 } },
  { a: { ml: 20, mt: 0 }, b: { mr: 0,  mt: 12 } },
];
const inches = art => parseFloat(art.size) || 30;          // "40 × 40 in" -> 40 (prints without a size count as 30)
const widestPct = art => inches(art) / 40 * 50;             // largest share of the row a painting can take (tablet sizing)

function renderStaggered(grid, items) {
  grid.className = "stagger";
  for (let k = 0, r = 0; k < items.length; k += 2, r++) {
    const row = document.createElement("div");
    row.className = "srow";
    const p = STAGGER_PATTERN[r % STAGGER_PATTERN.length];
    const [A, ai] = items[k];
    const a = makeCard(A, ai);
    a.style.setProperty("--in", inches(A));
    if (items[k + 1]) {
      const [B, bi] = items[k + 1];
      const b = makeCard(B, bi);
      b.style.setProperty("--in", inches(B));
      b.classList.add("alt");
      b.style.transitionDelay = "0.12s";
      // never let a row add up to more than 100%: shrink the left offset if needed
      const room = 100 - widestPct(A) - widestPct(B) - p.b.mr - 4;
      a.style.marginLeft = Math.max(0, Math.min(p.a.ml, room)) + "%";
      a.style.marginTop = p.a.mt + "%";
      b.style.marginRight = p.b.mr + "%";
      b.style.marginTop = p.b.mt + "%";
      row.append(a, b);
    } else {
      a.style.marginLeft = (100 - widestPct(A)) / 2 + 6 + "%"; // a lone last painting sits just right of center
      row.append(a);
    }
    grid.appendChild(row);
  }
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
      <div class="status${art.status === "sold" ? " sold" : ""}"><span class="dot"></span>${art.status === "sold" ? "Sold" : "Available"}</div>
      ${art.status === "sold" ? "" : `<div class="price" id="detailPrice">${chosen ? money(chosen.price) : priceLabel(art)}</div>`}
      ${chosen ? `<div class="sizes">${art.options.map((o, n) =>
        `<button class="${n ? "" : "active"}" data-n="${n}">${o.size}</button>`).join("")}</div>` : ""}
      ${art.type === "print" ? `<dl><dt>Medium</dt><dd>${art.medium}</dd></dl>` : ""}
      <p class="desc">${art.description || ""}</p>
      <a class="ruled" id="buyBtn" target="_blank" rel="noopener"><span class="label"></span><span class="arrow" aria-hidden="true">→</span></a>
      <p class="small-note" id="buyNote"></p>
    </div>`;

  const buyBtn = d.querySelector("#buyBtn");
  const label = buyBtn.querySelector(".label");
  const note = d.querySelector("#buyNote");
  function updateBuy() {
    const link = chosen ? chosen.buyLink : art.buyLink;
    if (art.status === "sold") {
      label.textContent = "Inquire about similar work"; buyBtn.href = inquire; buyBtn.removeAttribute("target");
      note.textContent = "This painting has found a home.";
    } else if (link) {
      label.textContent = "Purchase"; buyBtn.href = link; buyBtn.target = "_blank";
      note.textContent = "Secure checkout. Free shipping within the US.";
    } else {
      label.textContent = "Inquire"; buyBtn.href = inquire; buyBtn.removeAttribute("target");
      note.textContent = "";
    }
  }
  updateBuy();

  const zoomBox = d.querySelector(".detail-main");
  enableZoom(zoomBox, d.querySelector("#mainPhoto"));

  d.querySelectorAll(".thumbs button").forEach(b => b.addEventListener("click", () => {
    zoomBox.resetZoom();
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

// Zoom on the large photo in the detail view:
// computers magnify where the mouse points; phones and tablets pinch with two fingers,
// drag with one finger to look around, and double-tap to zoom back out.
function enableZoom(box, img) {
  const MAX = 1.8;   // furthest a pinch can zoom (matches the 1.8x mouse zoom)
  let scale = 1, ox = 50, oy = 50;
  const clamp = v => Math.max(0, Math.min(100, v));
  const apply = () => {
    img.style.transformOrigin = `${ox}% ${oy}%`;
    img.style.transform = scale > 1 ? `scale(${scale})` : "";
    box.classList.toggle("zoomed", scale > 1);
  };
  const at = (x, y) => {
    const r = box.getBoundingClientRect();
    return [clamp((x - r.left) / r.width * 100), clamp((y - r.top) / r.height * 100)];
  };
  box.resetZoom = () => { scale = 1; apply(); };

  // mouse or trackpad: magnify wherever the pointer is
  box.addEventListener("pointermove", e => {
    if (e.pointerType !== "mouse") return;
    [ox, oy] = at(e.clientX, e.clientY); scale = 1.8; apply();
  });
  box.addEventListener("pointerleave", e => { if (e.pointerType === "mouse") box.resetZoom(); });

  // fingers: pinch, drag and double-tap
  const fingers = new Map();
  let startDist = 0, startScale = 1, last = null, lastTap = 0, tap = null;   // tap = a single finger that hasn't moved
  const gap = () => { const [a, b] = [...fingers.values()]; return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY); };
  box.addEventListener("pointerdown", e => {
    if (e.pointerType === "mouse") return;
    fingers.set(e.pointerId, e);
    box.classList.add("touching");
    tap = fingers.size === 1 ? { x: e.clientX, y: e.clientY, t: Date.now() } : null;
    if (fingers.size === 2) {
      const [a, b] = [...fingers.values()];
      startDist = gap(); startScale = scale;
      if (scale === 1) [ox, oy] = at((a.clientX + b.clientX) / 2, (a.clientY + b.clientY) / 2);
    }
    last = e;
  });
  box.addEventListener("pointermove", e => {
    if (!fingers.has(e.pointerId)) return;
    fingers.set(e.pointerId, e);
    if (tap && Math.hypot(e.clientX - tap.x, e.clientY - tap.y) > 10) tap = null;
    if (fingers.size === 2 && startDist) {
      scale = Math.max(1, Math.min(MAX, startScale * gap() / startDist));
      apply();
    } else if (fingers.size === 1 && scale > 1 && last) {
      const r = box.getBoundingClientRect();
      ox = clamp(ox - (e.clientX - last.clientX) / r.width * 100 / (scale - 1));
      oy = clamp(oy - (e.clientY - last.clientY) / r.height * 100 / (scale - 1));
      apply();
    }
    last = e;
  });
  const lift = e => {
    fingers.delete(e.pointerId);
    if (fingers.size < 2) startDist = 0;
    last = fingers.size ? [...fingers.values()][0] : null;
    if (!fingers.size) box.classList.remove("touching");
    if (scale < 1.05) box.resetZoom();
  };
  box.addEventListener("pointerup", e => {
    if (e.pointerType === "mouse") return;
    const wasTap = tap && fingers.size === 1 && Date.now() - tap.t < 300;
    lift(e);
    if (!wasTap) return;
    const now = Date.now();
    if (now - lastTap < 300 && scale > 1) { box.resetZoom(); lastTap = 0; }   // double-tap zooms back out
    else lastTap = now;
  });
  box.addEventListener("pointercancel", lift);
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
