(() => {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  
  const nav = $('#navbar');
  if (nav && !nav.classList.contains('no-hero')) {
    const onScroll = () => nav.classList.toggle('scrolled', scrollY > 24);
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
  
  const toggle = $('#nav-toggle');
  const links = $('#nav-links');
  if (toggle && links) {
    const setOpen = (open) => {
      links.classList.toggle('active', open);
      toggle.classList.toggle('active', open);
      toggle.setAttribute('aria-expanded', String(open));
      document.body.classList.toggle('nav-open', open);
      if (open) $('a', links)?.focus();
    };
    toggle.addEventListener('click', () => setOpen(!links.classList.contains('active')));
    links.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
    addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && links.classList.contains('active')) { setOpen(false); toggle.focus(); }
    });
    links.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab' || !links.classList.contains('active')) return;
      const f = $$('a, button', links); const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }
  
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const t = a.getAttribute('href').length > 1 && $(a.getAttribute('href'));
      if (!t) return;
      e.preventDefault();
      t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      t.setAttribute('tabindex', '-1'); t.focus({ preventScroll: true });
    });
  });
  
  if (!reduce && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target;
        const kids = $$('[data-reveal]', el);
        (kids.length ? kids : [el]).forEach((k, i) => {
          k.style.transitionDelay = `${Math.min(i * 70, 420)}ms`;
          k.classList.add('is-in');
        });
        io.unobserve(el);
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
    $$('[data-reveal-group], [data-reveal]:not([data-reveal-group] [data-reveal])').forEach((el) => io.observe(el));
  } else {
    $$('[data-reveal]').forEach((el) => el.classList.add('is-in'));
  }
  
  const track = $('#testimonials-track');
  const prev = $('#testimonial-prev'), next = $('#testimonial-next');
  if (track && prev && next) {
    const cards = $$('.testimonial-card', track);
    let i = 0;
    const step = () => cards[0].offsetWidth + parseFloat(getComputedStyle(track).gap || 0);
    const visible = () => Math.max(1, Math.floor(track.parentElement.offsetWidth / step()));
    const go = (n) => {
      const max = Math.max(0, cards.length - visible());
      i = (n + max + 1) % (max + 1);
      track.style.transform = `translateX(-${i * step()}px)`;
    };
    next.addEventListener('click', () => go(i + 1));
    prev.addEventListener('click', () => go(i - 1));
    track.parentElement.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') go(i + 1);
      if (e.key === 'ArrowLeft') go(i - 1);
    });
    addEventListener('resize', () => go(i), { passive: true });
  }
  
  const btt = $('#back-to-top');
  if (btt) {
    addEventListener('scroll', () => btt.classList.toggle('visible', scrollY > 600), { passive: true });
    btt.addEventListener('click', () => scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));
  }
})();
