
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
  // Dynamic goal tracking (mock progress for now)
  document.getElementById('goal-progress').textContent = "50%";
  // Update milestones dynamically
  const milestoneList = document.getElementById('milestone-list');
  const milestones = ["Hit 30-Day Streak! 🎉", "Lost First 5 lbs! 🎉"];
  milestoneList.innerHTML = ""; // Clear existing milestones
  milestones.forEach(milestone => {
    const li = document.createElement('li');
    li.textContent = milestone;
    milestoneList.appendChild(li);
  });
}
