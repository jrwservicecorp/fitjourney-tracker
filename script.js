// JavaScript (v2.53)
const appVersion = "v2.53";

const chartColors = {
  default: { line: '#ff6f61', grid: '#cccccc', labels: '#ffffff' },
  dark: { line: '#3498db', grid: '#666666', labels: '#f5f5f5' }
};

// Initialize App
window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('app-version').textContent = appVersion;
  setupNavigation();
  setupLogWeight();
  setupPhotoUpload();
  setupPhotoComparison();
  loadDashboard();
});

// Navigation
function setupNavigation() {
  const links = document.querySelectorAll('.navbar a');
  links.forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      navigateTo(link.getAttribute('data-page'));
    });
  });
}

function navigateTo(pageId) {
  document.querySelectorAll('.page').forEach(page => {
    page.style.display = page.id === pageId ? 'block' : 'none';
  });
  if (pageId === 'dashboard') loadDashboard();
}

// Weight Logging
function setupLogWeight() {
  const logWeightBtn = document.getElementById('log-weight-btn');
  logWeightBtn.addEventListener('click', () => {
    const weight = parseFloat(document.getElementById('weight-input').value);

    if (isNaN(weight) || weight < 20 || weight > 500) {
      alert('Please enter a valid weight between 20 and 500 lbs.');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const progressData = JSON.parse(localStorage.getItem('progressData')) || [];
    progressData.push({ date: today, weight });
    localStorage.setItem('progressData', JSON.stringify(progressData));
    alert('Entry logged successfully!');
    loadDashboard();
  });
}

// Photo Upload
function setupPhotoUpload() {
  const uploadBtn = document.getElementById('upload-photo-btn');
  const photoInput = document.getElementById('photo-upload');
  const descriptionInput = document.getElementById('photo-description');

  uploadBtn.addEventListener('click', () => {
    const file = photoInput.files[0];
    const description = descriptionInput.value;

    if (!file) {
      alert('Please select a photo to upload.');
      return;
    }

    const reader = new FileReader();
    reader.onload = event => {
      const photos = JSON.parse(localStorage.getItem('photos')) || [];
      photos.push({
        date: new Date().toISOString().split('T')[0],
        src: event.target.result,
        description,
      });
      localStorage.setItem('photos', JSON.stringify(photos));
      alert('Photo uploaded successfully!');
      descriptionInput.value = '';
      updatePhotoGallery();
    };
    reader.readAsDataURL(file);
  });
}

// Update Photo Gallery
function updatePhotoGallery() {
  const photos = JSON.parse(localStorage.getItem('photos')) || [];
  const gallery = document.getElementById('photo-gallery');
  gallery.innerHTML = '';

  if (photos.length === 0) {
    gallery.innerHTML = '<p class="placeholder">No photos uploaded yet. Start uploading to see your progress!</p>';
    return;
  }

  photos.forEach((photo, index) => {
    const photoEntry = document.createElement('div');
    photoEntry.classList.add('photo-entry');
    photoEntry.innerHTML = `
      <img src="${photo.src}" alt="Progress Photo" title="${photo.date}">
      <p>${photo.date}</p>
      <p>${photo.description || ''}</p>
      <button onclick="deletePhoto(${index})">Delete</button>
    `;
    gallery.appendChild(photoEntry);
  });
}

function deletePhoto(index) {
  const photos = JSON.parse(localStorage.getItem('photos')) || [];
  photos.splice(index, 1);
  localStorage.setItem('photos', JSON.stringify(photos));
  updatePhotoGallery();
}

// Photo Comparison
function setupPhotoComparison() {
  const beforeSelect = document.getElementById('photo-select-before');
  const afterSelect = document.getElementById('photo-select-after');
  const comparisonResult = document.getElementById('comparison-result');

  function populatePhotoSelects() {
    const photos = JSON.parse(localStorage.getItem('photos')) || [];
    [beforeSelect, afterSelect].forEach(select => {
      select.innerHTML = photos.map((photo, index) => `<option value="${index}">${photo.date}</option>`).join('');
    });
  }

  document.getElementById('generate-comparison-btn').addEventListener('click', () => {
    const photos = JSON.parse(localStorage.getItem('photos')) || [];
    const beforeIndex = beforeSelect.value;
    const afterIndex = afterSelect.value;

    if (!beforeIndex || !afterIndex || beforeIndex === afterIndex) {
      alert('Please select two different photos for comparison.');
      return;
    }

    const beforePhoto = photos[beforeIndex];
    const afterPhoto = photos[afterIndex];

    comparisonResult.innerHTML = `
      <div class="comparison-photo"><img src="${beforePhoto.src}" alt="Before"></div>
      <div class="comparison-photo"><img src="${afterPhoto.src}" alt="After"></div>
    `;
  });

  populatePhotoSelects();
}

// Dashboard
function loadDashboard() {
  const progressData = JSON.parse(localStorage.getItem('progressData')) || [];
  if (progressData.length > 0) {
    document.getElementById('chart-placeholder').style.display = 'none';
    renderChart(progressData);
  } else {
    document.getElementById('chart-placeholder').style.display = 'block';
  }
}

let chartInstance = null;
function renderChart(data) {
  const ctx = document.getElementById('weight-chart').getContext('2d');

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map(entry => entry.date),
      datasets: [{
        label: 'Weight (lbs)',
        data: data.map(entry => entry.weight),
        borderColor: chartColors.default.line,
        fill: false,
      }],
    },
    options: {
      responsive: true,
      scales: {
        x: { grid: { color: chartColors.default.grid } },
        y: { grid: { color: chartColors.default.grid } },
      },
    },
  });
}
