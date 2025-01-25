const appVersion = "v4.7";

let chartInstance = null;
let photoPage = 0;

// Demo Data
const demoData = [
  { date: "2023-12-01", weight: 200 },
  { date: "2023-12-02", weight: 198 },
  { date: "2023-12-03", weight: 195 },
];

window.addEventListener("DOMContentLoaded", () => {
  console.log("Initializing FitJourney Tracker...");
  document.getElementById("app-version").textContent = appVersion;

  setupWeightLogging();
  setupPhotoUpload();
  setupPhotoEditor(); // Ensure Filerobot is properly loaded
  loadChartWithDemoData(); // Load demo data on page load
  updateSummary();
  loadPhotos();
  loadRecentWeighins();
});

/* ================================
    Weight Logging
================================ */
function setupWeightLogging() {
  const weightForm = document.getElementById("weight-form");

  weightForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const weightInput = document.getElementById("weight-input").value;
    const dateInput = document.getElementById("date-input").value;

    if (!weightInput || !dateInput) {
      alert("Please enter a valid weight and date.");
      return;
    }

    const progressData = JSON.parse(localStorage.getItem("progressData")) || [];
    progressData.push({ date: dateInput, weight: parseFloat(weightInput) });

    localStorage.setItem("progressData", JSON.stringify(progressData));
    alert("Weight logged successfully!");

    console.log("User logged weight:", { date: dateInput, weight: parseFloat(weightInput) });

    renderChart();
    updateSummary();
    loadRecentWeighins();
  });
}

/* ================================
    Chart Rendering with Demo Data
================================ */
function loadChartWithDemoData() {
  console.log("Loading chart with demo data...");
  const progressData = JSON.parse(localStorage.getItem("progressData")) || [];
  console.log("User data:", progressData);
  renderChart(demoData, progressData); // Combine demo and user data
}

function renderChart(demoData = [], userData = []) {
  const ctx = document.getElementById("weight-chart").getContext("2d");

  if (!ctx) {
    console.error("Chart canvas not found!");
    return;
  }

  if (chartInstance) {
    chartInstance.destroy();
  }

  const labels = [
    ...demoData.map((d) => d.date),
    ...userData.map((u) => u.date),
  ];

  const demoWeights = demoData.map((d) => d.weight);
  const userWeights = userData.map((u) => u.weight);

  console.log("Rendering chart with data:", { labels, demoWeights, userWeights });

  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Demo Data",
          data: demoWeights,
          borderColor: "#3498db",
          backgroundColor: "rgba(52, 152, 219, 0.2)",
          borderWidth: 2,
          pointRadius: 4,
        },
        {
          label: "User Data",
          data: userWeights,
          borderColor: "#e91e63",
          backgroundColor: "rgba(233, 30, 99, 0.2)",
          borderWidth: 2,
          pointRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          labels: { color: "#ffffff" },
        },
      },
      scales: {
        x: { ticks: { color: "#ffffff" } },
        y: { ticks: { color: "#ffffff" } },
      },
    },
  });
  console.log("Chart rendered successfully.");
}

/* ================================
    Summary Update
================================ */
function updateSummary() {
  const progressData = JSON.parse(localStorage.getItem("progressData")) || [];
  const summaryContainer = document.getElementById("weight-summary");

  if (progressData.length === 0) {
    summaryContainer.innerHTML = "<p class='placeholder'>No data available for summary.</p>";
    return;
  }

  const weights = progressData.map((entry) => entry.weight);
  const average = (weights.reduce((sum, w) => sum + w, 0) / weights.length).toFixed(1);
  const max = Math.max(...weights);
  const min = Math.min(...weights);

  summaryContainer.innerHTML = `
    <p><strong>Average Weight:</strong> ${average} lbs</p>
    <p><strong>Max Weight:</strong> ${max} lbs</p>
    <p><strong>Min Weight:</strong> ${min} lbs</p>
  `;
  console.log("Summary updated:", { average, max, min });
}

/* ================================
    Recent Weigh-Ins
================================ */
function loadRecentWeighins() {
  const progressData = JSON.parse(localStorage.getItem("progressData")) || [];
  const recentContainer = document.getElementById("recent-weighins");

  if (progressData.length === 0) {
    recentContainer.innerHTML = "<p class='placeholder'>No weigh-ins recorded yet.</p>";
    return;
  }

  const recentWeighins = progressData.slice(-4).reverse();
  recentContainer.innerHTML = recentWeighins
    .map((entry) => `<p>${entry.date}: ${entry.weight} lbs</p>`)
    .join("");
  console.log("Recent weigh-ins updated:", recentWeighins);
}

/* ================================
    Photo Editor
================================ */
function setupPhotoEditor() {
  if (!window.FilerobotImageEditor) {
    console.error("Filerobot Image Editor is not loaded. Skipping setup.");
    return;
  }

  const photoEditor = window.FilerobotImageEditor.create('#image-editor-container', {
    tools: ['adjust', 'filters', 'crop', 'text', 'export'],
    cropPresets: [
      { label: 'Instagram Square', value: 1 },
      { label: 'Instagram Portrait', value: 4 / 5 },
      { label: 'Instagram Landscape', value: 16 / 9 },
    ],
  });

  document.getElementById('edit-photo-btn').addEventListener('click', () => {
    const selectedPhoto = 'path/to/photo.jpg'; // Placeholder
    photoEditor.open(selectedPhoto);
  });

  console.log("Photo editor initialized.");
}

/* ================================
    Photo Upload
================================ */
function setupPhotoUpload() {
  const photoForm = document.getElementById("photo-form");

  photoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const photoInput = document.getElementById("photo-upload").files[0];
    const photoDate = document.getElementById("photo-date").value;

    if (!photoInput || !photoDate) {
      alert("Select a photo and date.");
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      const photos = JSON.parse(localStorage.getItem("photos")) || [];
      photos.push({ date: photoDate, src: e.target.result });
      localStorage.setItem("photos", JSON.stringify(photos));
      loadPhotos();
    };
    reader.readAsDataURL(photoInput);
  });
}

/* ================================
    Load Photos
================================ */
function loadPhotos() {
  const photos = JSON.parse(localStorage.getItem("photos")) || [];
  const gallery = document.getElementById("photo-gallery");

  if (photos.length === 0) {
    gallery.innerHTML = "<p class='placeholder'>No photos uploaded yet.</p>";
    return;
  }

  const photosToShow = photos.slice(photoPage * 8, photoPage * 8 + 8);
  gallery.innerHTML = photosToShow
    .map((photo) => `<div><img src="${photo.src}" alt="Photo"><p>${photo.date}</p></div>`)
    .join("");
  console.log("Photos loaded:", photosToShow);
}
