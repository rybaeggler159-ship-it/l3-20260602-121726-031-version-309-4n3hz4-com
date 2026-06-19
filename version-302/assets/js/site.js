function selectAll(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
}

function setupMobileNav() {
  const button = document.querySelector('[data-mobile-toggle]');
  const menu = document.querySelector('[data-nav-links]');
  if (!button || !menu) {
    return;
  }
  button.addEventListener('click', () => {
    menu.classList.toggle('open');
  });
}

function setupHero() {
  const hero = document.querySelector('[data-hero]');
  if (!hero) {
    return;
  }
  const slides = selectAll('[data-hero-slide]', hero);
  const dots = selectAll('[data-hero-dot]', hero);
  const prev = hero.querySelector('[data-hero-prev]');
  const next = hero.querySelector('[data-hero-next]');
  let index = 0;
  let timer = null;
  const show = nextIndex => {
    index = (nextIndex + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
    dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
  };
  const restart = () => {
    window.clearInterval(timer);
    timer = window.setInterval(() => show(index + 1), 5000);
  };
  if (prev) {
    prev.addEventListener('click', () => {
      show(index - 1);
      restart();
    });
  }
  if (next) {
    next.addEventListener('click', () => {
      show(index + 1);
      restart();
    });
  }
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      show(i);
      restart();
    });
  });
  show(0);
  restart();
}

function setupFilters() {
  const grid = document.querySelector('[data-filter-grid]');
  if (!grid) {
    return;
  }
  const input = document.querySelector('[data-search-input]');
  const region = document.querySelector('[data-region-filter]');
  const year = document.querySelector('[data-year-filter]');
  const cards = selectAll('[data-card]', grid);
  const apply = () => {
    const q = input ? input.value.trim().toLowerCase() : '';
    const r = region ? region.value : '';
    const y = year ? year.value : '';
    cards.forEach(card => {
      const text = card.dataset.text || '';
      const cardRegion = card.dataset.region || '';
      const cardYear = card.dataset.year || '';
      const matchQ = !q || text.includes(q);
      const matchR = !r || cardRegion === r;
      const matchY = !y || cardYear === y;
      card.style.display = matchQ && matchR && matchY ? '' : 'none';
    });
  };
  [input, region, year].forEach(node => {
    if (node) {
      node.addEventListener('input', apply);
      node.addEventListener('change', apply);
    }
  });
  apply();
}

document.addEventListener('DOMContentLoaded', () => {
  setupMobileNav();
  setupHero();
  setupFilters();
});
