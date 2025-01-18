
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

// Attach event listeners for guest and login buttons
document.getElementById('guest-btn').addEventListener('click', () => {
  navigateToApp('guest');
});

document.getElementById('login-btn').addEventListener('click', () => {
  navigateToApp('login');
});
