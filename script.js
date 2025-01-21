// JavaScript (v2.59)
const appVersion = "v2.59";

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("app-version").textContent = appVersion;
  setupNavigation();
  setupLogWeight();
  setupPhotoUpload();
  loadDashboard();
  setupToggleButtons();
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

// Dashboard
function loadDashboard() {
  const progressData = JSON.parse(localStorage.getItem("progressData")) || [];
  if (progressData.length > 0) {
    document.getElementById("chart-placeholder").style.display = "none";
    renderChart(progressData);
  } else {
    document.getElementById("chart-placeholder").style.display = "block";
    renderChart(getPlaceholderData());
  }
}

// Render Chart
function renderChart(data) {
  // Chart rendering logic
}

// Log Weight
function setupLogWeight() {
  // Log weight functionality
}

// Photo Upload
function setupPhotoUpload() {
  const uploadBtn = document.getElementById("upload-photo-btn");
  const photoInput = document.getElementById("photo-upload");
  const dateInput = document.getElementById("photo-date");
  const descriptionInput = document.getElementById("photo-description");

  uploadBtn.addEventListener("click", () => {
    const file = photoInput.files[0];
    const date = dateInput.value || new Date().toISOString().split("T")[0];
    const description = descriptionInput.value;

    if (!file) {
      alert("Please select a photo to upload.");
      return;
    }

    const photoUrl = URL.createObjectURL(file);

    const photos = JSON.parse(localStorage.getItem("photos")) || [];
    photos.push({
      date,
      src: photoUrl,
      description,
    });
    localStorage.setItem("photos", JSON.stringify(photos));

    alert("Photo uploaded successfully!");
    dateInput.value = "";
    descriptionInput.value = "";
    photoInput.value = "";
    updatePhotoGallery();
  });
}

function updatePhotoGallery() {
  // Update photo gallery logic
}

function setupToggleButtons() {
  const logWeightToggle = document.getElementById("log-weight-toggle");
  const trackProgressToggle = document.getElementById("track-progress-toggle");

  logWeightToggle.addEventListener("click", () => {
    // Toggle log weight section
  });

  trackProgressToggle.addEventListener("click", () => {
    // Toggle track progress section
  });
}
