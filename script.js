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
  
  const form = $('form[name="contact"]');
  if (form) {
    const TOPICS = {
      join: 'Join SkillSphere', chapter: 'Start a chapter', partner: 'Partner with us',
      box: 'Host a donation box', donate: 'Donate or sponsor', press: 'Media or press', other: 'Other',
    };
    const topic = $('#topic', form);
    const pick = (key) => { if (topic && TOPICS[key]) topic.value = TOPICS[key]; };
    const params = new URLSearchParams(location.search);
    pick(params.get('topic'));
    if (params.get('sent') === '1') {
      const notice = $('#form-notice');
      if (notice) { notice.hidden = false; notice.focus(); }
    }
    $$('[data-topic]').forEach((a) => a.addEventListener('click', () => {
      pick(a.dataset.topic);
      setTimeout(() => $('#name', form)?.focus(), 0);
    }));
  }

  // Press belt: drifts left, eases to a stop while hovered or focused, eases back when left.
  const belt = $('.press-strip');
  const track = belt && $('.press-track', belt);
  if (track && !reduce) {
    const CRUISE = 55; // px per second
    let x = 0, speed = CRUISE, target = CRUISE, last = performance.now();
    belt.addEventListener('mouseenter', () => { target = 0; });
    belt.addEventListener('mouseleave', () => { target = CRUISE; });
    belt.addEventListener('focusin', () => { target = 0; });
    belt.addEventListener('focusout', () => { target = CRUISE; });
    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05); last = now;
      speed += (target - speed) * Math.min(1, dt * 7);
      x -= speed * dt;
      const loop = track.scrollWidth / 2;
      if (x <= -loop) x += loop;
      track.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  const btt = $('#back-to-top');
  if (btt) {
    addEventListener('scroll', () => btt.classList.toggle('visible', scrollY > 600), { passive: true });
    btt.addEventListener('click', () => scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));
  }
})();
