
function toggleMenu() {
  const menuItems = document.getElementById('menu-items');
  menuItems.classList.toggle('visible');
}

function navigateToApp(mode) {
  // Hide the landing page and show the main app
  document.getElementById('landing-page').classList.add('hidden');
  document.getElementById('main-app').classList.remove('hidden');
  if (mode === 'guest') {
    console.log('Guest mode activated.');
  } else if (mode === 'login') {
    console.log('Login mode activated.');
  }
}

function navigateTo(pageId) {
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => page.classList.add('hidden'));
  document.getElementById(pageId).classList.remove('hidden');

  // Close menu after navigation
  const menuItems = document.getElementById('menu-items');
  menuItems.classList.remove('visible');
}

function logout() {
  alert('Logging out...');
  location.reload();
}

// Event listener for tracking preferences
document.getElementById('tracking-options-form').addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Tracking preferences saved!');
});

// Event listener for archive filtering
document.getElementById('archive-filter-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const startDate = document.getElementById('start-date').value;
  const endDate = document.getElementById('end-date').value;

  alert(`Showing progress from ${startDate} to ${endDate}`);
  document.getElementById('archive-results').classList.remove('hidden');
}

function shareProgress() {
  alert('Sharing progress to social media platforms!');
}
