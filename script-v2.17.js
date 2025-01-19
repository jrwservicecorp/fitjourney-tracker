
const appVersion = "v2.17";

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

// Dashboard with expanded logging and measurements
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
        <label for="log-hips">Hips (in):</label>
        <input type="number" id="log-hips" placeholder="Enter hip size">
        <label for="log-arms">Arms (in):</label>
        <input type="number" id="log-arms" placeholder="Enter arm size">
        <label for="log-thighs">Thighs (in):</label>
        <input type="number" id="log-thighs" placeholder="Enter thigh size">
        <button id="log-progress-btn" class="btn">Log Progress</button>
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
              <th>Hips</th>
              <th>Arms</th>
              <th>Thighs</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
      <div class="card">
        <h3>Progress Chart</h3>
        <canvas id="progress-chart" width="400" height="200"></canvas>
      </div>`;

    // Initialize progress data
    const progressData = JSON.parse(localStorage.getItem('progressData')) || [];

    // Update the table with logged data
    const updateTable = () => {
      const tableBody = document.querySelector('#progress-table tbody');
      tableBody.innerHTML = '';
      progressData.forEach((entry) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${entry.date}</td>
          <td>${entry.weight}</td>
          <td>${entry.chest}</td>
          <td>${entry.waist}</td>
          <td>${entry.hips}</td>
          <td>${entry.arms}</td>
          <td>${entry.thighs}</td>`;
        tableBody.appendChild(row);
      });
    };

    // Initialize the chart with progress data
    const updateChart = () => {
      const ctx = document.getElementById('progress-chart').getContext('2d');
      const dates = progressData.map(entry => entry.date);
      const weights = progressData.map(entry => entry.weight);
      if (window.progressChart) {
        window.progressChart.destroy();
      }
      window.progressChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: dates,
          datasets: [{
            label: 'Weight (lbs)',
            data: weights,
            borderColor: '#007bff',
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
    };

    // Handle logging progress
    document.getElementById('log-progress-btn').addEventListener('click', () => {
      const date = document.getElementById('log-date').value;
      const weight = parseFloat(document.getElementById('log-weight').value);
      const chest = parseFloat(document.getElementById('log-chest').value);
      const waist = parseFloat(document.getElementById('log-waist').value);
      const hips = parseFloat(document.getElementById('log-hips').value);
      const arms = parseFloat(document.getElementById('log-arms').value);
      const thighs = parseFloat(document.getElementById('log-thighs').value);

      if (date && !isNaN(weight)) {
        progressData.push({ date, weight, chest, waist, hips, arms, thighs });
        localStorage.setItem('progressData', JSON.stringify(progressData));
        updateTable();
        updateChart();
      } else {
        alert('Please enter at least a date and weight!');
      }
    });

    // Initial render
    updateTable();
    updateChart();
  }
}

// Initialize app
window.onload = () => {
  document.querySelector('header').innerHTML += `<p>App Version: ${appVersion}</p>`;
  navigateTo('dashboard');
};
