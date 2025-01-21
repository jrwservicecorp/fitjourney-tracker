// JavaScript (v2.51)
const appVersion = "v2.51";

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
  setupThemeToggle();
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
  document.getElementById('log-weight-btn').addEventListener('click', () => {
    const weight = parseFloat(document.getElementById('weight-input').value);
    const bodyFat = parseFloat(document.getElementById('body-fat').value);
    const waist = parseFloat(document.getElementById('waist').value);

    if (isNaN(weight) || weight < 20 || weight > 500) {
      alert('Please enter a valid weight between 20 and 500 lbs.');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const progressData = JSON.parse(localStorage.getItem('progressData')) || [];
    progressData.push({ date: today, weight, bodyFat, waist });
    localStorage.setItem('progressData', JSON.stringify(progressData));
    alert('Entry logged successfully!');
    loadDashboard();
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
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map(entry => entry.date),
      datasets: [{ 
        label: 'Weight (lbs)', 
        data: data.map(entry => entry.weight), 
        borderColor: chartColors.default.line, 
        fill: false 
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: { grid: { color: chartColors.default.grid } },
        y: { grid: { color: chartColors.default.grid } }
      }
    }
  });
}

// Theme Toggle
function setupThemeToggle() {
  document.getElementById('theme-toggle').addEventListener('change', event => {
    document.body.classList.toggle('dark-mode', event.target.checked);
  });
}
