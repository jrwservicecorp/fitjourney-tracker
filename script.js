// JavaScript (v2.56)
const appVersion = "v2.56";

let chartInstance = null;

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("app-version").textContent = appVersion;
  setupNavigation();
  setupLogWeight();
  setupPhotoUpload();
  loadDashboard();
  setupCollapsibleSections();
  setupThemeToggle();
});

// Navigation
function setupNavigation() {
  const links = document.querySelectorAll(".navbar a");
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      navigateTo(link.getAttribute("data-page"));
    });
  });
}

function navigateTo(pageId) {
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.toggle("hidden", page.id !== pageId);
  });

  if (pageId === "dashboard") loadDashboard();
}

// Load Dashboard
function loadDashboard() {
  const progressData = JSON.parse(localStorage.getItem("progressData")) || [];

  if (progressData.length > 0) {
    document.getElementById("chart-placeholder").style.display = "none";
    renderChart(progressData);
  } else {
    document.getElementById("chart-placeholder").style.display = "block";
    renderChart(getPlaceholderData());
  }

  updateSummaryStats(progressData);
}

// Render Chart
function renderChart(data) {
  const ctx = document.getElementById("weight-chart").getContext("2d");

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: data.map((entry) => entry.date),
      datasets: [
        {
          label: "Weight (lbs)",
          data: data.map((entry) => entry.weight),
          borderColor: "#ff6f61",
          backgroundColor: "rgba(255, 111, 97, 0.2)",
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        tooltip: {
          enabled: true,
        },
      },
      scales: {
        x: {
          grid: {
            color: "#cccccc",
          },
        },
        y: {
          grid: {
            color: "#cccccc",
          },
          beginAtZero: true,
        },
      },
    },
  });
}

// Generate Placeholder Data
function getPlaceholderData() {
  const today = new Date();
  const placeholderDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - i));
    return date.toISOString().split("T")[0];
  });

  const placeholderWeights = [150, 152, 151, 153, 150, 148, 149];

  return placeholderDates.map((date, index) => ({
    date,
    weight: placeholderWeights[index],
  }));
}

// Update Summary Stats
function updateSummaryStats(data) {
  const avgWeight = data.length > 0
    ? (data.reduce((sum, entry) => sum + entry.weight, 0) / data.length).toFixed(1)
    : "--";

  const currentStreak = calculateStreak(data);
  const goalProgress = calculateGoalProgress(data);

  document.getElementById("avg-weight").textContent = avgWeight;
  document.getElementById("current-streak").textContent = currentStreak;
  document.getElementById("goal-progress").textContent = `${goalProgress}%`;

  const progressBar = document.getElementById("goal-progress-bar");
  progressBar.style.width = `${goalProgress}%`;
}

// Calculate Logging Streak
function calculateStreak(data) {
  if (data.length === 0) return 0;

  let streak = 1;
  let prevDate = new Date(data[data.length - 1].date);

  for (let i = data.length - 2; i >= 0; i--) {
    const currDate = new Date(data[i].date);
    if ((prevDate - currDate) / (1000 * 60 * 60 * 24) === 1) {
      streak++;
    } else {
      break;
    }
    prevDate = currDate;
  }

  return streak;
}

// Calculate Goal Progress
function calculateGoalProgress(data) {
  const targetWeight = parseFloat(localStorage.getItem("targetWeight")) || 0;
  if (data.length === 0 || !targetWeight) return 0;

  const currentWeight = data[data.length - 1].weight;
  const initialWeight = data[0].weight;

  const progress = Math.max(
    0,
    Math.min(100, ((initialWeight - currentWeight) / (initialWeight - targetWeight)) * 100)
  );

  return progress.toFixed(1);
}

// Log Weight
function setupLogWeight() {
  const logWeightBtn = document.getElementById("log-weight-btn");
  logWeightBtn.addEventListener("click", () => {
    const weight = parseFloat(document.getElementById("weight-input").value);
    const bodyFat = parseFloat(document.getElementById("body-fat").value);
    const waist = parseFloat(document.getElementById("waist").value);

    if (isNaN(weight) || weight < 20 || weight > 500) {
      alert("Please enter a valid weight between 20 and 500 lbs.");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    const progressData = JSON.parse(localStorage.getItem("progressData")) || [];
    progressData.push({ date: today, weight, bodyFat, waist });
    localStorage.setItem("progressData", JSON.stringify(progressData));
    alert("Entry logged successfully!");
    loadDashboard();
  });
}

// Photo Upload
function setupPhotoUpload() {
  const uploadBtn = document.getElementById("upload-photo-btn");
  const photoInput = document.getElementById("photo-upload");
  const descriptionInput = document.getElementById("photo-description");

  uploadBtn.addEventListener("click", () => {
    const file = photoInput.files[0];
    const description = descriptionInput.value;

    if (!file) {
      alert("Please select a photo to upload.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const photos = JSON.parse(localStorage.getItem("photos")) || [];
      photos.push({
        date: new Date().toISOString().split("T")[0],
        src: event.target.result,
        description,
      });
      localStorage.setItem("photos", JSON.stringify(photos));
      alert("Photo uploaded successfully!");
      descriptionInput.value = "";
      updatePhotoGallery(photos);
    };
    reader.readAsDataURL(file);
  });
}

// Collapsible Sections
function setupCollapsibleSections() {
  document.querySelectorAll(".toggle-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const content = btn.nextElementSibling;
      content.classList.toggle("open");
    });
  });
}

// Theme Toggle
function setupThemeToggle() {
  const btn = document.getElementById("theme-toggle-btn");
  btn.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
  });
}
