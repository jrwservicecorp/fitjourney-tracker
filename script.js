
const appVersion = "v2.20";

document.getElementById('guest-btn').addEventListener('click', () => {
  document.getElementById('landing-page').classList.add('hidden');
  document.getElementById('main-app').classList.remove('hidden');
  navigateTo('dashboard');
});

document.getElementById('login-btn').addEventListener('click', () => {
  document.getElementById('landing-page').classList.add('hidden');
  document.getElementById('main-app').classList.remove('hidden');
  navigateTo('dashboard');
});

// Function to navigate between pages
function navigateTo(pageId) {
  const pages = document.querySelectorAll('.page');
  pages.forEach((page) => page.classList.add('hidden'));
  const targetPage = document.getElementById(pageId);
  if (targetPage) {
    targetPage.classList.remove('hidden');
    if (pageId === 'dashboard') {
      loadDashboard();
    }
  }
}

// Dashboard with new user control panel features
function loadDashboard() {
  const dashboard = document.getElementById('dashboard');
  if (dashboard) {
    dashboard.innerHTML = `
      <h2>Your Dashboard</h2>
      <div class="card">
        <h3>Profile</h3>
        <div class="profile-section">
          <img src="${localStorage.getItem('profilePic') || 'default-profile.png'}" alt="Profile Picture" id="profile-pic" class="profile-pic">
          <input type="file" id="upload-profile-pic" accept="image/*">
          <p>Total Weight Lost: <span id="total-weight-lost">${calculateTotalWeightLost()}</span> lbs</p>
          <p>Current Streak: <span id="current-streak">7 days</span></p>
        </div>
      </div>
      <div class="card">
        <h3>Measurement Progress</h3>
        <canvas id="measurement-chart" width="400" height="200"></canvas>
      </div>
      <div class="card">
        <h3>Before/After View</h3>
        <div id="before-after-view">
          <label for="before-date">Before:</label>
          <select id="before-date"></select>
          <label for="after-date">After:</label>
          <select id="after-date"></select>
          <button id="compare-btn" class="btn">Compare</button>
        </div>
        <div id="comparison-result" class="comparison-view"></div>
      </div>`;

    // Initialize features
    initProfilePicUpload();
    renderMeasurementChart();
    populateBeforeAfterDates();
    setupComparison();
  }
}

// Calculate total weight lost
function calculateTotalWeightLost() {
  const progressData = JSON.parse(localStorage.getItem('progressData')) || [];
  if (progressData.length < 2) return 0;
  const startWeight = progressData[0].weight;
  const currentWeight = progressData[progressData.length - 1].weight;
  return Math.max(0, startWeight - currentWeight).toFixed(1);
}

// Profile picture upload
function initProfilePicUpload() {
  const profilePicInput = document.getElementById('upload-profile-pic');
  const profilePic = document.getElementById('profile-pic');

  profilePicInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      localStorage.setItem('profilePic', event.target.result);
      profilePic.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// Render measurement progress chart
function renderMeasurementChart() {
  const ctx = document.getElementById('measurement-chart').getContext('2d');
  const progressData = JSON.parse(localStorage.getItem('progressData')) || [];
  const dates = progressData.map(entry => entry.date);
  const weights = progressData.map(entry => entry.weight);

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: dates,
      datasets: [{
        label: 'Weight (lbs)',
        data: weights,
        borderColor: '#1a73e8',
        borderWidth: 2,
        fill: false,
      }],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
        },
      },
    },
  });
}

// Populate before/after dropdowns
function populateBeforeAfterDates() {
  const progressData = JSON.parse(localStorage.getItem('progressData')) || [];
  const beforeSelect = document.getElementById('before-date');
  const afterSelect = document.getElementById('after-date');

  beforeSelect.innerHTML = '';
  afterSelect.innerHTML = '';

  progressData.forEach((entry, index) => {
    const option = `<option value="${index}">${entry.date}</option>`;
    beforeSelect.innerHTML += option;
    afterSelect.innerHTML += option;
  });
}

// Setup comparison for before/after photos
function setupComparison() {
  const compareBtn = document.getElementById('compare-btn');
  const comparisonResult = document.getElementById('comparison-result');

  compareBtn.addEventListener('click', () => {
    const progressData = JSON.parse(localStorage.getItem('progressData')) || [];
    const beforeIndex = document.getElementById('before-date').value;
    const afterIndex = document.getElementById('after-date').value;

    if (beforeIndex && afterIndex) {
      const beforePhoto = progressData[beforeIndex]?.photo || 'no-photo.png';
      const afterPhoto = progressData[afterIndex]?.photo || 'no-photo.png';

      comparisonResult.innerHTML = `
        <div class="photo-comparison">
          <div><img src="${beforePhoto}" alt="Before"></div>
          <div><img src="${afterPhoto}" alt="After"></div>
        </div>`;
    } else {
      alert('Please select both before and after dates.');
    }
  });
}

// Initialize app
window.onload = () => {
  document.querySelector('header').innerHTML += `<p>App Version: ${appVersion}</p>`;
  navigateTo('dashboard');
};
