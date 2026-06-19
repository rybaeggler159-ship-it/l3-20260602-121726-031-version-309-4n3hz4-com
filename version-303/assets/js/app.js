(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
      return;
    }
    callback();
  }

  function initMenu() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var nav = document.querySelector("[data-main-nav]");
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener("click", function () {
      nav.classList.toggle("is-open");
    });
  }

  function initHero() {
    var root = document.querySelector("[data-hero-carousel]");
    if (!root) {
      return;
    }
    var slides = Array.prototype.slice.call(
      root.querySelectorAll("[data-hero-slide]"),
    );
    var dots = Array.prototype.slice.call(
      root.querySelectorAll("[data-hero-dot]"),
    );
    if (!slides.length) {
      return;
    }
    var index = 0;
    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        show(i);
      });
    });
    window.setInterval(function () {
      show(index + 1);
    }, 5200);
  }

  function initFilters() {
    var input = document.querySelector("[data-filter-input]");
    var type = document.querySelector("[data-filter-type]");
    var list = document.querySelector("[data-filter-list]");
    if (!list || (!input && !type)) {
      return;
    }
    var items = Array.prototype.slice.call(list.children);
    function apply() {
      var keyword = input ? input.value.trim().toLowerCase() : "";
      var selectedType = type ? type.value : "";
      items.forEach(function (item) {
        var haystack = [
          item.getAttribute("data-title") || "",
          item.getAttribute("data-year") || "",
          item.getAttribute("data-region") || "",
          item.getAttribute("data-type") || "",
          item.getAttribute("data-tags") || "",
        ]
          .join(" ")
          .toLowerCase();
        var itemType = item.getAttribute("data-type") || "";
        var matchedKeyword = !keyword || haystack.indexOf(keyword) !== -1;
        var matchedType =
          !selectedType || itemType.indexOf(selectedType) !== -1;
        item.classList.toggle(
          "is-filter-hidden",
          !(matchedKeyword && matchedType),
        );
      });
    }
    if (input) {
      input.addEventListener("input", apply);
    }
    if (type) {
      type.addEventListener("change", apply);
    }
  }

  function initPlayer() {
    var video = document.querySelector(".movie-player");
    var button = document.querySelector("[data-play-button]");
    if (!video) {
      return;
    }
    var source = video.getAttribute("data-src");
    var attached = false;

    function attachSource() {
      if (attached || !source) {
        return;
      }
      attached = true;
      if (window.Hls && window.Hls.isSupported && window.Hls.isSupported()) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90,
        });
        hls.loadSource(source);
        hls.attachMedia(video);
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
      } else {
        video.src = source;
      }
    }

    function playVideo() {
      attachSource();
      if (button) {
        button.classList.add("is-hidden");
      }
      var promise = video.play();
      if (promise && typeof promise.catch === "function") {
        promise.catch(function () {
          video.controls = true;
        });
      }
    }

    if (button) {
      button.addEventListener("click", playVideo);
    }
    video.addEventListener("click", function () {
      attachSource();
    });
    video.addEventListener("play", function () {
      if (button) {
        button.classList.add("is-hidden");
      }
    });
  }

  ready(function () {
    initMenu();
    initHero();
    initFilters();
    initPlayer();
  });
})();
