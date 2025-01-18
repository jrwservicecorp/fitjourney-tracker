
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
