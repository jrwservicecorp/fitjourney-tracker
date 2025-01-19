
const appVersion = "v2.13";

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

// Full Dashboard with restored features
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
        <h3>Log Your Progress</h3>
        <label for="weight-log">Weight (lbs):</label>
        <input type="number" id="weight-log" placeholder="Enter weight">
        <label for="date-log">Date:</label>
        <input type="date" id="date-log">
        <label for="measurement-log">Measurements:</label>
        <input type="text" id="measurement-log" placeholder="Enter measurements">
        <button id="log-progress-btn" class="btn">Log Progress</button>
      </div>
      <div class="card">
        <h3>Photo Upload</h3>
        <p>Upload your progress photos:</p>
        <input type="file" id="photo-upload" accept="image/*" multiple>
        <div id="photo-preview" style="margin-top: 10px;"></div>
      </div>
      <div class="card">
        <h3>Goals</h3>
        <p>Track your fitness goals:</p>
        <input type="text" id="new-goal" placeholder="Enter a new goal">
        <button id="add-goal-btn" class="btn">Add Goal</button>
        <ul id="goals-list">
          <li>Lose 5 lbs by March 2025</li>
          <li>Run 5 miles non-stop</li>
        </ul>
      </div>
      <div class="card">
        <h3>Progress Chart</h3>
        <canvas id="progress-chart" width="400" height="200"></canvas>
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
          img.style.marginRight = "10px";
          photoPreview.appendChild(img);
        };
        reader.readAsDataURL(file);
      });
    });

    // Initialize goal tracking
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

    // Initialize progress chart
    const ctx = document.getElementById('progress-chart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [{
          label: 'Weight Progress',
          data: [200, 195, 190, 185],
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
  }
}

// Ensure menu links are functional
function initializeMenu() {
  const menuLinks = document.querySelectorAll('.menu a');
  menuLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetPage = link.getAttribute('onclick').match(/'([^']+)'/)[1];
      navigateTo(targetPage);
    });
  });
}

// Ensure version is displayed in the header
function displayVersion() {
  const header = document.querySelector('header');
  const versionElement = document.createElement('p');
  versionElement.textContent = `App Version: ${appVersion}`;
  header.appendChild(versionElement);
}

// Initialize app on load
window.onload = () => {
  initializeMenu();
  displayVersion();
  navigateTo('dashboard');
};
