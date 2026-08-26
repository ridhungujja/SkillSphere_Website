document.addEventListener('DOMContentLoaded', () => {

  /* ---- LOADER ---- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (loader) loader.classList.add('hidden');
    }, 600);
  });

/* ---- NAVBAR SCROLL ---- */
const navbar = document.getElementById('navbar');
const noHero = navbar && navbar.classList.contains('no-hero');
window.addEventListener('scroll', () => {
    if (noHero) return;
    navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

  /* ---- MOBILE MENU ---- */
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      navToggle.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        navToggle.classList.remove('active');
      });
    });
  }

  /* ---- SMOOTH SCROLL ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = navbar.offsetHeight + 20;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ---- REVEAL ON SCROLL ---- */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  /* ---- COUNTER ANIMATION ---- */
  const animateCounters = () => {
    document.querySelectorAll('[data-count]').forEach(counter => {
      if (counter.dataset.animated) return;
      counter.dataset.animated = 'true';
      const target = parseInt(counter.dataset.count, 10);
      const duration = 2000;
      const step = Math.max(1, Math.floor(target / (duration / 16)));
      let current = 0;

      const tick = () => {
        current += step;
        if (current >= target) {
          counter.textContent = target.toLocaleString() + '+';
        } else {
          counter.textContent = current.toLocaleString();
          requestAnimationFrame(tick);
        }
      };
      requestAnimationFrame(tick);
    });
  };

  const impactStrip = document.querySelector('.impact-strip');
  if (impactStrip) {
    new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) animateCounters();
      });
    }, { threshold: 0.3 }).observe(impactStrip);
  }

  /* hero stat counters */
  const heroStatCards = document.querySelectorAll('.hero-stat-card [data-count]');
  if (heroStatCards.length) {
    setTimeout(() => {
      heroStatCards.forEach(counter => {
        const target = parseInt(counter.dataset.count, 10);
        const step = Math.max(1, Math.floor(target / (2200 / 16)));
        let current = 0;
        const tick = () => {
          current += step;
          if (current >= target) {
            counter.textContent = target.toLocaleString() + '+';
          } else {
            counter.textContent = current.toLocaleString();
            requestAnimationFrame(tick);
          }
        };
        requestAnimationFrame(tick);
      });
    }, 1200);
  }

  /* ---- TESTIMONIALS CAROUSEL ---- */
  const track = document.getElementById('testimonials-track');
  const prevBtn = document.getElementById('testimonial-prev');
  const nextBtn = document.getElementById('testimonial-next');

  if (track && prevBtn && nextBtn) {
    let currentIndex = 0;
    const cards = track.querySelectorAll('.testimonial-card');
    const totalCards = cards.length;

    const getCardWidth = () => {
      if (!cards.length) return 0;
      return cards[0].offsetWidth + 28;
    };

    const getVisible = () => {
      return Math.floor(track.parentElement.offsetWidth / getCardWidth()) || 1;
    };

    const updateCarousel = () => {
      track.style.transform = `translateX(-${currentIndex * getCardWidth()}px)`;
      track.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    };

    nextBtn.addEventListener('click', () => {
      const max = totalCards - getVisible();
      currentIndex = currentIndex < max ? currentIndex + 1 : 0;
      updateCarousel();
    });

    prevBtn.addEventListener('click', () => {
      const max = totalCards - getVisible();
      currentIndex = currentIndex > 0 ? currentIndex - 1 : max;
      updateCarousel();
    });

    let auto = setInterval(() => {
      const max = totalCards - getVisible();
      currentIndex = currentIndex < max ? currentIndex + 1 : 0;
      updateCarousel();
    }, 5000);

    track.addEventListener('mouseenter', () => clearInterval(auto));
    track.addEventListener('mouseleave', () => {
      auto = setInterval(() => {
        const max = totalCards - getVisible();
        currentIndex = currentIndex < max ? currentIndex + 1 : 0;
        updateCarousel();
      }, 5000);
    });
  }

  /* ---- SUPPLY DRIVE PROGRESS BAR ---- */
  const progressFill = document.querySelector('.drive-progress-fill');
  if (progressFill) {
    new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          progressFill.style.width = '25%';
        }
      });
    }, { threshold: 0.5 }).observe(progressFill);
  }

  /* ---- BACK TO TOP ---- */
  const backToTop = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---- HERO PARTICLES ---- */
  const canvas = document.getElementById('hero-particles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    const resizeCanvas = () => {
      const hero = document.getElementById('hero');
      if (!hero) return;
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
    };

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.25 + 0.05;
        this.opacityDir = Math.random() > 0.5 ? 0.001 : -0.001;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.opacity += this.opacityDir;
        if (this.opacity <= 0.03 || this.opacity >= 0.3) this.opacityDir *= -1;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(37, 99, 235, ${this.opacity})`;
        ctx.fill();
      }
    }

    const initParticles = () => {
      const count = Math.min(60, Math.floor((canvas.width * canvas.height) / 14000));
      particles = Array.from({ length: count }, () => new Particle());
    };

    const connectParticles = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(37, 99, 235, ${(1 - dist / 100) * 0.08})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      connectParticles();
      animationId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    initParticles();
    animate();

    window.addEventListener('resize', () => {
      resizeCanvas();
      initParticles();
    });

    const heroSection = document.getElementById('hero');
    if (heroSection) {
      new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (!animationId) animate();
          } else {
            cancelAnimationFrame(animationId);
            animationId = null;
          }
        });
      }).observe(heroSection);
    }
  }

  /* ---- PARALLAX ORBS ---- */
  const heroOrbs = document.querySelectorAll('.hero-orb');
  if (heroOrbs.length && window.matchMedia('(min-width: 768px)').matches) {
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      heroOrbs.forEach((orb, i) => {
        const factor = (i + 1) * 12;
        orb.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
      });
    }, { passive: true });
  }

  /* ---- EMAIL SUBSCRIBE ---- */
  const subscribeBtn = document.getElementById('subscribe-btn');
  const emailInput = document.getElementById('email-input');

  if (subscribeBtn && emailInput) {
    subscribeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = emailInput.value.trim();
      if (!email || !email.includes('@')) {
        emailInput.style.borderColor = '#ef4444';
        emailInput.placeholder = 'Please enter a valid email';
        setTimeout(() => {
          emailInput.style.borderColor = '';
          emailInput.placeholder = 'Enter your email to get involved...';
        }, 2500);
        return;
      }
      subscribeBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg> Joined!';
      subscribeBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
      emailInput.value = '';
      emailInput.placeholder = 'Thank you for joining SkillSphere!';
      setTimeout(() => {
        subscribeBtn.innerHTML = 'Join Us <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10m0 0L9 4m4 4L9 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        subscribeBtn.style.background = '';
        emailInput.placeholder = 'Enter your email to get involved...';
      }, 3500);
    });
  }

});