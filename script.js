
const appVersion = "v2.26";

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
        <h3>Progress Charts</h3>
        <canvas id="weight-chart" width="400" height="200"></canvas>
        <canvas id="measurements-chart" width="400" height="200"></canvas>
      </div>
      <div class="card">
        <h3>Customize Your Dashboard</h3>
        <p>Drag and drop widgets to rearrange your dashboard layout.</p>
        <div class="dashboard-widgets" id="dashboard-widgets">
          <div class="widget" draggable="true">Weight Progress</div>
          <div class="widget" draggable="true">Measurement Changes</div>
          <div class="widget" draggable="true">Milestones</div>
        </div>
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

    renderCharts();
    setupDashboardCustomization();
    setupSocialSharing();
  }
}

// Render Progress Charts
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
        borderWidth: 2,
        fill: false,
      }],
    },
    options: {
      responsive: true,
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
    },
  });
}

// Setup Dashboard Customization
function setupDashboardCustomization() {
  const widgets = document.querySelectorAll('.widget');
  widgets.forEach((widget) => {
    widget.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', widget.id);
    });
  });
  const dashboard = document.getElementById('dashboard-widgets');
  dashboard.addEventListener('dragover', (e) => {
    e.preventDefault();
  });
  dashboard.addEventListener('drop', (e) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    const draggedWidget = document.getElementById(id);
    dashboard.appendChild(draggedWidget);
  });
}

// Setup Social Sharing
function setupSocialSharing() {
  document.getElementById('share-btn').addEventListener('click', () => {
    alert('Social sharing functionality coming soon!');
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
