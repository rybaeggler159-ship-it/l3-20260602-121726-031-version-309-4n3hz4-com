
const state = {
  hlsModule: null
};

document.addEventListener('DOMContentLoaded', () => {
  initMobileNavigation();
  initHeaderSearch();
  initHeroCarousel();
  initLocalFilters();
  initSearchPage();
  initPlayers();
  initImageFallbacks();
});

function initMobileNavigation() {
  const button = document.querySelector('[data-menu-button]');
  const nav = document.querySelector('[data-mobile-nav]');

  if (!button || !nav) {
    return;
  }

  button.addEventListener('click', () => {
    nav.classList.toggle('is-open');
  });
}

function initHeaderSearch() {
  const forms = document.querySelectorAll('[data-search-form]');

  forms.forEach((form) => {
    form.addEventListener('submit', (event) => {
      const input = form.querySelector('input[name="q"]');
      const query = input ? input.value.trim() : '';

      if (!query) {
        event.preventDefault();
        return;
      }

      event.preventDefault();
      const prefix = form.dataset.rootPrefix || '';
      window.location.href = `${prefix}search.html?q=${encodeURIComponent(query)}`;
    });
  });
}

function initHeroCarousel() {
  const carousel = document.querySelector('[data-hero-carousel]');

  if (!carousel) {
    return;
  }

  const slides = Array.from(carousel.querySelectorAll('[data-hero-slide]'));
  const dots = Array.from(carousel.querySelectorAll('[data-hero-dot]'));
  const next = carousel.querySelector('[data-hero-next]');
  const prev = carousel.querySelector('[data-hero-prev]');
  let index = 0;
  let timer = null;

  const show = (nextIndex) => {
    index = (nextIndex + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('is-active', slideIndex === index);
    });
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('is-active', dotIndex === index);
    });
  };

  const restart = () => {
    window.clearInterval(timer);
    timer = window.setInterval(() => show(index + 1), 5200);
  };

  if (next) {
    next.addEventListener('click', () => {
      show(index + 1);
      restart();
    });
  }

  if (prev) {
    prev.addEventListener('click', () => {
      show(index - 1);
      restart();
    });
  }

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      show(Number(dot.dataset.heroDot || 0));
      restart();
    });
  });

  restart();
}

function initLocalFilters() {
  const grid = document.querySelector('[data-card-grid]');
  const input = document.querySelector('[data-local-search]');
  const select = document.querySelector('[data-local-filter]');
  const count = document.querySelector('[data-result-count]');

  if (!grid || (!input && !select)) {
    return;
  }

  const cards = Array.from(grid.querySelectorAll('[data-card]'));

  const apply = () => {
    const query = input ? input.value.trim().toLowerCase() : '';
    const filter = select ? select.value.trim().toLowerCase() : '';
    let visible = 0;

    cards.forEach((card) => {
      const searchText = (card.dataset.search || '').toLowerCase();
      const genre = (card.dataset.genre || '').toLowerCase();
      const matchesQuery = !query || searchText.includes(query);
      const matchesFilter = !filter || genre.includes(filter) || searchText.includes(filter);
      const shouldShow = matchesQuery && matchesFilter;

      card.style.display = shouldShow ? '' : 'none';
      if (shouldShow) {
        visible += 1;
      }
    });

    if (count) {
      count.textContent = `${visible} 部影片`;
    }
  };

  if (input) {
    input.addEventListener('input', apply);
  }

  if (select) {
    select.addEventListener('change', apply);
  }

  apply();
}

