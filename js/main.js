(() => {
  "use strict";

  function initMobileMenu() {
    const toggle = document.querySelector(".menu-toggle");
    const panel = document.querySelector(".mobile-panel");
    if (!toggle || !panel) return;

    const setMenu = (open) => {
      panel.classList.toggle("open", open);
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    };

    // Evita dobles manejadores si el script se inicializa otra vez.
    if (toggle.dataset.menuReady === "true") return;
    toggle.dataset.menuReady = "true";

    toggle.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      setMenu(!panel.classList.contains("open"));
    });

    panel.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setMenu(false));
    });

    document.addEventListener("click", (event) => {
      if (panel.classList.contains("open") &&
          !panel.contains(event.target) &&
          !toggle.contains(event.target)) {
        setMenu(false);
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setMenu(false);
    });

    // Si se vuelve a escritorio, deja el estado limpio.
    window.addEventListener("resize", () => {
      if (window.innerWidth > 1050) setMenu(false);
    });
  }

  function initPageFeatures() {
    initMobileMenu();

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    } else {
      document.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
    }

    const form = document.getElementById("quoteForm");
    if (form) {
      form.addEventListener("submit", async (e) => {
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
          message.innerHTML = "✓ Solicitud copiada. Puedes pegarla en WhatsApp o usar <strong>Enviar por correo</strong> para enviarla a <a href=\"mailto:totaingenieridelnorte@outlook.com\">totaingenieridelnorte@outlook.com</a>.";
        } catch {
          message.innerHTML = "Solicitud generada. Tu navegador no permitió copiar automáticamente; puedes copiarla manualmente o usar <strong>Enviar por correo</strong>.";
        }
        if (emailButton) {
          emailButton.disabled = false;
          emailButton.dataset.request = request;
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
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPageFeatures, { once: true });
  } else {
    initPageFeatures();
  }
})();
