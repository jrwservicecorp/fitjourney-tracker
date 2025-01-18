
document.getElementById('guest-btn').addEventListener('click', () => {
  document.getElementById('landing-page').classList.add('hidden');
  document.getElementById('main-app').classList.remove('hidden');
  loadDashboard();
});

document.getElementById('login-btn').addEventListener('click', () => {
  document.getElementById('landing-page').classList.add('hidden');
  document.getElementById('main-app').classList.remove('hidden');
  loadDashboard();
});

function loadDashboard() {
  console.log("Dashboard loaded!");
}

document.getElementById('light-mode-btn').addEventListener('click', () => {
  document.body.style.background = "#ffffff";
  document.body.style.color = "#000000";
});

document.getElementById('dark-mode-btn').addEventListener('click', () => {
  document.body.style.background = "#121212";
  document.body.style.color = "#ffffff";
});

document.getElementById('save-reminders-btn').addEventListener('click', () => {
  const frequency = document.getElementById('reminder-frequency').value;
  alert(`Reminder frequency set to ${frequency}.`);
});

document.getElementById('save-profile-btn').addEventListener('click', () => {
  const name = document.getElementById('profile-name').value;
  const email = document.getElementById('profile-email').value;
  alert(`Profile updated: Name - ${name}, Email - ${email}`);
});

document.getElementById('export-data-btn').addEventListener('click', () => {
  alert("Exporting your data as a JSON file (placeholder).");
});
