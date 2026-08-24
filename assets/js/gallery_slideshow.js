(function () {
  var INTERVAL = 15000;

  function initSlideshow(root) {
    if (root.getAttribute("data-ready") === "true") {
      return;
    }
    root.setAttribute("data-ready", "true");

    var slides = Array.prototype.slice.call(root.querySelectorAll(".gallery-tile__slide"));
    var dots = Array.prototype.slice.call(root.querySelectorAll("[data-gallery-dot]"));
    if (slides.length < 2) {
      return;
    }

    var index = 0;
    var timer = null;
    var paused = false;
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    root.setAttribute("data-interval", String(INTERVAL));

    function show(next) {
      slides[index].classList.remove("is-active");
      if (dots[index]) {
        dots[index].classList.remove("is-active");
        dots[index].setAttribute("aria-selected", "false");
      }
      index = ((next % slides.length) + slides.length) % slides.length;
      slides[index].classList.add("is-active");
      if (dots[index]) {
        dots[index].classList.add("is-active");
        dots[index].setAttribute("aria-selected", "true");
      }
    }

    function canAdvance() {
      return (
        document.visibilityState === "visible" &&
        !paused &&
        !document.querySelector(".medium-zoom-image--opened")
      );
    }

    function stop() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    function start() {
      stop();
      if (reduced) {
        return;
      }
      timer = setInterval(function () {
        if (canAdvance()) {
          show(index + 1);
        }
      }, INTERVAL);
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        show(i);
        start();
      });
    });

    root.addEventListener("mouseenter", function () {
      paused = true;
    });
    root.addEventListener("mouseleave", function () {
      paused = false;
    });
    root.addEventListener("focusin", function () {
      paused = true;
    });
    root.addEventListener("focusout", function (event) {
      if (!root.contains(event.relatedTarget)) {
        paused = false;
      }
    });
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "visible") {
        start();
      } else {
        stop();
      }
    });

    start();
  }

  function init() {
    var slideshows = document.querySelectorAll("[data-gallery-slideshow]");
    for (var i = 0; i < slideshows.length; i += 1) {
      initSlideshow(slideshows[i]);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
