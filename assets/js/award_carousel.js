(function () {
  function initCarousel(root) {
    if (root.getAttribute("data-ready") === "true") {
      return;
    }
    root.setAttribute("data-ready", "true");

    var track = root.querySelector(".award-card__track");
    var slides = Array.prototype.slice.call(root.querySelectorAll(".award-card__shot"));
    var prev = root.querySelector(".award-card__nav--prev");
    var next = root.querySelector(".award-card__nav--next");
    var dots = Array.prototype.slice.call(root.querySelectorAll("[data-award-dot]"));

    if (!track || slides.length < 2) {
      return;
    }

    function currentIndex() {
      var width = track.clientWidth || 1;
      return Math.round(track.scrollLeft / width);
    }

    function goTo(index) {
      var nextIndex = Math.max(0, Math.min(slides.length - 1, index));
      track.scrollTo({ left: nextIndex * track.clientWidth, behavior: "smooth" });
    }

    function sync() {
      var index = currentIndex();
      dots.forEach(function (dot, i) {
        if (i === index) {
          dot.classList.add("is-active");
        } else {
          dot.classList.remove("is-active");
        }
        dot.setAttribute("aria-selected", i === index ? "true" : "false");
      });
      if (prev) {
        prev.disabled = index <= 0;
      }
      if (next) {
        next.disabled = index >= slides.length - 1;
      }
    }

    if (prev) {
      prev.addEventListener("click", function () {
        goTo(currentIndex() - 1);
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        goTo(currentIndex() + 1);
      });
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        goTo(i);
      });
    });
    track.addEventListener(
      "scroll",
      function () {
        requestAnimationFrame(sync);
      },
      { passive: true }
    );
    track.addEventListener("keydown", function (event) {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goTo(currentIndex() + 1);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goTo(currentIndex() - 1);
      }
    });
    window.addEventListener("resize", function () {
      goTo(currentIndex());
    });
    sync();
  }

  function init() {
    var carousels = document.querySelectorAll("[data-award-carousel]");
    for (var i = 0; i < carousels.length; i += 1) {
      initCarousel(carousels[i]);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
