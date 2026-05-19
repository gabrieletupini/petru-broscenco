// Petru Broscenco — minimal interactions.
(function () {
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  const links = document.querySelector('.nav-links');

  // Sticky shadow
  if (nav) {
    const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 8);
    document.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Mobile menu
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Chiudi menu' : 'Apri menu');
    });
    links.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        links.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Reveal on intersect
  const targets = document.querySelectorAll('.studio-grid, .work, .cantiere-lede, .cantiere-scroll, .servizi-list li, .contatti-grid, .newsletter');
  targets.forEach((el) => el.classList.add('reveal'));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.06 });
    targets.forEach((el) => io.observe(el));
  } else {
    targets.forEach((el) => el.classList.add('is-in'));
  }

  // Year (footer + bottom bar)
  const yrEls = [document.getElementById('yr'), document.getElementById('yrBar')].filter(Boolean);
  const y = String(new Date().getFullYear());
  yrEls.forEach((el) => { el.textContent = y; });

  // Hero slideshow (home)
  const heroSlides = document.querySelectorAll('#heroSlides .hero-slide');
  const heroDots = document.querySelectorAll('.hero-progress span');
  if (heroSlides.length > 1) {
    let i = 0;
    const setActive = (idx) => {
      heroSlides.forEach((s, k) => s.classList.toggle('is-active', k === idx));
      heroDots.forEach((d, k) => d.classList.toggle('is-active', k === idx % heroDots.length));
    };
    setActive(0);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduced) {
      setInterval(() => {
        i = (i + 1) % heroSlides.length;
        setActive(i);
      }, 5200);
    }
  }

  // Gallery (progetti.html)
  const slides = document.querySelectorAll('.gslide');
  if (slides.length) {
    const total = slides.length;
    const $idx = document.getElementById('gcapIndex');
    const $title = document.getElementById('gcapTitle');
    const $sub = document.getElementById('gcapSub');
    const $place = document.getElementById('gcapPlace');
    const $year = document.getElementById('gcapYear');
    const $prev = document.getElementById('gPrev');
    const $next = document.getElementById('gNext');

    let cur = 0;
    const pad = (n) => String(n).padStart(2, '0');
    const update = (n) => {
      cur = ((n % total) + total) % total;
      slides.forEach((s, k) => s.classList.toggle('is-active', k === cur));
      const el = slides[cur];
      if ($idx)   $idx.textContent = `${pad(cur + 1)} / ${pad(total)}`;
      if ($title) $title.textContent = el.dataset.title || '';
      if ($sub)   $sub.textContent = el.dataset.sub || '';
      if ($place) $place.textContent = el.dataset.place || '';
      if ($year)  $year.textContent = el.dataset.year || '';
    };
    update(0);

    const next = () => update(cur + 1);
    const prev = () => update(cur - 1);
    if ($next) $next.addEventListener('click', next);
    if ($prev) $prev.addEventListener('click', prev);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
    });

    // Touch swipe
    const stage = document.getElementById('galleryStage');
    if (stage) {
      let startX = null;
      stage.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
      stage.addEventListener('touchend', (e) => {
        if (startX == null) return;
        const dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); }
        startX = null;
      });
    }

    // Autoplay with pause on hover/focus
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let timer = null;
    const start = () => { if (!reduced) timer = setInterval(next, 6000); };
    const stop  = () => { if (timer) { clearInterval(timer); timer = null; } };
    start();
    const gallery = document.getElementById('gallery');
    if (gallery) {
      gallery.addEventListener('mouseenter', stop);
      gallery.addEventListener('mouseleave', start);
      gallery.addEventListener('focusin', stop);
      gallery.addEventListener('focusout', start);
    }
  }
})();
