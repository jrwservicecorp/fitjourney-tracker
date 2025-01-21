const appVersion = "v2.36";

// Set Version in Header
document.getElementById('app-version').textContent = appVersion;

// Initialize App
window.onload = () => {
  setupNavigation();
  navigateTo('home');
  setupLogWeight();
};

// Setup Navigation
function setupNavigation() {
  document.querySelectorAll('.navbar a').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const pageId = link.getAttribute('data-page');
      navigateTo(pageId);
    });
  });
}

// Navigate Between Pages
function navigateTo(pageId) {
  document.querySelectorAll('.page').forEach((page) => page.classList.add('hidden'));
  document.getElementById(pageId).classList.remove('hidden');
}

// Setup Log Weight Functionality
function setupLogWeight() {
  const logWeightBtn = document.getElementById('log-weight-btn');
  const weightInput = document.getElementById('weight-input');

  logWeightBtn.addEventListener('click', () => {
    const weight = parseFloat(weightInput.value);
    if (isNaN(weight) || weight < 20 || weight > 500) {
      alert('Please enter a valid weight between 20 and 500 lbs.');
      return;
    }
    const today = new Date().toISOString().split('T')[0];
    const progressData = JSON.parse(localStorage.getItem('progressData')) || [];
    progressData.push({ date: today, weight });
    localStorage.setItem('progressData', JSON.stringify(progressData));
    alert('Weight logged successfully!');
    weightInput.value = ''; // Clear input
  });
}
