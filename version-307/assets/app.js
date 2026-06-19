(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var menuButton = document.querySelector(".mobile-menu-button");
    var mobileNav = document.querySelector(".mobile-nav");
    if (menuButton && mobileNav) {
      menuButton.addEventListener("click", function () {
        mobileNav.classList.toggle("is-open");
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
    if (slides.length > 1) {
      var active = 0;
      var showSlide = function (index) {
        active = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle("is-active", slideIndex === active);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("is-active", dotIndex === active);
        });
      };
      dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
          showSlide(index);
        });
      });
      setInterval(function () {
        showSlide(active + 1);
      }, 5200);
      showSlide(0);
    }

    var searchInput = document.getElementById("movieSearchInput");
    var resultBox = document.getElementById("movieSearchResults");
    if (searchInput && resultBox && Array.isArray(window.movieSearchData)) {
      var renderResults = function (items) {
        if (!items.length) {
          resultBox.innerHTML = '<div class="search-result-item"><span></span><span><strong>未找到匹配影片</strong><em>可尝试更换关键词</em></span></div>';
          resultBox.classList.add("is-open");
          return;
        }
        resultBox.innerHTML = items.slice(0, 12).map(function (item) {
          return [
            '<a class="search-result-item" href="', item.url, '">',
            '<img src="', item.cover, '" alt="', item.title.replace(/"/g, '&quot;'), '">',
            '<span><strong>', item.title, '</strong><em>', item.year, ' · ', item.type, ' · ', item.genre, '</em></span>',
            '</a>'
          ].join("");
        }).join("");
        resultBox.classList.add("is-open");
      };
      searchInput.addEventListener("input", function () {
        var keyword = searchInput.value.trim().toLowerCase();
        if (!keyword) {
          resultBox.classList.remove("is-open");
          resultBox.innerHTML = "";
          return;
        }
        var matches = window.movieSearchData.filter(function (item) {
          return item.search.indexOf(keyword) !== -1;
        });
        renderResults(matches);
      });
      document.addEventListener("click", function (event) {
        if (!resultBox.contains(event.target) && event.target !== searchInput) {
          resultBox.classList.remove("is-open");
        }
      });
    }

    var filterButtons = Array.prototype.slice.call(document.querySelectorAll(".filter-button"));
    if (filterButtons.length) {
      var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card[data-type]"));
      filterButtons.forEach(function (button) {
        button.addEventListener("click", function () {
          var type = button.getAttribute("data-filter");
          filterButtons.forEach(function (item) {
            item.classList.remove("is-active");
          });
          button.classList.add("is-active");
          cards.forEach(function (card) {
            var current = card.getAttribute("data-type") || "";
            var visible = type === "all" || current.indexOf(type) !== -1;
            card.classList.toggle("hidden-card", !visible);
          });
        });
      });
    }
  });
})();
