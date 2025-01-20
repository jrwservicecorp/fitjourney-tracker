
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
        <div id="weight-chart-container"></div>
      </div>
    </div>`;

  setupChart();
}

// Setup Weight Chart
function setupChart() {
  const container = document.getElementById('weight-chart-container');
  if (progressData.length === 0) {
    container.innerHTML = `
      <div class="placeholder">
        <h4>Your Weight Journey Awaits</h4>
        <p>Log your first weight entry to begin tracking your progress.</p>
        <button id="add-first-entry" class="btn">Log First Entry</button>
      </div>`;

    document.getElementById('add-first-entry').addEventListener('click', () => {
      const today = new Date().toISOString().split('T')[0];
      const weight = prompt("Enter your weight to start tracking:");
      if (weight) {
        progressData.push({ date: today, weight: parseFloat(weight) });
        localStorage.setItem('progressData', JSON.stringify(progressData));
        setupChart();
      }
    });
  } else {
    const canvas = document.createElement('canvas');
    canvas.id = "weight-chart";
    container.innerHTML = "";
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
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
  }
}

// Initialize App
window.onload = () => {
  setupNavigation();
  navigateTo('home');
};
