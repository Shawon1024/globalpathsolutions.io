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

// contact form (Formspree-ready; stays helpful in demo)
const form = $('#contactForm');
const status = $('#formStatus');
const ENDPOINT = ''; // e.g. 'https://formspree.io/f/xxxxxx'
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  status.textContent = '';
  if ($('#website').value) return; // honeypot

  const emailOK = /[^\s@]+@[^\s@]+\.[^\s@]+/.test($('#email').value);
  if (!$('#name').value.trim() || !emailOK || $('#message').value.trim().length < 10){
    status.textContent = 'Please complete all fields (message ≥ 10 chars).';
    return;
  }

  if (!ENDPOINT){
    status.textContent = 'Thanks! (Demo mode). Add your Formspree ENDPOINT in js/script.js to enable sending.';
    form.reset();
    return;
  }

  try{
    status.textContent = 'Sending…';
    const rsp = await fetch(ENDPOINT, { method:'POST', headers:{'Accept':'application/json'}, body:new FormData(form) });
    status.textContent = rsp.ok ? 'Thanks! Your message has been sent.' : 'Something went wrong. Please email us directly.';
    if (rsp.ok) form.reset();
  }catch(err){
    status.textContent = 'Network error. Please try again or email us.';
  }
});
