(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function setupMenu() {
        var button = document.querySelector("[data-menu-button]");
        var panel = document.querySelector("[data-mobile-panel]");
        if (!button || !panel) {
            return;
        }
        button.addEventListener("click", function () {
            panel.classList.toggle("is-open");
        });
    }

    function setupHero() {
        var slider = document.querySelector("[data-hero-slider]");
        if (!slider) {
            return;
        }
        var slides = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-dot]"));
        var prev = slider.querySelector("[data-hero-prev]");
        var next = slider.querySelector("[data-hero-next]");
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            if (!slides.length) {
                return;
            }
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === index);
            });
        }

        function restart() {
            if (timer) {
                window.clearInterval(timer);
            }
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        if (prev) {
            prev.addEventListener("click", function () {
                show(index - 1);
                restart();
            });
        }
        if (next) {
            next.addEventListener("click", function () {
                show(index + 1);
                restart();
            });
        }
        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                show(Number(dot.getAttribute("data-hero-dot")) || 0);
                restart();
            });
        });
        show(0);
        restart();
    }

    function setupFilters() {
        var panels = Array.prototype.slice.call(document.querySelectorAll("[data-card-filter]"));
        panels.forEach(function (panel) {
            var scope = panel.parentElement || document;
            var textInput = panel.querySelector("[data-filter-text]");
            var typeSelect = panel.querySelector("[data-filter-type]");
            var yearSelect = panel.querySelector("[data-filter-year]");
            var resetButton = panel.querySelector("[data-filter-reset]");
            var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-card]"));

            function apply() {
                var query = textInput ? textInput.value.trim().toLowerCase() : "";
                var type = typeSelect ? typeSelect.value : "";
                var year = yearSelect ? yearSelect.value : "";
                cards.forEach(function (card) {
                    var haystack = [
                        card.getAttribute("data-title"),
                        card.getAttribute("data-region"),
                        card.getAttribute("data-genre"),
                        card.getAttribute("data-category"),
                        card.getAttribute("data-type"),
                        card.getAttribute("data-year")
                    ].join(" ").toLowerCase();
                    var matchText = !query || haystack.indexOf(query) !== -1;
                    var matchType = !type || card.getAttribute("data-type") === type;
                    var matchYear = !year || card.getAttribute("data-year") === year;
                    card.style.display = matchText && matchType && matchYear ? "" : "none";
                });
            }

            [textInput, typeSelect, yearSelect].forEach(function (element) {
                if (element) {
                    element.addEventListener("input", apply);
                    element.addEventListener("change", apply);
                }
            });
            if (resetButton) {
                resetButton.addEventListener("click", function () {
                    if (textInput) {
                        textInput.value = "";
                    }
                    if (typeSelect) {
                        typeSelect.value = "";
                    }
                    if (yearSelect) {
                        yearSelect.value = "";
                    }
                    apply();
                });
            }
        });
    }

    function escapeHtml(value) {
        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function searchCard(movie) {
        var tags = (movie.tags || []).slice(0, 3).map(function (tag) {
            return "<span>" + escapeHtml(tag) + "</span>";
        }).join("");
        return [
            "<article class=\"movie-card\" data-card>",
            "<a href=\"./" + escapeHtml(movie.file) + "\" class=\"movie-card__link\">",
            "<div class=\"movie-card__cover\">",
            "<img src=\"" + escapeHtml(movie.cover) + "\" alt=\"" + escapeHtml(movie.title) + "\" loading=\"lazy\">",
            "<span class=\"movie-card__badge\">" + escapeHtml(movie.category) + "</span>",
            "<span class=\"movie-card__duration\">" + escapeHtml(movie.duration) + "</span>",
            "<span class=\"movie-card__play\">▶</span>",
            "</div>",
            "<div class=\"movie-card__body\">",
            "<h3>" + escapeHtml(movie.title) + "</h3>",
            "<p>" + escapeHtml(movie.description) + "</p>",
            "<div class=\"movie-card__meta\"><span>" + escapeHtml(movie.year) + "</span><span>" + escapeHtml(movie.region) + "</span><span>" + escapeHtml(movie.type) + "</span></div>",
            "<div class=\"movie-card__tags\">" + tags + "</div>",
            "</div>",
            "</a>",
            "</article>"
        ].join("");
    }

    function setupSearch() {
        var input = document.querySelector("[data-search-input]");
        var results = document.querySelector("[data-search-results]");
        var status = document.querySelector("[data-search-status]");
        if (!input || !results || !status || !window.SEARCH_INDEX) {
            return;
        }
        var params = new URLSearchParams(window.location.search);
        var initial = params.get("q") || "";
        input.value = initial;

        function render() {
            var query = input.value.trim().toLowerCase();
            if (!query) {
                results.innerHTML = "";
                status.textContent = "输入关键词后显示匹配内容";
                return;
            }
            var words = query.split(/\s+/).filter(Boolean);
            var matches = window.SEARCH_INDEX.filter(function (movie) {
                var haystack = [movie.title, movie.description, movie.region, movie.type, movie.year, movie.genre, movie.category, (movie.tags || []).join(" ")].join(" ").toLowerCase();
                return words.every(function (word) {
                    return haystack.indexOf(word) !== -1;
                });
            }).slice(0, 120);
            status.textContent = matches.length ? "匹配内容" : "未找到相关内容";
            results.innerHTML = matches.map(searchCard).join("");
        }

        input.addEventListener("input", render);
        render();
    }

    ready(function () {
        setupMenu();
        setupHero();
        setupFilters();
        setupSearch();
    });
})();

function initMoviePlayer(src) {
    var shell = document.querySelector(".player-shell");
    if (!shell) {
        return;
    }
    var video = shell.querySelector(".movie-player");
    var button = shell.querySelector(".player-start");
    var hlsInstance = null;
    var loaded = false;

    function load() {
        if (loaded) {
            return;
        }
        loaded = true;
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = src;
        } else if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new window.Hls({
                maxBufferLength: 30
            });
            hlsInstance.loadSource(src);
            hlsInstance.attachMedia(video);
        } else {
            video.src = src;
        }
    }

    function play() {
        load();
        shell.classList.add("is-playing");
        var attempt = video.play();
        if (attempt && typeof attempt.catch === "function") {
            attempt.catch(function () {});
        }
    }

    if (button) {
        button.addEventListener("click", play);
    }
    video.addEventListener("click", function () {
        if (video.paused) {
            play();
        }
    });
    video.addEventListener("play", function () {
        shell.classList.add("is-playing");
    });
    video.addEventListener("ended", function () {
        shell.classList.remove("is-playing");
    });
    window.addEventListener("pagehide", function () {
        if (hlsInstance) {
            hlsInstance.destroy();
        }
    });
}