function initSearchPage() {
  const app = document.querySelector('[data-search-app]');

  if (!app || !window.MOVIE_DATA) {
    return;
  }

  const input = app.querySelector('[data-search-page-input]');
  const regionSelect = app.querySelector('[data-search-region]');
  const yearSelect = app.querySelector('[data-search-year]');
  const button = app.querySelector('[data-search-button]');
  const summary = app.querySelector('[data-search-summary]');
  const results = app.querySelector('[data-search-results]');
  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get('q') || '';

  const regions = Array.from(new Set(window.MOVIE_DATA.map((movie) => movie.region))).sort();
  const years = Array.from(new Set(window.MOVIE_DATA.map((movie) => movie.year))).sort((a, b) => b - a);

  regions.forEach((region) => {
    const option = document.createElement('option');
    option.value = region;
    option.textContent = region;
    regionSelect.appendChild(option);
  });

  years.forEach((year) => {
    const option = document.createElement('option');
    option.value = String(year);
    option.textContent = String(year);
    yearSelect.appendChild(option);
  });

  input.value = initialQuery;

  const render = () => {
    const query = input.value.trim().toLowerCase();
    const region = regionSelect.value;
    const year = yearSelect.value;

    const matched = window.MOVIE_DATA.filter((movie) => {
      const text = [
        movie.title,
        movie.region,
        movie.type,
        movie.year,
        movie.genre,
        movie.category,
        movie.tags.join(' '),
        movie.oneLine,
        movie.summary
      ].join(' ').toLowerCase();

      const matchesQuery = !query || text.includes(query);
      const matchesRegion = !region || movie.region === region;
      const matchesYear = !year || String(movie.year) === year;

      return matchesQuery && matchesRegion && matchesYear;
    }).sort((a, b) => b.score - a.score);

    const limited = matched.slice(0, 240);
    results.innerHTML = limited.map(renderSearchCard).join('');

    if (summary) {
      const suffix = matched.length > limited.length ? `，当前显示前 ${limited.length} 条` : '';
      summary.textContent = `找到 ${matched.length} 部影片${suffix}`;
    }
  };

  button.addEventListener('click', render);
  input.addEventListener('input', render);
  regionSelect.addEventListener('change', render);
  yearSelect.addEventListener('change', render);

  render();
}

function renderSearchCard(movie) {
  const tags = movie.tags.slice(0, 3).map((tag) => `<span>${escapeHtml(tag)}</span>`).join('');

  return `
    <article class="movie-card">
      <a href="${movie.detailUrl}" class="movie-cover-link" aria-label="查看${escapeHtml(movie.title)}">
        <img src="${movie.cover}" alt="${escapeHtml(movie.title)}" loading="lazy" />
        <span class="cover-gradient"></span>
        <span class="play-chip">播放</span>
      </a>
      <div class="movie-card-body">
        <div class="card-tags">${tags}</div>
        <h3><a href="${movie.detailUrl}">${escapeHtml(movie.title)}</a></h3>
        <p>${escapeHtml(movie.oneLine)}</p>
        <div class="card-meta">
          <span>${escapeHtml(movie.region)}</span>
          <span>${movie.year}</span>
          <span>${escapeHtml(movie.type)}</span>
        </div>
      </div>
    </article>
  `;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function initPlayers() {
  const players = document.querySelectorAll('[data-video-player]');

  players.forEach((player) => {
    const video = player.querySelector('video');
    const button = player.querySelector('[data-play-button]');
    const message = player.querySelector('[data-player-message]');

    if (!video || !button) {
      return;
    }

    button.addEventListener('click', async () => {
      button.disabled = true;
      button.querySelector('strong').textContent = '正在加载';

      try {
        await attachVideoSource(video);
        await video.play();
        player.classList.add('is-playing');
        if (message) {
          message.textContent = '播放源已加载，可使用播放器控制条操作。';
        }
      } catch (error) {
        button.disabled = false;
        button.querySelector('strong').textContent = '重新播放';
        if (message) {
          message.textContent = '播放加载失败，请稍后重试或检查网络环境。';
        }
        console.error(error);
      }
    });

    video.addEventListener('play', () => player.classList.add('is-playing'));
    video.addEventListener('pause', () => {
      if (!video.ended) {
        player.classList.remove('is-playing');
        button.disabled = false;
        button.querySelector('strong').textContent = '继续播放';
      }
    });
  });
}

async function attachVideoSource(video) {
  const source = video.dataset.hlsSrc;

  if (!source || video.dataset.ready === 'true') {
    return;
  }

  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = source;
    video.dataset.ready = 'true';
    return;
  }

  const Hls = await loadHls();

  if (Hls && Hls.isSupported()) {
    const hls = new Hls({
      enableWorker: true,
      lowLatencyMode: true
    });

    hls.loadSource(source);
    hls.attachMedia(video);
    video.hlsInstance = hls;
    video.dataset.ready = 'true';
    return;
  }

  video.src = source;
  video.dataset.ready = 'true';
}

async function loadHls() {
  if (!state.hlsModule) {
    state.hlsModule = import('./hls-vendor-dru42stk.js').then((module) => module.H);
  }

  return state.hlsModule;
}

function initImageFallbacks() {
  const images = document.querySelectorAll('img');

  images.forEach((image) => {
    image.addEventListener('error', () => {
      image.classList.add('image-missing');
      image.alt = image.alt || '';
    }, { once: true });
  });
}
