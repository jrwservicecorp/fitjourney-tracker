
const appVersion = "v2.15";

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

// Dashboard with all enhanced features
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
        <h3>Photo Upload</h3>
        <p>Upload your progress photos:</p>
        <input type="file" id="photo-upload" accept="image/*" multiple>
        <div id="photo-preview" class="photo-preview" style="margin-top: 10px;"></div>
      </div>
      <div class="card">
        <h3>Goals</h3>
        <p>Track your fitness goals:</p>
        <input type="text" id="new-goal" placeholder="Enter a new goal">
        <button id="add-goal-btn" class="btn">Add Goal</button>
        <ul id="goals-list"></ul>
      </div>`;

    // Initialize photo upload preview
    const photoUpload = document.getElementById('photo-upload');
    const photoPreview = document.getElementById('photo-preview');
    photoUpload.addEventListener('change', (e) => {
      const files = e.target.files;
      photoPreview.innerHTML = "";
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = document.createElement('img');
          img.src = event.target.result;
          img.style.width = "100px";
          photoPreview.appendChild(img);
        };
        reader.readAsDataURL(file);
      });
    });

    // Initialize goals
    const addGoalBtn = document.getElementById('add-goal-btn');
    const goalsList = document.getElementById('goals-list');
    addGoalBtn.addEventListener('click', () => {
      const newGoalInput = document.getElementById('new-goal');
      const newGoal = newGoalInput.value;
      if (newGoal) {
        const li = document.createElement('li');
        li.textContent = newGoal;
        goalsList.appendChild(li);
        newGoalInput.value = "";
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

// Initialize menu and display version
function initializeApp() {
  document.querySelector('header').innerHTML += `<p>App Version: ${appVersion}</p>`;
  navigateTo('dashboard');
}

// Start app
window.onload = initializeApp;
