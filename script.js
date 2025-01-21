const appVersion = "v2.46";

const chartColors = {
  default: { line: '#ff6f61', grid: '#cccccc', labels: '#ffffff' },
  dark: { line: '#3498db', grid: '#666666', labels: '#f5f5f5' }
};

// Initialize App
window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('app-version').textContent = appVersion;
  setupNavigation();
  setupLogWeight();
  setupDateFilter();
  setupExportButton();
  setupThemeToggle();
  setupTargetWeight();
  navigateTo('home');
});

// Setup Navigation
function setupNavigation() {
  const links = document.querySelectorAll('.navbar a');
  links.forEach((link) => {
    const pageId = link.getAttribute('data-page');
    link.addEventListener('click', (event) => {
      event.preventDefault();
      navigateTo(pageId);
    });
  });
}

// Navigate Between Pages
function navigateTo(pageId) {
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => {
    if (page.id === pageId) {
      page.style.display = 'block';
      page.classList.remove('hidden');
    } else {
      page.style.display = 'none';
      page.classList.add('hidden');
    }
  });

  if (pageId === 'dashboard') {
    loadDashboard();
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
    loadDashboard();
  });
}

// Setup Date Filter
function setupDateFilter() {
  const filterBtn = document.getElementById('filter-btn');
  filterBtn.addEventListener('click', () => {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const progressData = JSON.parse(localStorage.getItem('progressData')) || [];

    const filteredData = progressData.filter(entry => {
      return (!startDate || entry.date >= startDate) && (!endDate || entry.date <= endDate);
    });

    updateChart(filteredData);
  });
}

// Setup Export Button
function setupExportButton() {
  const exportBtn = document.getElementById('export-btn');
  exportBtn.addEventListener('click', () => {
    const progressData = JSON.parse(localStorage.getItem('progressData')) || [];
    const csvContent = 'Date,Weight\n' + progressData.map(entry => `${entry.date},${entry.weight}`).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'weight_progress.csv';
    link.click();
  });
}

// Setup Theme Toggle
function setupThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = localStorage.getItem('chartTheme') || 'default';
    const newTheme = currentTheme === 'default' ? 'dark' : 'default';
    localStorage.setItem('chartTheme', newTheme);
    loadDashboard();
  });
}

// Setup Target Weight
function setupTargetWeight() {
  const saveTargetWeightBtn = document.getElementById('save-target-weight-btn');
  const targetWeightInput = document.getElementById('target-weight-input');
  saveTargetWeightBtn.addEventListener('click', () => {
    const targetWeight = parseFloat(targetWeightInput.value);
    if (isNaN(targetWeight) || targetWeight <= 0) {
      alert('Please enter a valid target weight.');
      return;
    }
    localStorage.setItem('targetWeight', targetWeight);
    alert('Target weight saved successfully!');
    targetWeightInput.value = '';
    loadDashboard();
  });
}

// Update Milestones
function updateMilestones() {
  const progressData = JSON.parse(localStorage.getItem('progressData')) || [];
  const milestoneList = document.getElementById('milestone-list');
  milestoneList.innerHTML = '';

  if (progressData.length > 0) {
    milestoneList.innerHTML += '<li>First weight logged!</li>';
  }
  if (progressData.length >= 7) {
    milestoneList.innerHTML += '<li>7-day logging streak! Great consistency!</li>';
  }
  if (progressData.length >= 30) {
    milestoneList.innerHTML += '<li>30-day streak! You’re amazing!</li>';
  }
}

// Update Chart
function updateChart(data) {
  const currentTheme = localStorage.getItem('chartTheme') || 'default';
  const theme = chartColors[currentTheme];
  const targetWeight = parseFloat(localStorage.getItem('targetWeight'));

  const chartContainer = document.getElementById('weight-chart-container');
  chartContainer.innerHTML = '<canvas id="weight-chart"></canvas>';
  const ctx = document.getElementById('weight-chart').getContext('2d');
  const datasets = [{
    label: 'Weight Progress',
    data: data.map(entry => entry.weight),
    borderColor: theme.line,
    borderWidth: 2,
    pointBackgroundColor: theme.line
  }];

  if (!isNaN(targetWeight)) {
    datasets.push({
      label: 'Target Weight',
      data: new Array(data.length).fill(targetWeight),
      borderColor: '#ff0000',
      borderDash: [5, 5],
      fill: false
    });
  }

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map(entry => entry.date),
      datasets: datasets
    },
    options: {
      responsive: true,
      scales: {
        x: { grid: { color: theme.grid }, ticks: { color: theme.labels } },
        y: { grid: { color: theme.grid }, ticks: { color: theme.labels } }
      },
      plugins: {
        legend: { labels: { color: theme.labels } }
      }
    }
  });
}

// Load Dashboard
function loadDashboard() {
  const progressData = JSON.parse(localStorage.getItem('progressData')) || [];
  updateChart(progressData);
  updateMilestones();
}
