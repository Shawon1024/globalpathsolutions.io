// utilities
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

// sticky header + mobile nav
const header = $('#header');
const toggle = $('.nav-toggle');
const nav = $('#primary-nav');
toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
});
$$('#primary-nav a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open');
  toggle.setAttribute('aria-expanded','false');
}));

// smooth scrolling with header offset
const offsetScrollTo = (targetId) => {
  const el = document.querySelector(targetId);
  if (!el) return;
  const headerHeight = header.getBoundingClientRect().height;
  const y = el.getBoundingClientRect().top + window.scrollY - (headerHeight + 8);
  window.scrollTo({ top: y, behavior: 'smooth' });
};
$$('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href.length > 1) {
      e.preventDefault();
      offsetScrollTo(href);
    }
  });
});

// reveal on scroll (subtle, no jank)
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.15 });
$$('.reveal').forEach(el => io.observe(el));

// footer year & back-to-top
$('#year').textContent = new Date().getFullYear();
$('.to-top').addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));

// Contact form handler (inline validation + AJAX submit)
(() => {
  const form   = document.getElementById('contactForm');
  if (!form) return;

  const status = document.getElementById('form-status');
  const submitBtn = form.querySelector('button[type="submit"]');
  const honeypot = document.getElementById('website'); // hidden field

  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRx = /^[0-9+()\-.\s]{7,20}$/;

  const showStatus = (msg, type) => {
    status.textContent = msg;
    status.className = type; // sets to "success" or "error"
    status.style.display = 'block';
  };

  const clearCustomErrors = () => {
    ['name', 'email', 'number', '_subject', 'message'].forEach(id => {
      const el = form.querySelector(`[name="${id}"]`) || document.getElementById(id);
      if (el) el.setCustomValidity('');
    });
  };

  const extraChecks = () => {
    clearCustomErrors();
    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const number  = form.number.value.trim();
    const subject = form._subject.value.trim();
    const message = form.message.value.trim();

    if (name.length < 2) {
      form.name.setCustomValidity('Please enter your full name.');
    }
    if (!emailRx.test(email)) {
      form.email.setCustomValidity('Please enter a valid email address.');
    }
    if (!phoneRx.test(number)) {
      form.number.setCustomValidity('Please enter a valid phone number.');
    }
    if (subject.length < 3) {
      form._subject.setCustomValidity('Subject must be at least 3 characters.');
    }
    if (message.length < 10) {
      form.message.setCustomValidity('Please provide a bit more detail (10+ chars).');
    }

    // return validity after custom messages
    return form.checkValidity();
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // block bots
    if (honeypot && honeypot.value.trim() !== '') {
      return; // silently drop
    }

    // HTML5 + custom checks
    if (!extraChecks()) {
      form.reportValidity(); // native tooltip UI
      return;
    }

    // disabled state
    const originalLabel = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      const formData = new FormData(form);

      // If you want to pass the newsletter choice to Formspree:
      // (Already included via checkbox name="subscribe")

      const res = await fetch(form.action, {
        method: form.method || 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData
      });

      if (!res.ok) throw new Error('Network response was not ok');

      // Formspree returns JSON when Accept: application/json is set
      // We don't need the body, just show success and reset.
      showStatus('✅ Thank you! Your message has been sent.', 'success');
      form.reset();
    } catch (err) {
      showStatus('❌ Sorry, there was a problem sending your message. Please try again.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
    }
  });
})();

// Terms & Conditions and Ptivacy Policy
(function () {
    const openClass = 'is-open';
    const bodyLockClass = 'modal-open';
    let lastFocus = null;

    function openModal(id) {
      const modal = document.getElementById(id);
      if (!modal) return;
      lastFocus = document.activeElement;
      modal.classList.add(openClass);
      document.body.style.overflow = 'hidden'; // lock scroll
      const dialog = modal.querySelector('.modal__dialog');
      if (dialog) dialog.focus();
    }

    function closeModal(modal) {
      modal.classList.remove(openClass);
      document.body.style.overflow = ''; // unlock scroll
      if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
    }

    // Open via footer links
    document.querySelectorAll('[data-modal-target]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const id = link.getAttribute('data-modal-target');
        openModal(id);
      });
    });

    // Close via overlay or X
    document.querySelectorAll('.modal [data-close-modal]').forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = btn.closest('.modal');
        if (modal) closeModal(modal);
      });
    });

    // Close on Esc
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal.is-open').forEach(m => closeModal(m));
      }
    });

    // Close when clicking overlay background (but not dialog)
    document.querySelectorAll('.modal').forEach(modal => {
      const overlay = modal.querySelector('.modal__overlay');
      overlay && overlay.addEventListener('click', () => closeModal(modal));
    });
  })();

  window.addEventListener('DOMContentLoaded', () => {
  const globeEl = document.querySelector('.hero-globe');
  const twinkle = document.querySelector('.hero-twinkle');
  let vGlobe;

  // --- Rotating globe (unchanged look) ---
  if (globeEl && window.VANTA && VANTA.GLOBE) {
    vGlobe = VANTA.GLOBE({
      el: globeEl,
      mouseControls: true,
      touchControls: true,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 1.00,
      color: 0x3bb6d1,
      backgroundColor: 0x000000, // keep solid background; we don't touch backgroundAlpha
      size: 1.15,
    });
  }

  // --- Twinkling star overlay (animated canvas) ---
if (twinkle) {
  const ctx = twinkle.getContext('2d', { alpha: true });
  let w = 0, h = 0, dpr = 1, stars = [], rafId = 0;

  const RND = (a, b) => Math.random() * (b - a) + a;

  function makeStars(count) {
    return Array.from({ length: count }, () => ({
      x: RND(0, w),
      y: RND(0, h),
      r: RND(0.6, 1.8),
      base: RND(0.25, 0.55),
      amp: RND(0.18, 0.38),
      spd: RND(0.012, 0.028),
      ph: RND(0, Math.PI * 2),
      bluish: Math.random() < 0.25
    }));
  }

  function resizeToHero() {
    const hero = twinkle.closest('.hero');
    if (!hero) return;
    const rect = hero.getBoundingClientRect();

    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = Math.max(1, Math.floor(rect.width));
    h = Math.max(1, Math.floor(rect.height));

    // canvas pixel size
    twinkle.width  = w * dpr;
    twinkle.height = h * dpr;

    // canvas CSS size (we still keep absolute/inset:0 in CSS)
    twinkle.style.width  = w + 'px';
    twinkle.style.height = h + 'px';

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.round(Math.min(180, Math.max(70, (w * h) / 18000)));
    stars = makeStars(count);
  }

  function frame() {
    ctx.clearRect(0, 0, w, h);
    for (const s of stars) {
      s.ph += s.spd;
      const a = s.base + Math.sin(s.ph) * s.amp; // 0..1
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${s.bluish ? '191,220,255' : '255,255,255'},${Math.max(0, Math.min(1, a)).toFixed(2)})`;
      ctx.fill();
    }
    rafId = requestAnimationFrame(frame);
  }

  // keep size correct across browser UI changes (esp. mobile address bar)
  const ro = new ResizeObserver(resizeToHero);
  ro.observe(twinkle.closest('.hero'));

  // first paint
  resizeToHero();
  rafId = requestAnimationFrame(frame);

  window.addEventListener('beforeunload', () => {
    try { ro.disconnect(); } catch(e) {}
    try { cancelAnimationFrame(rafId); } catch(e) {}
  }, { passive: true });
}

  window.addEventListener('beforeunload', () => {
    try { vGlobe && vGlobe.destroy(); } catch(e){}
  });
});
