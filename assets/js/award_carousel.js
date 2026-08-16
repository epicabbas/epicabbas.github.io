(() => {
  const initCarousel = (root) => {
    if (root.dataset.ready === "true") {
      return;
    }
    root.dataset.ready = "true";

    const track = root.querySelector(".award-card__track");
    const slides = Array.from(root.querySelectorAll(".award-card__shot"));
    const prev = root.querySelector(".award-card__nav--prev");
    const next = root.querySelector(".award-card__nav--next");
    const dots = Array.from(root.querySelectorAll("[data-award-dot]"));

    if (!track || slides.length < 2) {
      return;
    }

    const currentIndex = () => {
      const width = track.clientWidth || 1;
      return Math.round(track.scrollLeft / width);
    };

    const goTo = (index) => {
      const nextIndex = Math.max(0, Math.min(slides.length - 1, index));
      track.scrollTo({ left: nextIndex * track.clientWidth, behavior: "smooth" });
    };

    const sync = () => {
      const index = currentIndex();
      dots.forEach((dot, i) => {
        dot.classList.toggle("is-active", i === index);
        dot.setAttribute("aria-selected", i === index ? "true" : "false");
      });
      if (prev) {
        prev.disabled = index <= 0;
      }
      if (next) {
        next.disabled = index >= slides.length - 1;
      }
    };

    prev?.addEventListener("click", () => goTo(currentIndex() - 1));
    next?.addEventListener("click", () => goTo(currentIndex() + 1));
    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => goTo(i));
    });
    track.addEventListener("scroll", () => requestAnimationFrame(sync), { passive: true });
    track.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goTo(currentIndex() + 1);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goTo(currentIndex() - 1);
      }
    });
    window.addEventListener("resize", () => goTo(currentIndex()));
    sync();
  };

  const init = () => {
    document.querySelectorAll("[data-award-carousel]").forEach(initCarousel);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
