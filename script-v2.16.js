
const appVersion = "v2.16";

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
    if (pageId === 'settings') {
      loadUserSettings();
    }
  }
}

// Dashboard with dynamic goal tracking
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
      </div>
      <div class="card">
        <h3>Your Goals</h3>
        <p>Add and track your fitness goals:</p>
        <input type="text" id="goal-title" placeholder="Goal Title (e.g., Lose 5 lbs)" />
        <input type="date" id="goal-deadline" placeholder="Deadline" />
        <button id="add-goal-btn" class="btn">Add Goal</button>
        <div id="goal-list" class="goal-grid">
          <!-- Dynamic goals will populate here -->
        </div>
      </div>`;

    // Initialize goal functionality
    const addGoalBtn = document.getElementById('add-goal-btn');
    const goalList = document.getElementById('goal-list');

    addGoalBtn.addEventListener('click', () => {
      const title = document.getElementById('goal-title').value;
      const deadline = document.getElementById('goal-deadline').value;
      if (title && deadline) {
        const goalCard = document.createElement('div');
        goalCard.classList.add('goal-card');
        goalCard.innerHTML = `
          <h4>${title}</h4>
          <p>Deadline: ${deadline}</p>
          <progress value="0" max="100"></progress>
          <button class="btn-complete">Mark as Complete</button>
          <button class="btn-delete">Delete</button>`;

        // Complete and delete functionality
        goalCard.querySelector('.btn-complete').addEventListener('click', () => {
          goalCard.querySelector('progress').value = 100;
          alert(`Goal "${title}" marked as complete!`);
        });
        goalCard.querySelector('.btn-delete').addEventListener('click', () => {
          goalCard.remove();
        });

        goalList.appendChild(goalCard);
        document.getElementById('goal-title').value = '';
        document.getElementById('goal-deadline').value = '';
      } else {
        alert('Please fill out both fields before adding a goal.');
      }
    });
  }
}

// User Settings page
function loadUserSettings() {
  const settings = document.getElementById('settings');
  if (settings) {
    settings.innerHTML = `
      <h2>User Settings</h2>
      <div class="card">
        <h3>Profile Information</h3>
        <label for="profile-name">Name:</label>
        <input type="text" id="profile-name" placeholder="Your name">
        <label for="profile-email">Email:</label>
        <input type="email" id="profile-email" placeholder="Your email">
        <button id="save-profile-btn" class="btn">Save Changes</button>
      </div>
      <div class="card">
        <h3>Preferences</h3>
        <label for="reminder-frequency">Reminder Frequency:</label>
        <select id="reminder-frequency">
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
        <button id="save-reminders-btn" class="btn">Save Preferences</button>
      </div>`;
  }
}

// Initialize app on load
window.onload = () => {
  document.querySelector('header').innerHTML += `<p>App Version: ${appVersion}</p>`;
  navigateTo('dashboard');
};
