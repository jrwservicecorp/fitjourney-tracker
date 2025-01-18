
document.getElementById('guest-btn').addEventListener('click', () => {
  document.getElementById('landing-page').classList.add('hidden');
  document.getElementById('main-app').classList.remove('hidden');
  navigateTo('dashboard'); // Ensure dashboard is loaded
});

document.getElementById('login-btn').addEventListener('click', () => {
  document.getElementById('landing-page').classList.add('hidden');
  document.getElementById('main-app').classList.remove('hidden');
  navigateTo('dashboard'); // Ensure dashboard is loaded
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
  document.getElementById('current-streak').textContent = "7 days";
  document.getElementById('weight-lost').textContent = "10 lbs";
  document.getElementById('milestones').textContent = "3";
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
