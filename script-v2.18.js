
const appVersion = "v2.18";

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

// Dashboard with modern enhancements
function loadDashboard() {
  const dashboard = document.getElementById('dashboard');
  if (dashboard) {
    dashboard.innerHTML = `
      <h2>Your Dashboard</h2>
      <div class="card">
        <h3><i class="fas fa-dumbbell"></i> Log Your Progress</h3>
        <label for="log-weight">Weight (lbs):</label>
        <input type="number" id="log-weight" placeholder="Enter weight">
        <label for="log-date">Date:</label>
        <input type="date" id="log-date">
        <button id="log-progress-btn" class="btn"><i class="fas fa-save"></i> Save Progress</button>
      </div>
      <div class="card">
        <h3><i class="fas fa-chart-line"></i> Progress Entries</h3>
        <table id="progress-table" class="progress-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Weight</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
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
          <td>${entry.weight}</td>`;
        tableBody.appendChild(row);
      });
    };

    // Handle logging progress
    document.getElementById('log-progress-btn').addEventListener('click', () => {
      const date = document.getElementById('log-date').value;
      const weight = parseFloat(document.getElementById('log-weight').value);

      if (date && !isNaN(weight)) {
        progressData.push({ date, weight });
        localStorage.setItem('progressData', JSON.stringify(progressData));
        updateTable();
      } else {
        alert('Please enter both date and weight!');
      }
    });

    // Initial render
    updateTable();
  }
}

// Initialize app
window.onload = () => {
  document.querySelector('header').innerHTML += `<p>App Version: ${appVersion}</p>`;
  navigateTo('dashboard');
};
