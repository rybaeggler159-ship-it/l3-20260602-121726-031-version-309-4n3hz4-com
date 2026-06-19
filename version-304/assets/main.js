(function () {
  var menuButton = document.querySelector("[data-menu-button]");
  var mobilePanel = document.querySelector("[data-mobile-panel]");

  if (menuButton && mobilePanel) {
    menuButton.addEventListener("click", function () {
      mobilePanel.classList.toggle("is-open");
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
  var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
  var activeSlide = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    activeSlide = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle("is-active", slideIndex === activeSlide);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle("is-active", dotIndex === activeSlide);
    });
  }

  if (slides.length) {
    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener("click", function () {
        showSlide(dotIndex);
      });
    });

    window.setInterval(function () {
      showSlide(activeSlide + 1);
    }, 5200);
  }

  var searchInput = document.querySelector("[data-search-input]");
  var yearFilter = document.querySelector("[data-year-filter]");
  var sortFilter = document.querySelector("[data-sort-filter]");
  var cards = Array.prototype.slice.call(document.querySelectorAll("[data-card]"));
  var emptyState = document.querySelector("[data-empty-state]");

  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  function cardText(card) {
    return normalize([
      card.getAttribute("data-title"),
      card.getAttribute("data-region"),
      card.getAttribute("data-genre"),
      card.getAttribute("data-type"),
      card.textContent
    ].join(" "));
  }

  function applyFilters() {
    if (!cards.length) {
      return;
    }

    var query = normalize(searchInput ? searchInput.value : "");
    var minYear = yearFilter && yearFilter.value ? Number(yearFilter.value) : 0;
    var visibleCount = 0;

    cards.forEach(function (card) {
      var year = Number(card.getAttribute("data-year") || 0);
      var matchQuery = !query || cardText(card).indexOf(query) !== -1;
      var matchYear = !minYear || year >= minYear;
      var visible = matchQuery && matchYear;

      card.style.display = visible ? "" : "none";

      if (visible) {
        visibleCount += 1;
      }
    });

    if (emptyState) {
      emptyState.classList.toggle("is-visible", visibleCount === 0);
    }
  }

  function applySort() {
    if (!sortFilter || !cards.length) {
      applyFilters();
      return;
    }

    var value = sortFilter.value;
    var parent = cards[0].parentElement;
    var sorted = cards.slice();

    if (value === "year-desc") {
      sorted.sort(function (a, b) {
        return Number(b.getAttribute("data-year") || 0) - Number(a.getAttribute("data-year") || 0);
      });
    }

    if (value === "year-asc") {
      sorted.sort(function (a, b) {
        return Number(a.getAttribute("data-year") || 0) - Number(b.getAttribute("data-year") || 0);
      });
    }

    if (value === "title") {
      sorted.sort(function (a, b) {
        return String(a.getAttribute("data-title") || "").localeCompare(String(b.getAttribute("data-title") || ""), "zh-Hans-CN");
      });
    }

    sorted.forEach(function (card) {
      parent.appendChild(card);
    });

    applyFilters();
  }

  if (searchInput) {
    searchInput.addEventListener("input", applyFilters);
  }

  if (yearFilter) {
    yearFilter.addEventListener("change", applyFilters);
  }

  if (sortFilter) {
    sortFilter.addEventListener("change", applySort);
  }
})();
