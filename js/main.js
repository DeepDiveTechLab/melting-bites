// Animación de scroll suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth"
    });
  });
});

// Formulario de contacto
document.querySelector(".contact-form").addEventListener("submit", e => {
  e.preventDefault();
  alert("¡Gracias por tu mensaje! Nos pondremos en contacto pronto.");
});
