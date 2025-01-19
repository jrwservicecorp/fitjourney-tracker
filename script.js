
const appVersion = "v2.25";

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
    home: 'Home',
    dashboard: 'Dashboard',
    settings: 'Settings',
    about: 'About FitJourney Tracker',
  };
  pageTitle.textContent = titles[pageId] || 'FitJourney Tracker';
}

// Load Dashboard
function loadDashboard() {
  const dashboard = document.getElementById('dashboard');
  if (dashboard) {
    dashboard.innerHTML = `
      <h2>Your Dashboard</h2>
      <div class="card">
        <h3>Log Your Progress</h3>
        <label for="log-weight">Weight (lbs):</label>
        <input type="number" id="log-weight" placeholder="Enter weight">
        <label for="log-date">Date:</label>
        <input type="date" id="log-date">
        <button id="log-progress-btn" class="btn">Log Progress</button>
      </div>
      <div class="card">
        <h3>Photo Upload</h3>
        <label for="upload-photo">Upload Photos:</label>
        <input type="file" id="upload-photo" accept="image/*" multiple>
        <div id="photo-gallery" class="photo-gallery"></div>
      </div>`;

    setupProgressLogging();
    setupPhotoUploads();
    renderPhotoGallery();
  }
}

// Setup Progress Logging
function setupProgressLogging() {
  document.getElementById('log-progress-btn').addEventListener('click', () => {
    const date = document.getElementById('log-date').value;
    const weight = parseFloat(document.getElementById('log-weight').value);
    if (date && !isNaN(weight)) {
      progressData.push({ date, weight });
      localStorage.setItem('progressData', JSON.stringify(progressData));
    } else {
      alert('Please enter valid data!');
    }
  });
}

// Setup Photo Uploads
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
    img.alt = `Photo taken on ${photo.date}`;
    img.classList.add('photo-item');
    gallery.appendChild(img);
  });
}

// Prevent Duplicate Version Display
function displayVersion() {
  const header = document.querySelector('header');
  if (!header.querySelector('.app-version')) {
    const versionElement = document.createElement('p');
    versionElement.classList.add('app-version');
    versionElement.textContent = `App Version: ${appVersion}`;
    header.appendChild(versionElement);
  }
}

// Initialize App
window.onload = () => {
  displayVersion();
  setupNavigation();
  navigateTo('home'); // Default to home page
};
