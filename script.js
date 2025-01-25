const appVersion = "v5.2";

let chartInstance = null;
let photoPage = 0;

// Demo Data
const demoData = [
  { date: "2023-12-01", weight: 200 },
  { date: "2023-12-02", weight: 198 },
  { date: "2023-12-03", weight: 195 },
];

window.addEventListener("DOMContentLoaded", async () => {
  console.log("Initializing FitJourney Tracker...");
  document.getElementById("app-version").textContent = appVersion;

  setupWeightLogging();
  setupPhotoUpload();

  // Wait for Filerobot to load before setting up the photo editor
  await waitForFilerobot();
  setupPhotoEditor();

  loadChartWithDemoData();
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
  const ctx = document.getElementById("weight-chart");

  if (!ctx || !ctx.getContext) {
    console.error("Chart canvas not found or unsupported!");
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

  chartInstance = new Chart(ctx.getContext("2d"), {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Demo Data (Pink)",
          data: demoWeights,
          borderColor: "#e91e63",
          backgroundColor: "rgba(233, 30, 99, 0.2)",
          borderWidth: 2,
          pointRadius: 4,
        },
        {
          label: "User Data (Blue)",
          data: userWeights,
          borderColor: "#3498db",
          backgroundColor: "rgba(52, 152, 219, 0.2)",
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
    Filerobot Initialization
================================ */
async function waitForFilerobot() {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (window.FilerobotImageEditor) {
        clearInterval(interval);
        console.log("Filerobot Image Editor loaded successfully.");
        resolve();
      }
    }, 100);
  });
}

function setupPhotoEditor() {
  console.log("Setting up the photo editor...");

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
    const photos = JSON.parse(localStorage.getItem("photos")) || [];
    if (photos.length === 0) {
      alert("No photos available to edit. Please upload a photo first.");
      return;
    }

    const lastPhoto = photos[photos.length - 1]; // Edit the most recently uploaded photo
    photoEditor.open(lastPhoto.src); // Open the photo in the editor
    console.log("Opened photo for editing:", lastPhoto);
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
      photos.push({ date: photoDate, src: e.target.result }); // Save base64 data
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
