
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

// Set Up Progress Logging
function setupProgressLogging() {
  document.getElementById('log-progress-btn').addEventListener('click', () => {
    const weight = parseFloat(document.getElementById('log-weight').value);
    const date = document.getElementById('log-date').value;

    if (weight && date) {
      progressData.push({ weight, date });
      localStorage.setItem('progressData', JSON.stringify(progressData));
      alert('Progress logged successfully!');
    } else {
      alert('Please fill out all fields.');
    }
  });
}

// Set Up Photo Uploads
function setupPhotoUploads() {
  document.getElementById('upload-photo').addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        photoData.push({ url: event.target.result, date: new Date().toISOString().split('T')[0] });
        localStorage.setItem('photoData', JSON.stringify(photoData));
        renderPhotoGallery();
      };
      reader.readAsDataURL(file);
    });
  });
}

// Render Photo Gallery
function renderPhotoGallery() {
  const gallery = document.getElementById('photo-gallery');
  gallery.innerHTML = '';
  photoData.forEach((photo) => {
    const img = document.createElement('img');
    img.src = photo.url;
    img.alt = `Photo from ${photo.date}`;
    img.classList.add('photo-item');
    gallery.appendChild(img);
  });
}

// Set Up Measurement Tracking
function setupMeasurementTracking() {
  const measurementList = document.getElementById('measurement-list');
  document.getElementById('add-measurement-btn').addEventListener('click', () => {
    const measurement = prompt('Enter measurement name (e.g., Chest, Waist):');
    if (measurement) {
      const input = document.createElement('div');
      input.innerHTML = `
        <label for="${measurement}">${measurement} (inches):</label>
        <input type="number" id="${measurement}" placeholder="Enter ${measurement} measurement">`;
      measurementList.appendChild(input);
    }
  });
}

// Prevent Duplicate Version Display
function displayVersion() {
  const header = document.querySelector('header');
  const existingVersions = header.querySelectorAll('.app-version');
  existingVersions.forEach((el) => el.remove());

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
