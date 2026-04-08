// Animación al cargar
window.addEventListener("load", () => {
  const title = document.querySelector(".animate-title");
  if (title) {
    title.style.opacity = "1";
    title.style.transform = "translateY(0)";
  }

  const subtitle = document.querySelector(".animate-subtitle");
  if (subtitle) {
    subtitle.style.opacity = "1";
    subtitle.style.transform = "translateY(0)";
  }

  const button = document.querySelector(".animate-btn");
  if (button) {
    button.style.opacity = "1";
    button.style.transform = "translateY(0)";
  }
});

// Animación al hacer scroll (para las cards)
const cards = document.querySelectorAll(".animate-card");

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, { threshold: 0.2 });

cards.forEach(card => observer.observe(card));

// --- MOBILE MENU LOGO & TOGGLE ---
document.addEventListener('DOMContentLoaded', () => {
  const burger = document.querySelector('.mobile-nav-toggle');
  const menu = document.querySelector('.mobile-menu');
  const links = document.querySelectorAll('.mobile-menu-links a');

  if (burger && menu) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('active');
      menu.classList.toggle('active');
      document.body.classList.toggle('no-scroll'); // Prevent scroll when menu is open
    });

    // Close menu when a link is clicked
    links.forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('active');
        menu.classList.remove('active');
        document.body.classList.remove('no-scroll');
      });
    });
  }
});

// Scroll Listener for Navbar (White background on scroll)
window.addEventListener('scroll', () => {
  const nav = document.querySelector('.t-nav');
  if (nav && window.pageYOffset > 50) {
    nav.classList.add('scrolled');
  } else if (nav) {
    nav.classList.remove('scrolled');
  }
});

// Global subtle page jump control: one arrow that switches between top and bottom.
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.page-scroll-toggle')) return;

  const arrowSvg = `
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
    </svg>
  `;

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'page-scroll-toggle';
  toggle.setAttribute('aria-label', 'Ir al final');
  toggle.innerHTML = `<span class="page-scroll-toggle-icon">${arrowSvg}</span>`;

  const updateToggle = () => {
    const doc = document.documentElement;
    const maxScroll = Math.max(doc.scrollHeight - window.innerHeight, 0);

    const scrollY = window.pageYOffset || doc.scrollTop || 0;
    const goUp = scrollY > maxScroll * 0.55;
    toggle.classList.toggle('is-up', goUp);
    toggle.setAttribute('aria-label', goUp ? 'Volver al inicio' : 'Ir al final');
    toggle.title = goUp ? 'Volver al inicio' : 'Ir al final';
  };

  toggle.addEventListener('click', () => {
    const doc = document.documentElement;
    const maxScroll = Math.max(doc.scrollHeight - window.innerHeight, 0);
    const goUp = toggle.classList.contains('is-up');

    window.scrollTo({
      top: goUp ? 0 : maxScroll,
      behavior: 'smooth'
    });
  });

  (document.documentElement || document.body).appendChild(toggle);
  window.addEventListener('scroll', updateToggle, { passive: true });
  window.addEventListener('resize', updateToggle);
  updateToggle();
});
