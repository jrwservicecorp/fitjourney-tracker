
const appVersion = "v2.21";

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

// Dashboard with restored photo upload and progress logging
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
              <th>Chest</th>
              <th>Waist</th>
              <th>Hips</th>
              <th>Arms</th>
              <th>Thighs</th>
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
      const chest = parseFloat(document.getElementById('log-chest').value);
      const waist = parseFloat(document.getElementById('log-waist').value);
      const hips = parseFloat(document.getElementById('log-hips').value);
      const arms = parseFloat(document.getElementById('log-arms').value);
      const thighs = parseFloat(document.getElementById('log-thighs').value);

      if (date && !isNaN(weight)) {
        progressData.push({ date, weight, chest, waist, hips, arms, thighs });
        localStorage.setItem('progressData', JSON.stringify(progressData));
        updateTable();
      } else {
        alert('Please enter valid data for date and weight!');
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
