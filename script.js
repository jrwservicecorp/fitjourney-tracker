
const appVersion = "v2.30";

// Tracker Data
let progressData = JSON.parse(localStorage.getItem('progressData')) || [];
let photoData = JSON.parse(localStorage.getItem('photoData')) || [];

// Theme Preference
let theme = localStorage.getItem('theme') || 'light';

// Initialize Navigation
function setupNavigation() {
  document.querySelectorAll('.navbar a').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const pageId = link.getAttribute('data-page');
      navigateTo(pageId);
    });
  });
}

// Navigate Between Pages
function navigateTo(pageId) {
  const pages = document.querySelectorAll('.page');
  pages.forEach((page) => page.classList.add('hidden'));
  const targetPage = document.getElementById(pageId);
  if (targetPage) {
    targetPage.classList.remove('hidden');
    highlightActiveLink(pageId);
    updatePageTitle(pageId);
    if (pageId === 'dashboard') loadDashboard();
    if (pageId === 'settings') loadSettings();
  }
}

// Highlight Active Menu Link
function highlightActiveLink(pageId) {
  document.querySelectorAll('.navbar a').forEach((link) => {
    link.classList.remove('active');
    if (link.getAttribute('data-page') === pageId) {
      link.classList.add('active');
    }
  });
}

// Update Page Title
function updatePageTitle(pageId) {
  const pageTitle = document.querySelector('.page-title');
  const titles = {
    home: 'Welcome to FitJourney Tracker',
    dashboard: 'Your Dashboard',
    settings: 'Settings',
    about: 'About FitJourney Tracker',
  };
  pageTitle.textContent = titles[pageId] || 'FitJourney Tracker';
}

// Load Dashboard with Updated Layout
function loadDashboard() {
  const dashboard = document.getElementById('dashboard');
  if (dashboard) {
    dashboard.innerHTML = `
      <div class="dashboard-header">
        <h2>Your Dashboard</h2>
        <p>Track your fitness progress and achievements.</p>
      </div>
      <div class="dashboard-cards">
        <div class="card">
          <h3><i class="fas fa-chart-line"></i> Weight Progress</h3>
          <canvas id="weight-chart" width="300" height="200"></canvas>
        </div>
        <div class="card">
          <h3><i class="fas fa-ruler-combined"></i> Measurement Changes</h3>
          <canvas id="measurements-chart" width="300" height="200"></canvas>
        </div>
        <div class="card">
          <h3><i class="fas fa-bullseye"></i> Milestones</h3>
          <ul>
            <li>10 lbs lost milestone achieved!</li>
            <li>Current streak: <span id="current-streak">5 days</span></li>
          </ul>
        </div>
      </div>`;

    renderCharts();
  }
}

// Render Enhanced Charts
function renderCharts() {
  const weightCtx = document.getElementById('weight-chart').getContext('2d');
  const measurementsCtx = document.getElementById('measurements-chart').getContext('2d');

  // Weight Chart
  const dates = progressData.map(entry => entry.date);
  const weights = progressData.map(entry => entry.weight);
  new Chart(weightCtx, {
    type: 'line',
    data: {
      labels: dates,
      datasets: [{
        label: 'Weight Progress',
        data: weights,
        borderColor: '#1a73e8',
        backgroundColor: 'rgba(26, 115, 232, 0.1)',
        borderWidth: 2,
        fill: true,
      }],
    },
    options: {
      responsive: true,
      plugins: {
        tooltip: { enabled: true },
      },
    },
  });

  // Measurements Chart
  const chests = progressData.map(entry => entry.chest);
  const waists = progressData.map(entry => entry.waist);
  new Chart(measurementsCtx, {
    type: 'bar',
    data: {
      labels: dates,
      datasets: [
        { label: 'Chest', data: chests, backgroundColor: '#3498db' },
        { label: 'Waist', data: waists, backgroundColor: '#e74c3c' },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        tooltip: { enabled: true },
      },
    },
  });
}

// Load Settings Page with Light/Dark Theme
function loadSettings() {
  const settings = document.getElementById('settings');
  settings.innerHTML = `
    <div class="settings-header">
      <h2>Settings</h2>
      <p>Customize your preferences.</p>
    </div>
    <div class="settings-options">
      <h3>Theme Customization</h3>
      <button id="light-mode" class="btn">Light Mode</button>
      <button id="dark-mode" class="btn">Dark Mode</button>
    </div>`;

  document.getElementById('light-mode').addEventListener('click', () => {
    document.body.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  });

  document.getElementById('dark-mode').addEventListener('click', () => {
    document.body.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  });

  // Apply saved theme
  if (theme === 'dark') {
    document.body.classList.add('dark');
  }
}

// Fix Version Display
function displayVersion() {
  const header = document.querySelector('header');
  const existingVersions = header.querySelectorAll('.app-version');
  existingVersions.forEach((el) => el.remove()); // Remove any existing version elements

  const versionElement = document.createElement('p');
  versionElement.classList.add('app-version');
  versionElement.textContent = `App Version: ${appVersion}`;
  header.appendChild(versionElement);
}

// Initialize App
window.onload = () => {
  displayVersion();
  setupNavigation();
  navigateTo('home'); // Default to home page
};
