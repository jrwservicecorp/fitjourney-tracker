const appVersion = "v7.25-fix3";

// Global Variables
let chartInstance = null;

// Demo Data for Chart
const demoData = [
  { date: "2023-12-01", weight: 200 },
  { date: "2023-12-02", weight: 198 },
  { date: "2023-12-03", weight: 195 },
];

// Event Listener: DOMContentLoaded
window.addEventListener("DOMContentLoaded", () => {
  console.log("Document fully loaded. Initializing FitJourney Tracker...");
  document.getElementById("app-version").textContent = appVersion;

  // Initialize modules
  setupChart();
  setupWeightLogging();
  setupPhotoUpload();
  setupPhotoComparison();
  loadPhotos();

  // Add event listeners
  document.getElementById("clear-photos-btn")?.addEventListener("click", clearPhotos);
});

/* ================================
    Chart Setup
================================ */
function setupChart() {
  ensureCanvasReady(() => {
    const storedData = JSON.parse(localStorage.getItem("progressData")) || [];
    renderChart(demoData, storedData, true);
  });

  document.getElementById("toggle-demo-data")?.addEventListener("change", () => {
    const showDemo = document.getElementById("toggle-demo-data").checked;
    const progressData = JSON.parse(localStorage.getItem("progressData")) || [];
    renderChart(demoData, progressData, showDemo);
  });
}

function ensureCanvasReady(callback) {
  const canvas = document.getElementById("weight-chart");
  if (!canvas) return;

  const interval = setInterval(() => {
    if (canvas.getContext("2d")) {
      clearInterval(interval);
      callback();
    }
  }, 50);
}

function renderChart(demoData, userData, showDemo) {
  const ctx = document.getElementById("weight-chart").getContext("2d");
  if (chartInstance) chartInstance.destroy();

  const datasets = [];
  if (showDemo) {
    datasets.push({
      label: "Demo Data",
      data: demoData.map((d) => d.weight),
      borderColor: "#e91e63",
      backgroundColor: "rgba(233, 30, 99, 0.2)",
    });
  }
  datasets.push({
    label: "User Data",
    data: userData.map((u) => u.weight),
    borderColor: "#3498db",
    backgroundColor: "rgba(52, 152, 219, 0.2)",
  });

  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: [...demoData.map((d) => d.date), ...userData.map((u) => u.date)],
      datasets,
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
        },
      },
    },
  });
}

/* ================================
    Photo Upload
================================ */
function setupPhotoUpload() {
  const photoForm = document.getElementById("photo-upload-form");
  if (!photoForm) return;

  photoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const fileInput = document.getElementById("photo-upload");
    const dateInput = document.getElementById("photo-date");

    if (!fileInput.files[0] || !dateInput.value) {
      alert("Please provide a photo and a date.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const photos = JSON.parse(localStorage.getItem("photos")) || [];
      photos.push({ src: reader.result, date: dateInput.value });
      localStorage.setItem("photos", JSON.stringify(photos));
      loadPhotos();
    };

    reader.readAsDataURL(fileInput.files[0]);
  });
}

/* ================================
    Photo Gallery
================================ */
function loadPhotos() {
  const gallery = document.getElementById("photo-gallery");
  const photos = JSON.parse(localStorage.getItem("photos")) || [];

  // Clear the gallery before adding new elements
  gallery.innerHTML = "";

  if (!photos.length) {
    gallery.innerHTML = "<p class='placeholder'>No photos uploaded yet.</p>";
    return;
  }

  gallery.innerHTML = photos
    .map(
      (photo, index) => `
      <div class="photo-item">
        <img src="${photo.src}" alt="Progress Photo">
        <p>${photo.date}</p>
        <button class="delete-photo-btn" data-index="${index}">Delete</button>
      </div>
    `
    )
    .join("");

  document.querySelectorAll(".delete-photo-btn").forEach((btn) =>
    btn.addEventListener("click", (e) => {
      const index = e.target.getAttribute("data-index");
      deletePhoto(index);
    })
  );
}

function deletePhoto(index) {
  const photos = JSON.parse(localStorage.getItem("photos")) || [];
  photos.splice(index, 1);
  localStorage.setItem("photos", JSON.stringify(photos));
  loadPhotos();
}

function clearPhotos() {
  localStorage.removeItem("photos");
  loadPhotos();
}
