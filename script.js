const appVersion = "v2.49";

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
  setupDateFilter();
  setupExportButton();
  setupThemeToggle();
  setupTargetWeight();
  navigateTo('home');
});

// Setup Navigation
function setupNavigation() {
  const links = document.querySelectorAll('.navbar a');
  links.forEach((link) => {
    const pageId = link.getAttribute('data-page');
    link.addEventListener('click', (event) => {
      event.preventDefault();
      navigateTo(pageId);
    });
  });
}

// Navigate Between Pages
function navigateTo(pageId) {
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => {
    if (page.id === pageId) {
      page.style.display = 'block';
      page.classList.remove('hidden');
    } else {
      page.style.display = 'none';
      page.classList.add('hidden');
    }
  });

  if (pageId === 'dashboard') {
    loadDashboard();
  }
}

// Log Weight and Metrics
function setupLogWeight() {
  const logWeightBtn = document.getElementById('log-weight-btn');
  const weightInput = document.getElementById('weight-input');
  const bodyFatInput = document.getElementById('body-fat');
  const waistInput = document.getElementById('waist');
  logWeightBtn.addEventListener('click', () => {
    const weight = parseFloat(weightInput.value);
    const bodyFat = parseFloat(bodyFatInput.value);
    const waist = parseFloat(waistInput.value);

    if (isNaN(weight) || weight < 20 || weight > 500) {
      alert('Please enter a valid weight between 20 and 500 lbs.');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const progressData = JSON.parse(localStorage.getItem('progressData')) || [];
    progressData.push({ date: today, weight, bodyFat, waist });
    localStorage.setItem('progressData', JSON.stringify(progressData));
    alert('Entry logged successfully!');
    weightInput.value = '';
    bodyFatInput.value = '';
    waistInput.value = '';
    loadDashboard();
  });
}

// Trophy Case
function updateTrophies() {
  const progressData = JSON.parse(localStorage.getItem('progressData')) || [];
  const trophies = document.getElementById('trophies');
  trophies.innerHTML = '';

  if (progressData.length > 0) {
    trophies.innerHTML += '<img src="icons/trophy_first.png" alt="First Entry Trophy" title="First Weight Logged">';
  }
  if (progressData.length >= 7) {
    trophies.innerHTML += '<img src="icons/trophy_7day.png" alt="7-Day Streak Trophy" title="7-Day Logging Streak">';
  }
  if (progressData.length >= 30) {
    trophies.innerHTML += '<img src="icons/trophy_30day.png" alt="30-Day Streak Trophy" title="30-Day Logging Streak">';
  }
}

// Update Milestones
function updateMilestones() {
  const progressData = JSON.parse(localStorage.getItem('progressData')) || [];
  const milestoneList = document.getElementById('milestone-list');
  milestoneList.innerHTML = '';

  if (progressData.length > 0) {
    milestoneList.innerHTML += '<li>First weight logged!</li>';
  }
  if (progressData.length >= 7) {
    milestoneList.innerHTML += '<li>7-day logging streak! Great consistency!</li>';
  }
  if (progressData.length >= 30) {
    milestoneList.innerHTML += '<li>30-day streak! You’re amazing!</li>';
  }
}

// Update Streaks
function updateStreaks() {
  const progressData = JSON.parse(localStorage.getItem('progressData')) || [];
  let currentStreak = 0;
  let longestStreak = 0;
  let previousDate = null;

  progressData.forEach(entry => {
    const entryDate = new Date(entry.date);
    if (previousDate && (entryDate - previousDate) === 86400000) {
      currentStreak++;
    } else {
      currentStreak = 1;
    }
    longestStreak = Math.max(longestStreak, currentStreak);
    previousDate = entryDate;
  });

  document.getElementById('current-streak').textContent = `${currentStreak} days`;
  document.getElementById('longest-streak').textContent = `Longest Streak: ${longestStreak} days`;
}

// Photo Upload and Gallery
function setupPhotoUpload() {
  const photoUploadBtn = document.getElementById('upload-photo-btn');
  const photoInput = document.getElementById('photo-upload');

  photoUploadBtn.addEventListener('click', () => {
    const file = photoInput.files[0];
    if (!file) {
      alert('Please select a photo to upload.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const photos = JSON.parse(localStorage.getItem('photos')) || [];
      photos.push({ date: new Date().toISOString().split('T')[0], src: event.target.result });
      localStorage.setItem('photos', JSON.stringify(photos));
      alert('Photo uploaded successfully!');
      updatePhotoGallery();
    };
    reader.readAsDataURL(file);
  });
}

function updatePhotoGallery() {
  const photos = JSON.parse(localStorage.getItem('photos')) || [];
  const gallery = document.getElementById('photo-gallery');
  gallery.innerHTML = '';

  photos.forEach(photo => {
    gallery.innerHTML += `<div class="photo-entry">
      <img src="${photo.src}" alt="Progress Photo" title="${photo.date}">
      <p>${photo.date}</p>
    </div>`;
  });
}

// Load Dashboard
function loadDashboard() {
  const progressData = JSON.parse(localStorage.getItem('progressData')) || [];
  updateChart(progressData);
  updateMilestones();
  updateStreaks();
  updateTrophies();
  updatePhotoGallery();
}
