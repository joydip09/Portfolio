/* ═══════════════════════════════════════════════
   PORTFOLIO SCRIPT — Joydip
   Sections:
   1. DOM Selection
   2. Navbar Logic
   3. Typewriter Effect
   4. Scroll Animations (IntersectionObserver)
   5. Skill Bar Animations
   6. Project Filter
   7. Mobile Navigation
   8. Contact Form Validation
   9. Back-to-top
   10. Init
═══════════════════════════════════════════════ */

/* ── 1. DOM Selection ────────────────────────── */
const navbar = document.getElementById("navbar");
const navLinks = document.querySelectorAll(".nav-link");
const hamburger = document.getElementById("hamburger");
const navLinksList = document.querySelector(".nav-links");
const sections = document.querySelectorAll("section[id]");
const revealEls = document.querySelectorAll(".reveal");
const skillFills = document.querySelectorAll(".skill-fill");
const filterBtns = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
const backToTop = document.getElementById("back-to-top");
const typewriterEl = document.getElementById("typewriter");

/* ── 2. Navbar Scroll Behavior ───────────────── */
function handleNavbarScroll() {
  if (window.scrollY > 20) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
}

// Highlight active nav link based on scroll position
function updateActiveLink() {
  let current = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100;
    const sectionBottom = sectionTop + section.offsetHeight;
    if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
}

// Smooth scroll for nav links
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = link.getAttribute("href").slice(1);
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    // Close mobile menu if open
    navLinksList.classList.remove("open");
    hamburger.classList.remove("open");
  });
});

/* ── 3. Typewriter Effect ────────────────────── */
const phrases = ["Frontend Developer", "UI Builder", "JavaScript Enthusiast"];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeDelay = 120;

function runTypewriter() {
  const currentPhrase = phrases[phraseIndex];

  if (isDeleting) {
    typewriterEl.textContent = currentPhrase.slice(0, charIndex - 1);
    charIndex--;
    typeDelay = 60;
  } else {
    typewriterEl.textContent = currentPhrase.slice(0, charIndex + 1);
    charIndex++;
    typeDelay = 120;
  }

  if (!isDeleting && charIndex === currentPhrase.length) {
    isDeleting = true;
    typeDelay = 1800; // pause at end
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    typeDelay = 400;
  }

  setTimeout(runTypewriter, typeDelay);
}

/* ── 4. Scroll Reveal (IntersectionObserver) ── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger delay for sibling items
        const siblings = entry.target.parentElement
          ? [...entry.target.parentElement.querySelectorAll(".reveal")]
          : [];
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${idx * 80}ms`;
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);

revealEls.forEach((el) => revealObserver.observe(el));

/* ── 5. Skill Bar Animations ─────────────────── */
const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const fills = entry.target.querySelectorAll(".skill-fill");
        fills.forEach((fill) => {
          const targetWidth = fill.getAttribute("data-width");
          fill.style.width = targetWidth + "%";
        });
        skillObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 },
);

const skillsSection = document.getElementById("skills");
if (skillsSection) skillObserver.observe(skillsSection);

/* ── 6. Project Filter ───────────────────────── */
filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.getAttribute("data-filter");

    projectCards.forEach((card) => {
      if (filter === "all") {
        card.classList.remove("hidden");
        return;
      }
      const tech = card.getAttribute("data-tech") || "";
      if (tech.includes(filter)) {
        card.classList.remove("hidden");
      } else {
        card.classList.add("hidden");
      }
    });
  });
});

/* ── 7. Mobile Navigation ────────────────────── */
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  navLinksList.classList.toggle("open");
});

// Close menu on outside click
document.addEventListener("click", (e) => {
  if (navLinksList.classList.contains("open") && !navbar.contains(e.target)) {
    navLinksList.classList.remove("open");
    hamburger.classList.remove("open");
  }
});

/* ── 8. Contact Form Validation ──────────────── */
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function clearStatus() {
  formStatus.textContent = "";
  formStatus.className = "form-status";
}

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    clearStatus();

    const nameField = contactForm.querySelector("#name");
    const emailField = contactForm.querySelector("#email");
    const messageField = contactForm.querySelector("#message");

    let hasError = false;

    // Clear previous error states
    [nameField, emailField, messageField].forEach((f) =>
      f.classList.remove("error"),
    );

    if (!nameField.value.trim()) {
      nameField.classList.add("error");
      hasError = true;
    }
    if (!validateEmail(emailField.value.trim())) {
      emailField.classList.add("error");
      hasError = true;
    }
    if (!messageField.value.trim()) {
      messageField.classList.add("error");
      hasError = true;
    }

    if (hasError) {
      formStatus.textContent = "Please fill in all fields correctly.";
      formStatus.classList.add("error-msg");
      return;
    }

    // Simulate success (replace with real submission logic)
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.textContent = "Sending…";
    btn.disabled = true;

    setTimeout(() => {
      contactForm.reset();
      formStatus.textContent = "✓ Message sent! I'll get back to you soon.";
      formStatus.classList.add("success");
      btn.textContent = "Send Message →";
      btn.disabled = false;
      setTimeout(clearStatus, 5000);
    }, 1200);
  });

  // Clear error on input
  contactForm.querySelectorAll("input, textarea").forEach((field) => {
    field.addEventListener("input", () => field.classList.remove("error"));
  });
}

/* ── 9. Back-to-top ──────────────────────────── */
if (backToTop) {
  backToTop.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ── 10. Init ────────────────────────────────── */
function init() {
  // Attach scroll listeners
  window.addEventListener("scroll", handleNavbarScroll, { passive: true });
  window.addEventListener("scroll", updateActiveLink, { passive: true });

  // Run on load
  handleNavbarScroll();
  updateActiveLink();

  // Start typewriter after brief delay
  setTimeout(runTypewriter, 800);
}

document.addEventListener("DOMContentLoaded", init);
