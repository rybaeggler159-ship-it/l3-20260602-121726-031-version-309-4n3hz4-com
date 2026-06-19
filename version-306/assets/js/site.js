(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var menu = document.querySelector('[data-main-nav]');
  if (menuButton && menu) {
    menuButton.addEventListener('click', function () {
      menu.classList.toggle('open');
    });
  }

  document.querySelectorAll('[data-hero-carousel]').forEach(function (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
    var prev = carousel.querySelector('[data-hero-prev]');
    var next = carousel.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === index);
      });
    }

    function start() {
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }
      start();
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        restart();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        restart();
      });
    });

    show(0);
    start();
  });

  var searchPage = document.querySelector('[data-search-page]');
  if (searchPage) {
    var params = new URLSearchParams(window.location.search);
    var input = searchPage.querySelector('[data-search-input]');
    var yearFilter = searchPage.querySelector('[data-year-filter]');
    var regionFilter = searchPage.querySelector('[data-region-filter]');
    var typeFilter = searchPage.querySelector('[data-type-filter]');
    var categoryFilter = searchPage.querySelector('[data-category-filter]');
    var cards = Array.prototype.slice.call(searchPage.querySelectorAll('[data-card]'));

    if (input) {
      input.value = params.get('q') || '';
    }

    function valueOf(el) {
      return el ? String(el.value || '').toLowerCase().trim() : '';
    }

    function applyFilters() {
      var keyword = valueOf(input);
      var year = valueOf(yearFilter);
      var region = valueOf(regionFilter);
      var type = valueOf(typeFilter);
      var category = valueOf(categoryFilter);

      cards.forEach(function (card) {
        var text = String(card.getAttribute('data-search') || '').toLowerCase();
        var ok = true;
        if (keyword && text.indexOf(keyword) === -1) {
          ok = false;
        }
        if (year && String(card.getAttribute('data-year') || '').toLowerCase() !== year) {
          ok = false;
        }
        if (region && String(card.getAttribute('data-region') || '').toLowerCase() !== region) {
          ok = false;
        }
        if (type && String(card.getAttribute('data-type') || '').toLowerCase() !== type) {
          ok = false;
        }
        if (category && String(card.getAttribute('data-category') || '').toLowerCase() !== category) {
          ok = false;
        }
        card.classList.toggle('is-hidden', !ok);
      });
    }

    [input, yearFilter, regionFilter, typeFilter, categoryFilter].forEach(function (el) {
      if (!el) {
        return;
      }
      el.addEventListener('input', applyFilters);
      el.addEventListener('change', applyFilters);
    });

    applyFilters();
  }
})();
