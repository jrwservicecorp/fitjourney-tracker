
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

// Ensure complete features load on the Dashboard
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
        <input type="file" id="photo-upload" accept="image/*">
        <div id="photo-preview" style="margin-top: 10px;"></div>
      </div>
      <div class="card">
        <h3>Goals</h3>
        <p>Track your fitness goals:</p>
        <ul id="goals-list">
          <li>Lose 5 lbs by March 2025</li>
          <li>Run 5 miles non-stop</li>
        </ul>
      </div>`;

    // Handle photo upload preview
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

// Initialize menu and navigate to the default page on load
window.onload = () => {
  initializeMenu();
  navigateTo('dashboard');
};
