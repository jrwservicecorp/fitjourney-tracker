
const appVersion = "v2.35";

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
    if (pageId === 'dashboard') loadDashboard();
  }
}

// Load Dashboard
function loadDashboard() {
  const dashboard = document.getElementById('dashboard');
  dashboard.innerHTML = `
    <div class="dashboard-header">
      <h2>Your Dashboard</h2>
      <p>Track your progress and visualize your journey.</p>
    </div>
    <div class="dashboard-content">
      <div class="chart-section">
        <h3>Weight Progress</h3>
        <label for="date-range-start">Start Date:</label>
        <input type="date" id="date-range-start">
        <label for="date-range-end">End Date:</label>
        <input type="date" id="date-range-end">
        <button id="filter-chart-btn" class="btn">Filter</button>
        <canvas id="weight-chart" width="400" height="200"></canvas>
      </div>
      <div class="gallery-section">
        <h3>Photo Gallery</h3>
        <div id="photo-gallery" class="photo-gallery"></div>
      </div>
    </div>`;

  setupChart();
  setupPhotoGallery();
}

// Setup Weight Chart
function setupChart() {
  const ctx = document.getElementById('weight-chart').getContext('2d');
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: progressData.map(entry => entry.date),
      datasets: [{
        label: 'Weight Progress',
        data: progressData.map(entry => entry.weight),
        borderColor: '#3498db',
        fill: false,
        borderWidth: 2,
      }],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true },
      },
    },
  });

  document.getElementById('filter-chart-btn').addEventListener('click', () => {
    const startDate = document.getElementById('date-range-start').value;
    const endDate = document.getElementById('date-range-end').value;
    const filteredData = progressData.filter(entry => {
      return (!startDate || entry.date >= startDate) && (!endDate || entry.date <= endDate);
    });
    chart.data.labels = filteredData.map(entry => entry.date);
    chart.data.datasets[0].data = filteredData.map(entry => entry.weight);
    chart.update();
  });
}

// Setup Photo Gallery
function setupPhotoGallery() {
  const gallery = document.getElementById('photo-gallery');
  gallery.innerHTML = '';
  photoData.forEach(photo => {
    const img = document.createElement('img');
    img.src = photo.url;
    img.alt = `Photo from ${photo.date}`;
    img.classList.add('photo-item');
    img.addEventListener('click', () => enlargePhoto(photo));
    gallery.appendChild(img);
  });
}

// Enlarge Photo
function enlargePhoto(photo) {
  const modal = document.createElement('div');
  modal.classList.add('modal');
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-btn">&times;</span>
      <img src="${photo.url}" alt="Photo from ${photo.date}" class="enlarged-photo">
      <p>Date: ${photo.date}</p>
    </div>`;
  document.body.appendChild(modal);

  modal.querySelector('.close-btn').addEventListener('click', () => {
    modal.remove();
  });
}

// Initialize App
window.onload = () => {
  setupNavigation();
  navigateTo('home');
};
