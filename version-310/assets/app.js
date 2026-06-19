(function () {
  function ready(fn) {
    if (document.readyState === "complete") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  ready(function () {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector(".main-nav");
    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        nav.classList.toggle("open");
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
    var current = 0;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("active", i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("active", i === current);
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        showSlide(index);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }

    var panel = document.getElementById("searchPanel");
    var input = document.getElementById("searchInput");
    var results = document.getElementById("searchResults");
    var title = document.getElementById("searchTitle");

    function movieCard(movie) {
      return [
        '<article class="movie-card card-hover glass-effect">',
        '  <a class="poster-link" href="' + movie.url + '">',
        '    <img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
        '    <span class="play-hover">▶</span>',
        '  </a>',
        '  <div class="movie-card-body">',
        '    <h3><a href="' + movie.url + '">' + escapeHtml(movie.title) + '</a></h3>',
        '    <p>' + escapeHtml(movie.oneLine) + '</p>',
        '    <div class="movie-meta">',
        '      <span>' + escapeHtml(movie.region) + '</span>',
        '      <span>' + escapeHtml(movie.type) + '</span>',
        '      <span>' + escapeHtml(movie.year) + '</span>',
        '    </div>',
        '  </div>',
        '</article>'
      ].join("\n");
    }

    function escapeHtml(value) {
      return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    function runSearch(value) {
      if (!results || !window.SITE_MOVIES) {
        return;
      }
      var query = String(value || "").trim().toLowerCase();
      if (!query) {
        title.textContent = "热门推荐";
        return;
      }
      var matched = window.SITE_MOVIES.filter(function (movie) {
        return movie.searchText.indexOf(query) !== -1;
      }).slice(0, 120);
      title.textContent = "搜索结果";
      results.innerHTML = matched.length
        ? matched.map(movieCard).join("\n")
        : '<div class="content-card glass-effect"><h2>未找到相关影片</h2><p>可以尝试更换影片名、地区、类型或年份继续搜索。</p></div>';
    }

    if (input && results) {
      var params = new URLSearchParams(window.location.search);
      var initial = params.get("q") || "";
      input.value = initial;
      runSearch(initial);
      input.addEventListener("input", function () {
        runSearch(input.value);
      });
      if (panel) {
        panel.addEventListener("submit", function (event) {
          event.preventDefault();
          runSearch(input.value);
        });
      }
    }
  });
})();
