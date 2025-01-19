
const appVersion = "v2.24";

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

// Load Dashboard with Tracker Functionality
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
        <h4>Measurements</h4>
        <label for="log-chest">Chest (in):</label>
        <input type="number" id="log-chest" placeholder="Enter chest size">
        <label for="log-waist">Waist (in):</label>
        <input type="number" id="log-waist" placeholder="Enter waist size">
        <button id="log-progress-btn" class="btn">Log Progress</button>
      </div>
      <div class="card">
        <h3>Photo Upload</h3>
        <label for="upload-photo">Upload Photos:</label>
        <input type="file" id="upload-photo" accept="image/*" multiple>
        <div id="photo-gallery" class="photo-gallery"></div>
      </div>
      <div class="card">
        <h3>Progress Entries</h3>
        <table id="progress-table" class="progress-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Weight</th>
              <th>Chest</th>
              <th>Waist</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
      <div class="card">
        <h3>Create Social Post</h3>
        <label for="select-date-range">Select Date Range:</label>
        <input type="date" id="start-date"> to <input type="date" id="end-date">
        <div id="social-preview" class="wysiwyg-editor">
          <p>Drag and drop elements to customize your post.</p>
        </div>
        <button id="share-btn" class="btn">Share to Social Media</button>
      </div>`;

    // Initialize Events
    setupProgressLogging();
    setupPhotoUploads();
    setupSocialSharing();
    renderProgressEntries();
    renderPhotoGallery();
  }
}

// Setup Progress Logging
function setupProgressLogging() {
  document.getElementById('log-progress-btn').addEventListener('click', () => {
    const date = document.getElementById('log-date').value;
    const weight = parseFloat(document.getElementById('log-weight').value);
    const chest = parseFloat(document.getElementById('log-chest').value);
    const waist = parseFloat(document.getElementById('log-waist').value);

    if (date && !isNaN(weight)) {
      progressData.push({ date, weight, chest, waist });
      localStorage.setItem('progressData', JSON.stringify(progressData));
      renderProgressEntries();
    } else {
      alert('Please enter valid data!');
    }
  });
}

// Render Progress Entries
function renderProgressEntries() {
  const tableBody = document.querySelector('#progress-table tbody');
  tableBody.innerHTML = '';
  progressData.forEach((entry) => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${entry.date}</td><td>${entry.weight}</td><td>${entry.chest}</td><td>${entry.waist}</td>`;
    tableBody.appendChild(row);
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

// Setup Social Sharing
function setupSocialSharing() {
  document.getElementById('share-btn').addEventListener('click', () => {
    alert('Social sharing functionality coming soon!');
  });
}

// Initialize App
window.onload = () => {
  document.querySelector('header').innerHTML += `<p>App Version: ${appVersion}</p>`;
  setupNavigation();
  navigateTo('home'); // Default to home page
};
