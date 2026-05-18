/* =========================================================
   Ransome Tree Felling — Interactions
   ========================================================= */

(() => {
  'use strict';

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navDrawer = document.getElementById('navDrawer');

  if (navToggle && navDrawer) {
    navToggle.addEventListener('click', () => {
      const isOpen = navDrawer.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navDrawer.setAttribute('aria-hidden', String(!isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close drawer when a link is clicked
    navDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navDrawer.classList.remove('is-open');
        navToggle.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navDrawer.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- Reveal-on-scroll using IntersectionObserver ---------- */
  // Tag interesting elements as reveal targets
  const revealSelectors = [
    '.about__copy',
    '.about__card',
    '.service',
    '.process__steps li',
    '.quote',
    '.contact__copy',
    '.contact__form-card',
    '.map__head',
    '.services__head',
    '.process__head',
    '.testimonials__head'
  ];

  const revealTargets = document.querySelectorAll(revealSelectors.join(','));
  revealTargets.forEach((el, i) => {
    el.classList.add('reveal');
    // Stagger siblings in the same parent
    const idx = Array.from(el.parentNode.children).indexOf(el);
    el.style.transitionDelay = `${Math.min(idx, 4) * 90}ms`;
  });

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealTargets.forEach(el => io.observe(el));
  } else {
    // Fallback: just show everything
    revealTargets.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- Smooth scroll for in-page anchors (account for sticky nav) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const navHeight = document.querySelector('.nav')?.offsetHeight || 0;
      const top = target.getBoundingClientRect().top + window.pageYOffset - navHeight + 1;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ---------- Quote form → WhatsApp ---------- */
  const sendBtn = document.getElementById('sendBtn');
  if (sendBtn) {
    const fields = {
      name: document.getElementById('name'),
      phone: document.getElementById('phone'),
      service: document.getElementById('service'),
      message: document.getElementById('message')
    };

    const clearErrors = () => {
      Object.values(fields).forEach(f => f && f.classList.remove('is-error'));
    };

    sendBtn.addEventListener('click', () => {
      clearErrors();

      const name = fields.name.value.trim();
      const phone = fields.phone.value.trim();
      const service = fields.service.value.trim();
      const message = fields.message.value.trim();

      let hasError = false;
      if (!name) { fields.name.classList.add('is-error'); hasError = true; }
      if (!phone) { fields.phone.classList.add('is-error'); hasError = true; }

      if (hasError) {
        fields.name.value ? fields.phone.focus() : fields.name.focus();
        return;
      }

      // Build WhatsApp message
      const lines = [
        `Hi Ransome Tree Felling,`,
        ``,
        `My name is ${name} and I'd like a quote.`,
        phone ? `Phone: ${phone}` : null,
        service ? `Service: ${service}` : null,
        message ? `\nDetails: ${message}` : null,
        ``,
        `Thanks!`
      ].filter(Boolean).join('\n');

      const url = `https://wa.me/27763291972?text=${encodeURIComponent(lines)}`;
      window.open(url, '_blank', 'noopener');

      // Brief confirmation
      const originalText = sendBtn.textContent;
      sendBtn.textContent = 'Opening WhatsApp…';
      sendBtn.disabled = true;
      setTimeout(() => {
        sendBtn.textContent = originalText;
        sendBtn.disabled = false;
      }, 1800);
    });

    // Clear individual field errors on input
    Object.values(fields).forEach(f => {
      if (!f) return;
      f.addEventListener('input', () => f.classList.remove('is-error'));
    });
  }

  /* ---------- Subtle nav shadow on scroll ---------- */
  const nav = document.getElementById('nav');
  if (nav) {
    const onScroll = () => {
      if (window.scrollY > 8) {
        nav.style.boxShadow = '0 2px 14px rgba(15, 42, 24, 0.08)';
      } else {
        nav.style.boxShadow = 'none';
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }
})();