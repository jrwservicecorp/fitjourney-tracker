
const appVersion = "v2.23";

// Function to initialize navigation
function setupNavigation() {
  document.querySelectorAll('.navbar a').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const pageId = link.getAttribute('data-page');
      navigateTo(pageId);
    });
  });
}

// Function to navigate between pages
function navigateTo(pageId) {
  const pages = document.querySelectorAll('.page');
  pages.forEach((page) => page.classList.add('hidden'));
  const targetPage = document.getElementById(pageId);
  if (targetPage) {
    targetPage.classList.remove('hidden');
    highlightActiveLink(pageId);
    updatePageTitle(pageId);
  }
}

// Highlight the active menu link
function highlightActiveLink(pageId) {
  document.querySelectorAll('.navbar a').forEach((link) => {
    link.classList.remove('active');
    if (link.getAttribute('data-page') === pageId) {
      link.classList.add('active');
    }
  });
}

// Update the page title dynamically
function updatePageTitle(pageId) {
  const pageTitle = document.querySelector('.page-title');
  const titles = {
    home: 'Home',
    dashboard: 'Dashboard',
    settings: 'Settings',
    about: 'About FitJourney Tracker',
  };
  pageTitle.textContent = titles[pageId] || 'FitJourney Tracker';
}

// Initialize app
window.onload = () => {
  document.querySelector('header').innerHTML += `<p>App Version: ${appVersion}</p>`;
  setupNavigation();
  navigateTo('home'); // Default to home page on load
};
