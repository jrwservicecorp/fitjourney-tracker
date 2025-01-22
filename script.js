// JavaScript (v2.59.1)
const appVersion = "v2.59.1";

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("app-version").textContent = appVersion;
  setupNavigation();
  setupLogWeight();
  setupPhotoUpload();
  loadDashboard();
  // Optional: Comment out setupThemeToggle if not needed
  setupThemeToggle();
});

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

function renderChart(data) {
  // Chart rendering logic...
}

function setupLogWeight() {
  // Log weight logic...
}

function setupPhotoUpload() {
  const uploadBtn = document.getElementById("upload-photo-btn");
  uploadBtn.addEventListener("click", () => {
    const file = document.getElementById("photo-upload").files[0];
    const description = document.getElementById("photo-description").value;

    if (!file) {
      alert("Please select a photo to upload.");
      return;
    }

    const photoUrl = URL.createObjectURL(file);
    const photos = JSON.parse(localStorage.getItem("photos")) || [];
    photos.push({
      date: new Date().toISOString().split("T")[0],
      src: photoUrl,
      description,
    });
    localStorage.setItem("photos", JSON.stringify(photos));
    alert("Photo uploaded successfully!");
    updatePhotoGallery();
  });
}

function setupThemeToggle() {
  const themeBtn = document.getElementById("theme-toggle-btn");
  if (!themeBtn) return; // Skip if button doesn't exist

  themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
  });
}

function updatePhotoGallery() {
  // Update gallery logic...
}
