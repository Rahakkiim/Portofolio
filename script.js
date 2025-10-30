// Initialize AOS
AOS.init({
  duration: 1000,
  once: false,
  mirror: true,
  offset: 50,
});

// Language System
let currentLang = "en";

function switchLanguage(lang) {
  currentLang = lang;

  // Hide all content first
  document.querySelectorAll(".lang-content").forEach((el) => {
    el.classList.remove("active");
  });

  // Show content for selected language
  document.querySelectorAll(`.lang-content[data-${lang}]`).forEach((el) => {
    el.classList.add("active");
    const text = el.getAttribute(`data-${lang}`);
    if (text) {
      el.textContent = text;
    }
  });

  // Update form placeholders
  updateFormPlaceholders(lang);

  // Update language buttons
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.remove("active");
    if (btn.getAttribute("data-lang") === lang) {
      btn.classList.add("active");
    }
  });

  // Save to localStorage
  localStorage.setItem("preferred-language", lang);
}

function updateFormPlaceholders(lang) {
  const nameInput = document.querySelector('input[name="name"]');
  const emailInput = document.querySelector('input[name="email"]');
  const messageInput = document.querySelector('textarea[name="message"]');

  if (nameInput)
    nameInput.placeholder = nameInput.getAttribute(`data-${lang}-placeholder`);
  if (emailInput)
    emailInput.placeholder = emailInput.getAttribute(
      `data-${lang}-placeholder`
    );
  if (messageInput)
    messageInput.placeholder = messageInput.getAttribute(
      `data-${lang}-placeholder`
    );
}

// Initialize language system
document.addEventListener("DOMContentLoaded", function () {
  // Load saved language preference
  const savedLang = localStorage.getItem("preferred-language") || "en";
  switchLanguage(savedLang);

  // Add event listeners to language buttons
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const lang = this.getAttribute("data-lang");
      switchLanguage(lang);
    });
  });
});

// Auto update year
document.getElementById("year").textContent = new Date().getFullYear();

// Navbar scroll effect
window.addEventListener("scroll", function () {
  const navbar = document.getElementById("navbar");
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// Dark mode toggle
const darkToggle = document.getElementById("darkToggle");
const darkToggleMobile = document.getElementById("darkToggleMobile");
const body = document.body;

function applyTheme(theme) {
  if (theme === "dark") {
    body.classList.add("dark");
    darkToggle.textContent = "☀️";
    if (darkToggleMobile) darkToggleMobile.textContent = "☀️";
  } else {
    body.classList.remove("dark");
    darkToggle.textContent = "🌙";
    if (darkToggleMobile) darkToggleMobile.textContent = "🌙";
  }
}

// Load saved theme
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  applyTheme(savedTheme);
} else {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(prefersDark ? "dark" : "light");
}

// Theme toggle event
function toggleTheme() {
  if (body.classList.contains("dark")) {
    applyTheme("light");
    localStorage.setItem("theme", "light");
  } else {
    applyTheme("dark");
    localStorage.setItem("theme", "dark");
  }
}

darkToggle.addEventListener("click", toggleTheme);
if (darkToggleMobile) {
  darkToggleMobile.addEventListener("click", toggleTheme);
}

// Mobile menu toggle
const mobileMenu = document.getElementById("mobileMenu");
const mobileNav = document.getElementById("mobileNav");
const mobileNavClose = document.getElementById("mobileNavClose");
let isMenuOpen = false;

function toggleMobileMenu() {
  isMenuOpen = !isMenuOpen;
  mobileNav.classList.toggle("active", isMenuOpen);

  // Change hamburger icon
  const icon = mobileMenu.querySelector("i");
  if (isMenuOpen) {
    icon.className = "fas fa-times";
  } else {
    icon.className = "fas fa-bars";
  }

  // Prevent body scroll when menu is open
  document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
}

mobileMenu.addEventListener("click", toggleMobileMenu);
mobileNavClose.addEventListener("click", toggleMobileMenu);

// Close mobile menu when clicking on links
document.querySelectorAll(".mobile-nav a").forEach((link) => {
  link.addEventListener("click", function () {
    isMenuOpen = false;
    mobileNav.classList.remove("active");
    mobileMenu.querySelector("i").className = "fas fa-bars";
    document.body.style.overflow = "auto";
  });
});

// Close mobile menu when clicking outside
document.addEventListener("click", function (event) {
  if (
    !mobileNav.contains(event.target) &&
    !mobileMenu.contains(event.target) &&
    isMenuOpen
  ) {
    isMenuOpen = false;
    mobileNav.classList.remove("active");
    mobileMenu.querySelector("i").className = "fas fa-bars";
    document.body.style.overflow = "auto";
  }
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      const offsetTop = target.offsetTop - 80; // Account for fixed navbar
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  });
});

// CV Modal functions
function openCV() {
  document.getElementById("cvModal").style.display = "block";
  document.body.style.overflow = "hidden";
}

function closeCV() {
  document.getElementById("cvModal").style.display = "none";
  document.body.style.overflow = "auto";
}

// Close modal when clicking outside
window.addEventListener("click", function (event) {
  const modal = document.getElementById("cvModal");
  if (event.target === modal) {
    closeCV();
  }
});

// Close modal with ESC key
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeCV();
  }
});

// Form submission handling
const contactForm = document.querySelector(".contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    const submitBtn = this.querySelector(".form-submit");
    const originalText = submitBtn.innerHTML;
    const loadingText =
      currentLang === "en"
        ? '<i class="fas fa-spinner fa-spin"></i> Sending...'
        : '<i class="fas fa-spinner fa-spin"></i> Mengirim...';

    submitBtn.innerHTML = loadingText;
    submitBtn.disabled = true;

    // Reset after form submission
    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }, 3000);
  });
}

// Swiper without auto-slide (for project detail page)
if (document.querySelector(".myImageSwiper")) {
  var swiper = new Swiper(".myImageSwiper", {
    loop: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    // PERBAIKAN: Konfigurasi untuk gambar yang lebih baik
    slidesPerView: 1,
    spaceBetween: 0,
    centeredSlides: true,
    effect: "slide",
    speed: 500,
  });
}

// Fullscreen Function (for project detail page)
function openFullscreen(imgElement) {
  document.getElementById("fullscreenModal").style.display = "flex";
  document.getElementById("fullscreenImg").src = imgElement.src;
}

function closeFullscreen() {
  document.getElementById("fullscreenModal").style.display = "none";
}

// Close modal with ESC key for fullscreen images
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeFullscreen();
  }
});

// PERBAIKAN: Pastikan gambar di mobile tidak overflow
function checkMobileLayout() {
  if (window.innerWidth <= 768) {
    document.body.style.overflowX = "hidden";
  }
}

window.addEventListener("resize", checkMobileLayout);
window.addEventListener("load", checkMobileLayout);

// Responsive iframe handling
function makeIframeResponsive() {
  const iframe = document.querySelector(".cv-frame");
  if (iframe && window.innerWidth <= 768) {
    iframe.style.height = Math.max(window.innerHeight * 0.6, 300) + "px";
  }
}

window.addEventListener("resize", makeIframeResponsive);
window.addEventListener("orientationchange", function () {
  setTimeout(makeIframeResponsive, 500);
});

// Preload critical images
function preloadImages() {
  const criticalImages = [
    "https://i.ibb.co/7YVTtBQ/avatar.png",
    "img/Sispak.jpg",
    "img/dta.jpg",
  ];

  criticalImages.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
}

// Initialize preloading
preloadImages();
