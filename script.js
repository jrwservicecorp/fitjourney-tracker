
const appVersion = "v2.22";

document.getElementById('guest-btn').addEventListener('click', () => {
  document.getElementById('landing-page').classList.add('hidden');
  document.getElementById('main-app').classList.remove('hidden');
  navigateTo('home');
});

document.getElementById('login-btn').addEventListener('click', () => {
  document.getElementById('landing-page').classList.add('hidden');
  document.getElementById('main-app').classList.remove('hidden');
  navigateTo('home');
});

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
  const links = document.querySelectorAll('.navbar a');
  links.forEach((link) => link.classList.remove('active'));
  const activeLink = document.querySelector(`[data-page="${pageId}"]`);
  if (activeLink) activeLink.classList.add('active');
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
  navigateTo('home');
};
