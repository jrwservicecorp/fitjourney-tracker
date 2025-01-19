
const appVersion = "v2.31";

// Tracker Data
let progressData = JSON.parse(localStorage.getItem('progressData')) || [];
let photoData = JSON.parse(localStorage.getItem('photoData')) || [];

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
  } else {
    console.error(`Page with ID '${pageId}' not found.`);
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

// Load Dashboard with Logging and Photo Upload Functionality
function loadDashboard() {
  const dashboard = document.getElementById('dashboard');
  if (dashboard) {
    dashboard.innerHTML = `
      <div class="dashboard-header">
        <h2>Your Dashboard</h2>
        <p>Track your fitness progress and visualize changes.</p>
      </div>
      <div class="dashboard-cards">
        <div class="card">
          <h3><i class="fas fa-chart-line"></i> Log Your Progress</h3>
          <label for="log-weight">Weight (lbs):</label>
          <input type="number" id="log-weight" placeholder="Enter weight">
          <label for="log-date">Date:</label>
          <input type="date" id="log-date">
          <button id="log-progress-btn" class="btn">Log Progress</button>
        </div>
        <div class="card">
          <h3><i class="fas fa-image"></i> Upload Progress Photos</h3>
          <input type="file" id="upload-photo" accept="image/*" multiple>
          <div id="photo-gallery" class="photo-gallery"></div>
        </div>
        <div class="card">
          <h3><i class="fas fa-ruler"></i> Measurement Changes</h3>
          <button id="add-measurement-btn" class="btn">Add Measurement</button>
          <div id="measurement-list"></div>
        </div>
      </div>`;

    setupProgressLogging();
    setupPhotoUploads();
    setupMeasurementTracking();
    renderPhotoGallery();
  }
}

// Load Settings Page
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
  const currentTheme = localStorage.getItem('theme') || 'light';
  if (currentTheme === 'dark') {
    document.body.classList.add('dark');
  }
}

// Fix Version Display
function displayVersion() {
  const header = document.querySelector('header');
  const existingVersions = header.querySelectorAll('.app-version');
  existingVersions.forEach((el) => el.remove()); // Remove duplicate versions

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
