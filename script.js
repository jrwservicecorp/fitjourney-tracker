
function toggleMenu() {
  const menuItems = document.getElementById('menu-items');
  menuItems.classList.toggle('visible');
}

function navigateToApp(mode) {
  document.getElementById('landing-page').classList.add('hidden');
  document.getElementById('main-app').classList.remove('hidden');
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

function shareProgress() {
  alert('Sharing progress to social media platforms!');
}
