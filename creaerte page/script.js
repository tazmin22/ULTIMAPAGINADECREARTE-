// Animación al cargar
window.addEventListener("load", () => {
  document.querySelector(".animate-title").style.opacity = "1";
  document.querySelector(".animate-title").style.transform = "translateY(0)";

  document.querySelector(".animate-subtitle").style.opacity = "1";
  document.querySelector(".animate-subtitle").style.transform = "translateY(0)";

  document.querySelector(".animate-btn").style.opacity = "1";
  document.querySelector(".animate-btn").style.transform = "translateY(0)";
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
