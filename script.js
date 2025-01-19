
const appVersion = "v2.19";

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

// Dashboard with photo uploads and progress display
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
        <button id="log-progress-btn" class="btn">Save Progress</button>
      </div>
      <div class="card">
        <h3>Photo Upload</h3>
        <label for="upload-photo">Upload Photos:</label>
        <input type="file" id="upload-photo" accept="image/*" multiple>
        <div id="photo-gallery" class="photo-gallery"></div>
      </div>
      <div class="card">
        <h3>Progress Entries</h3>
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
    const photoData = JSON.parse(localStorage.getItem('photoData')) || [];

    // Update the progress table
    const updateTable = () => {
      const tableBody = document.querySelector('#progress-table tbody');
      tableBody.innerHTML = '';
      progressData.forEach((entry) => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${entry.date}</td><td>${entry.weight}</td>`;
        tableBody.appendChild(row);
      });
    };

    // Update the photo gallery
    const updatePhotoGallery = () => {
      const gallery = document.getElementById('photo-gallery');
      gallery.innerHTML = '';
      photoData.forEach((photo) => {
        const img = document.createElement('img');
        img.src = photo.url;
        img.alt = `Photo taken on ${photo.date}`;
        img.classList.add('photo-item');
        gallery.appendChild(img);
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

    // Handle photo uploads
    document.getElementById('upload-photo').addEventListener('change', (e) => {
      const files = Array.from(e.target.files);
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          photoData.push({ url: event.target.result, date: new Date().toISOString().split('T')[0] });
          localStorage.setItem('photoData', JSON.stringify(photoData));
          updatePhotoGallery();
        };
        reader.readAsDataURL(file);
      });
    });

    // Initial render
    updateTable();
    updatePhotoGallery();
  }
}

// Initialize app
window.onload = () => {
  document.querySelector('header').innerHTML += `<p>App Version: ${appVersion}</p>`;
  navigateTo('dashboard');
};
