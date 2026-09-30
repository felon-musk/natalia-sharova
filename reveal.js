// Fades sections into view as the visitor scrolls.
// Anything with class="reveal" starts hidden and fades up when it enters the screen.
// Visitors who've asked their device for less motion get a plain fade with no movement (see styles.css).

document.documentElement.classList.add("js-reveal");

const revealObserver = "IntersectionObserver" in window
  ? new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          revealObserver.unobserve(e.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 })
  : null;

function observeReveals(root = document) {
  root.querySelectorAll(".reveal:not(.is-visible)").forEach(el => {
    if (revealObserver) revealObserver.observe(el);
    else el.classList.add("is-visible");
  });
}

document.addEventListener("DOMContentLoaded", () => observeReveals());
