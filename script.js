// JavaScript (v2.52)
const appVersion = "v2.52";

const chartColors = {
  default: { line: '#ff6f61', grid: '#cccccc', labels: '#ffffff' },
  dark: { line: '#3498db', grid: '#666666', labels: '#f5f5f5' }
};

// Initialize App
window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('app-version').textContent = appVersion;
  setupNavigation();
  setupLogWeight();
  setupPhotoUpload();
  loadDashboard();
});

// Navigation
function setupNavigation() {
  const links = document.querySelectorAll('.navbar a');
  links.forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      navigateTo(link.getAttribute('data-page'));
    });
  });
}

function navigateTo(pageId) {
  document.querySelectorAll('.page').forEach(page => {
    page.style.display = page.id === pageId ? 'block' : 'none';
  });
  if (pageId === 'dashboard') loadDashboard();
}

// Weight Logging
function setupLogWeight() {
  const logWeightBtn = document.getElementById('log-weight-btn');
  logWeightBtn.addEventListener('click', () => {
    const weight = parseFloat(document.getElementById('weight-input').value);

    if (isNaN(weight) || weight < 20 || weight > 500) {
      alert('Please enter a valid weight between 20 and 500 lbs.');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const progressData = JSON.parse(localStorage.getItem('progressData')) || [];
    progressData.push({ date: today, weight });
    localStorage.setItem('progressData', JSON.stringify(progressData));
    alert('Entry logged successfully!');
    loadDashboard();
  });
}

// Photo Upload
function setupPhotoUpload() {
  const uploadBtn = document.getElementById('upload-photo-btn');
  const photoInput = document.getElementById('photo-upload');

  uploadBtn.addEventListener('click', () => {
    const file = photoInput.files[0];
    if (!file) {
      alert('Please select a photo to upload.');
      return;
    }

    const reader = new FileReader();
    reader.onload = event => {
      const photos = JSON.parse(localStorage.getItem('photos')) || [];
      photos.push({ date: new Date().toISOString().split('T')[0], src: event.target.result });
      localStorage.setItem('photos', JSON.stringify(photos));
      alert('Photo uploaded successfully!');
    };
    reader.readAsDataURL(file);
  });
}

// Dashboard
function loadDashboard() {
  const progressData = JSON.parse(localStorage.getItem('progressData')) || [];
  if (progressData.length > 0) {
    document.getElementById('chart-placeholder').style.display = 'none';
    renderChart(progressData);
  } else {
    document.getElementById('chart-placeholder').style.display = 'block';
  }
}

function renderChart(data) {
  const ctx = document.getElementById('weight-chart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map(entry => entry.date),
      datasets: [{
        label: 'Weight (lbs)',
        data: data.map(entry => entry.weight),
        borderColor: chartColors.default.line,
        fill: false,
      }],
    },
    options: {
      responsive: true,
      scales: {
        x: { grid: { color: chartColors.default.grid } },
        y: { grid: { color: chartColors.default.grid } },
      },
    },
  });
}
