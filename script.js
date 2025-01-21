const appVersion = "v2.40";

// Initialize App
window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('app-version').textContent = appVersion;
  setupNavigation();
  setupLogWeight();
  navigateTo('home');
});

// Setup Navigation
function setupNavigation() {
  const links = document.querySelectorAll('.navbar a');
  links.forEach((link) => {
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
  pages.forEach(page => page.classList.add('hidden')); // Hide all pages
  const targetPage = document.getElementById(pageId);
  if (targetPage) {
    targetPage.classList.remove('hidden'); // Show the selected page
    if (pageId === 'dashboard') loadDashboard();
  } else {
    console.error(`Page "${pageId}" not found.`);
  }
}

// Setup Log Weight Functionality
function setupLogWeight() {
  const logWeightBtn = document.getElementById('log-weight-btn');
  const weightInput = document.getElementById('weight-input');
  logWeightBtn.addEventListener('click', () => {
    const weight = parseFloat(weightInput.value);
    if (isNaN(weight) || weight < 20 || weight > 500) {
      alert('Please enter a valid weight between 20 and 500 lbs.');
      return;
    }
    const today = new Date().toISOString().split('T')[0];
    const progressData = JSON.parse(localStorage.getItem('progressData')) || [];
    progressData.push({ date: today, weight });
    localStorage.setItem('progressData', JSON.stringify(progressData));
    alert('Weight logged successfully!');
    weightInput.value = ''; // Clear input
  });
}

// Load Dashboard with Chart
function loadDashboard() {
  if (typeof Chart === 'undefined') {
    console.error('Chart.js is not loaded. Ensure the library is included in index.html.');
    return;
  }

  const progressData = JSON.parse(localStorage.getItem('progressData')) || [];
  const chartContainer = document.getElementById('weight-chart-container');
  if (progressData.length === 0) {
    chartContainer.innerHTML = '<p>No data available. Log your weight to get started!</p>';
  } else {
    chartContainer.innerHTML = '<canvas id="weight-chart"></canvas>';
    const ctx = document.getElementById('weight-chart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: progressData.map(entry => entry.date),
        datasets: [{
          label: 'Weight Progress',
          data: progressData.map(entry => entry.weight),
          borderColor: '#3498db',
          fill: false,
        }],
      },
    });
  }
}
