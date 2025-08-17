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


// Contact form handler
const form = document.getElementById("#contactForm");
const status = document.getElementById("#formStatus");

form.addEventListener("submit", async function(event) {
  event.preventDefault();
  const data = new FormData(form);

  try {
    const response = await fetch(form.action, {
      method: form.method,
      body: data,
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      status.className = "success";
      status.innerHTML = "✅ Thank you! Your message has been sent.";
      status.style.display = "block";
      form.reset();
    } else {
      const errorData = await response.json();
      throw new Error(errorData.error || "Something went wrong.");
    }
  } catch (error) {
    status.className = "error";
    status.innerHTML = "❌ Sorry, there was a problem sending your message.";
    status.style.display = "block";
  }
});




