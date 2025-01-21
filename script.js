// JavaScript (v2.55)
const appVersion = "v2.55";

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("app-version").textContent = appVersion;
  setupNavigation();
  setupLogWeight();
  setupPhotoUpload();
  loadDashboard();
  setupCollapsibleSections();
  setupThemeToggle();
});

function setupNavigation() {
  const links = document.querySelectorAll(".navbar a");
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      navigateTo(link.getAttribute("data-page"));
    });
  });
}

function navigateTo(pageId) {
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.toggle("hidden", page.id !== pageId);
  });
}

function loadDashboard() {
  // Chart rendering and summary stats logic
}

function setupLogWeight() {
  document.getElementById("log-weight-btn").addEventListener("click", () => {
    // Weight logging logic
  });
}

function setupPhotoUpload() {
  document.getElementById("upload-photo-btn").addEventListener("click", () => {
    // Photo upload logic
  });
}

function setupCollapsibleSections() {
  document.querySelectorAll(".toggle-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const content = btn.nextElementSibling;
      content.classList.toggle("open");
    });
  });
}

function setupThemeToggle() {
  const btn = document.getElementById("theme-toggle-btn");
  btn.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
  });
}
