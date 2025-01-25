const appVersion = "v7.3";

let chartInstance = null;

// Demo Data
const demoData = [
  { date: "2023-12-01", weight: 200 },
  { date: "2023-12-02", weight: 198 },
  { date: "2023-12-03", weight: 195 },
];

window.addEventListener("DOMContentLoaded", () => {
  console.log("Initializing FitJourney Tracker...");
  document.getElementById("app-version").textContent = appVersion;

  setupChart();
  setupStreaks();
  setupWeightLogging();
  setupPhotoComparison();
  setupPhotoEditing();
  setupExportOptions();
  loadPhotos();
});

/* ================================
    Chart Setup
================================ */
function setupChart() {
  ensureCanvasReady(() => {
    console.log("Rendering chart with demo data on page load...");
    renderChart(demoData, [], true);
  });

  document.getElementById("toggle-demo-data").addEventListener("change", () => {
    const showDemo = document.getElementById("toggle-demo-data").checked;
    const progressData = JSON.parse(localStorage.getItem("progressData")) || [];
    renderChart(demoData, progressData, showDemo);
  });
}

function ensureCanvasReady(callback) {
  const canvas = document.getElementById("weight-chart");

  if (!canvas) {
    console.error("Chart canvas element not found!");
    return;
  }

  const interval = setInterval(() => {
    if (canvas.getContext("2d")) {
      clearInterval(interval);
      callback();
    }
  }, 50);
}

function renderChart(demoData, userData, showDemo) {
  const ctx = document.getElementById("weight-chart").getContext("2d");

  if (chartInstance) {
    chartInstance.destroy();
  }

  const datasets = [];
  if (showDemo) {
    datasets.push({
      label: "Demo Data (Pink)",
      data: demoData.map((d) => d.weight),
      borderColor: "#e91e63",
      backgroundColor: "rgba(233, 30, 99, 0.2)",
    });
  }

  datasets.push({
    label: "User Data (Blue)",
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
  });
}

/* ================================
    Weight Logging
================================ */
function setupWeightLogging() {
  const weightForm = document.getElementById("weight-form");

  weightForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const weight = parseFloat(document.getElementById("weight-input").value);
    const date = document.getElementById("date-input").value;

    const progressData = JSON.parse(localStorage.getItem("progressData")) || [];
    progressData.push({ weight, date });
    localStorage.setItem("progressData", JSON.stringify(progressData));

    const showDemo = document.getElementById("toggle-demo-data").checked;
    renderChart(demoData, progressData, showDemo);
    updateSummary(progressData);
    updateRecentWeighIns(progressData);

    document.getElementById("weight-input").value = "";
    document.getElementById("date-input").value = "";
  });
}

function updateSummary(progressData) {
  const summaryContainer = document.getElementById("weight-summary");

  if (!progressData.length) {
    summaryContainer.innerHTML = "<p class='placeholder'>No data available for summary.</p>";
    return;
  }

  const weights = progressData.map((entry) => entry.weight);
  const averageWeight = (weights.reduce((sum, w) => sum + w, 0) / weights.length).toFixed(1);
  const maxWeight = Math.max(...weights);
  const minWeight = Math.min(...weights);

  summaryContainer.innerHTML = `
    <p><strong>Average Weight:</strong> ${averageWeight} lbs</p>
    <p><strong>Highest Weight:</strong> ${maxWeight} lbs</p>
    <p><strong>Lowest Weight:</strong> ${minWeight} lbs</p>
  `;
}

function updateRecentWeighIns(progressData) {
  const recentContainer = document.getElementById("recent-weighins");

  if (!progressData.length) {
    recentContainer.innerHTML = "<p class='placeholder'>No weigh-ins recorded yet.</p>";
    return;
  }

  const recentWeighIns = progressData.slice(-4).reverse();
  recentContainer.innerHTML = recentWeighIns
    .map((entry) => `<p>${entry.date}: ${entry.weight} lbs</p>`)
    .join("");
}

/* ================================
    Photo Comparison
================================ */
function setupPhotoComparison() {
  document.getElementById("compare-photos-btn").addEventListener("click", () => {
    const photo1 = document.getElementById("photo-select-1").value;
    const photo2 = document.getElementById("photo-select-2").value;

    if (!photo1 || !photo2) {
      alert("Please select two photos for comparison.");
      return;
    }

    document.getElementById("side-by-side-comparison").innerHTML = `
      <div>
        <h4>Photo 1</h4>
        <img src="${photo1}" alt="Photo 1">
      </div>
      <div>
        <h4>Photo 2</h4>
        <img src="${photo2}" alt="Photo 2">
      </div>
    `;
  });
}

/* ================================
    Photo Editing with Filerobot
================================ */
function setupPhotoEditing() {
  const photoInput = document.getElementById("photo-upload");
  const editButton = document.getElementById("edit-photo-btn");

  const imageEditor = FilerobotImageEditor.create('#image-editor-container', {
    theme: {
      colors: {
        primary: '#3498db',
        secondary: '#1c1c1c',
        text: '#ffffff',
      },
    },
    tools: ['crop', 'adjust', 'text', 'shapes', 'export'],
  });

  editButton.addEventListener("click", () => {
    const file = photoInput.files[0];
    if (!file) {
      alert("Please select a photo first.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      imageEditor.open({ imageSrc: e.target.result });
    };
    reader.readAsDataURL(file);
  });
}

/* ================================
    Export Options
================================ */
function setupExportOptions() {
  const exportPhotoBtn = document.getElementById("export-photo-with-data");
  const exportDataBtn = document.getElementById("export-data-only");

  exportPhotoBtn.addEventListener("click", () => {
    alert("Photo with data exported (simulation).");
  });

  exportDataBtn.addEventListener("click", () => {
    const overlayData = {
      weight: '200 lbs',
      milestone: '10 lbs lost',
      progress: '50%',
    };
    const blob = new Blob([JSON.stringify(overlayData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'progress-data.json';
    link.click();
  });
}

/* ================================
    Photo Gallery
================================ */
function loadPhotos() {
  const photoGallery = document.getElementById("photo-gallery");
  const photos = JSON.parse(localStorage.getItem("photos")) || [];

  if (!photos.length) {
    photoGallery.innerHTML = "<p class='placeholder'>No photos uploaded yet.</p>";
    return;
  }

  photoGallery.innerHTML = photos
    .map((photo) => `<img src="${photo.src}" alt="Photo">`)
    .join("");

  const photoSelect1 = document.getElementById("photo-select-1");
  const photoSelect2 = document.getElementById("photo-select-2");

  photoSelect1.innerHTML = photos
    .map((photo, index) => `<option value="${photo.src}">Photo ${index + 1}</option>`)
    .join("");

  photoSelect2.innerHTML = photos
    .map((photo, index) => `<option value="${photo.src}">Photo ${index + 1}</option>`)
    .join("");
}
