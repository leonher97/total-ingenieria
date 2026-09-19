
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".menu-toggle");
  const panel = document.querySelector(".mobile-panel");
  if (toggle && panel) {
    const close = () => {
      panel.classList.remove("open");
      toggle.setAttribute("aria-expanded","false");
      toggle.setAttribute("aria-label","Abrir menú");
      toggle.classList.remove("open");
    };
    // El botón también tiene un fallback inline para que funcione aunque main.js tarde en cargar.
    panel.querySelectorAll("a").forEach(a => a.addEventListener("click", close));
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, {threshold:.12});
  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

  const form = document.getElementById("quoteForm");
  if (form) {
    form.addEventListener("submit", async e => {
      e.preventDefault();
      const data = new FormData(form);
      const request = [
        "SOLICITUD DE COTIZACIÓN",
        "TOTAL INGENIERÍA DEL NORTE",
        "",
        `Nombre: ${data.get("nombre") || ""}`,
        `Teléfono: ${data.get("telefono") || ""}`,
        `Servicio: ${data.get("servicio") || ""}`,
        "",
        "Detalles del trabajo:",
        `${data.get("detalles") || ""}`
      ].join("\n");
      const message = document.getElementById("formMessage");
      const emailButton = document.getElementById("emailQuote");
      try {
        await navigator.clipboard.writeText(request);
        message.innerHTML = "✓ Solicitud copiada. Puedes pegarla en WhatsApp o usar <strong>Enviar por correo</strong> para enviarla a <a href="mailto:totaingenieridelnorte@outlook.com">totaingenieridelnorte@outlook.com</a>.";
        if (emailButton) { emailButton.disabled = false; emailButton.dataset.request = request; }
      } catch {
        message.innerHTML = "Solicitud generada. Tu navegador no permitió copiar automáticamente; puedes copiarla manualmente o usar <strong>Enviar por correo</strong>.";
        if (emailButton) { emailButton.disabled = false; emailButton.dataset.request = request; }
      }
    });
    const emailButton = document.getElementById("emailQuote");
    if (emailButton) {
      emailButton.addEventListener("click", () => {
        const request = emailButton.dataset.request || "SOLICITUD DE COTIZACIÓN\nTOTAL INGENIERÍA DEL NORTE";
        const subject = "Solicitud de cotización - Total Ingeniería del Norte";
        window.location.href = `mailto:totaingenieridelnorte@outlook.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(request)}`;
      });
    }
  }
});
