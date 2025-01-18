
function toggleMenu() {
  const menuItems = document.getElementById('menu-items');
  menuItems.classList.toggle('hidden');
}

function navigateToApp(mode) {
  document.getElementById('landing-page').classList.add('hidden');
  document.getElementById('main-app').classList.remove('hidden');
  if (mode === 'guest') {
    console.log('Using app as guest.');
  } else {
    console.log('Navigating to login...');
  }
}

function navigateTo(pageId) {
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => page.classList.add('hidden'));
  document.getElementById(pageId).classList.remove('hidden');
}

function logout() {
  alert('Logging out...');
  location.reload();
}

function shareProgress() {
  alert('Sharing your progress to social media! This functionality will integrate with APIs for Facebook, Instagram, and Twitter.');
}
