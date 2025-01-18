
document.getElementById('guest-btn').addEventListener('click', () => {
  document.getElementById('landing-page').classList.add('hidden');
  document.getElementById('main-app').classList.remove('hidden');
  loadDashboard();
  navigateTo('dashboard');
});

document.getElementById('login-btn').addEventListener('click', () => {
  document.getElementById('landing-page').classList.add('hidden');
  document.getElementById('main-app').classList.remove('hidden');
  loadDashboard();
  navigateTo('dashboard');
});

// Function to navigate between pages
function navigateTo(pageId) {
  const pages = document.querySelectorAll('.page');
  pages.forEach((page) => page.classList.add('hidden'));
  const targetPage = document.getElementById(pageId);
  if (targetPage) {
    targetPage.classList.remove('hidden');
  }
}

// Ensure default content loads on the Dashboard
function loadDashboard() {
  const dashboard = document.getElementById('dashboard');
  if (dashboard) {
    dashboard.innerHTML = `
      <h2>Your Dashboard</h2>
      <div class="card">
        <h3>Welcome Back!</h3>
        <p>Here's a summary of your progress:</p>
        <ul>
          <li>Current Streak: <span id="current-streak">7 days</span></li>
          <li>Weight Lost: <span id="weight-lost">10 lbs</span></li>
          <li>Milestones Achieved: <span id="milestones">3</span></li>
        </ul>
      </div>`;
  }
}

// Theme toggles
document.getElementById('light-mode-btn').addEventListener('click', () => {
  document.body.style.background = "#ffffff";
  document.body.style.color = "#000000";
});

document.getElementById('dark-mode-btn').addEventListener('click', () => {
  document.body.style.background = "#121212";
  document.body.style.color = "#ffffff";
});

// Save reminders
document.getElementById('save-reminders-btn').addEventListener('click', () => {
  const frequency = document.getElementById('reminder-frequency').value;
  alert(`Reminder frequency set to ${frequency}.`);
});

// Save profile information
document.getElementById('save-profile-btn').addEventListener('click', () => {
  const name = document.getElementById('profile-name').value;
  const email = document.getElementById('profile-email').value;
  alert(`Profile updated: Name - ${name}, Email - ${email}`);
});

// Export data
document.getElementById('export-data-btn').addEventListener('click', () => {
  alert("Exporting your data as a JSON file (placeholder).");
});

// Ensure the Dashboard loads by default when the app starts
window.onload = () => {
  navigateTo('dashboard');
  loadDashboard();
};
