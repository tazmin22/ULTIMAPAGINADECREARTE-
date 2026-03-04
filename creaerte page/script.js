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
