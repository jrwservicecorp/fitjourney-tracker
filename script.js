const appVersion = "v7.13";

// Global variables
let chartInstance = null;

window.addEventListener("DOMContentLoaded", () => {
  console.log("Document fully loaded. Initializing FitJourney Tracker...");
  document.getElementById("app-version").textContent = appVersion;

  setupChart();
  setupWeightLogging();
  setupPhotoUpload();
  setupPhotoComparison();
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

  if (!weightForm) {
    console.error("Weight logging form not found!");
    return;
  }

  weightForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const weight = parseFloat(document.getElementById("weight-input").value);
    const date = document.getElementById("date-input").value;

    if (!weight || !date) {
      alert("Please enter valid weight and date.");
      return;
    }

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
    Photo Upload
================================ */
function setupPhotoUpload() {
  const photoForm = document.getElementById("photo-upload-form");

  if (!photoForm) {
    console.error("Photo upload form not found!");
    return;
  }

  photoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const fileInput = document.getElementById("photo-upload");
    const dateInput = document.getElementById("photo-date");

    const file = fileInput.files[0];
    const date = dateInput.value;

    if (!file || !date) {
      alert("Please complete all fields.");
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const photos = JSON.parse(localStorage.getItem("photos")) || [];
      photos.push({ date, src: e.target.result });
      try {
        localStorage.setItem("photos", JSON.stringify(photos));
        loadPhotos();
      } catch (err) {
        console.error("QuotaExceededError: Cannot save photo to localStorage.", err);
        alert("Storage limit exceeded. Try removing older photos.");
      }
    };

    reader.onerror = () => {
      alert("Error uploading photo.");
    };

    reader.readAsDataURL(file);
  });
}

function loadPhotos() {
  const gallery = document.getElementById("photo-gallery");
  const photoSelect1 = document.getElementById("photo-select-1");
  const photoSelect2 = document.getElementById("photo-select-2");
  const photos = JSON.parse(localStorage.getItem("photos")) || [];

  gallery.innerHTML = photos
    .map((photo) => `
      <div class="photo-item">
        <img src="${photo.src}" alt="Progress Photo">
        <p>${photo.date}</p>
      </div>
    `)
    .join("");

  photoSelect1.innerHTML = photos.map((photo) => `<option value="${photo.src}">${photo.date}</option>`).join("");
  photoSelect2.innerHTML = photoSelect1.innerHTML;
}

/* ================================
    Photo Comparison
================================ */
function setupPhotoComparison() {
  const compareButton = document.getElementById("compare-photos-btn");

  compareButton.addEventListener("click", () => {
    const photo1 = document.getElementById("photo-select-1").value;
    const photo2 = document.getElementById("photo-select-2").value;

    if (!photo1 || !photo2) {
      alert("Please select two photos for comparison.");
      return;
    }

    document.getElementById("side-by-side-comparison").innerHTML = `
      <img src="${photo1}" alt="Before">
      <img src="${photo2}" alt="After">
    `;
  });
}

/* ================================
    Export Options
================================ */
function setupExportOptions() {
  const exportPhotoButton = document.getElementById("export-photo-btn");
  const exportComparisonButton = document.getElementById("export-comparison-btn");

  exportPhotoButton.addEventListener("click", () => {
    const photo = document.getElementById("photo-select-1").value;

    if (!photo) {
      alert("Please select a photo to export.");
      return;
    }

    const link = document.createElement("a");
    link.href = photo;
    link.download = "photo-export.jpg";
    link.click();
  });

  exportComparisonButton.addEventListener("click", () => {
    const comparison = document.getElementById("side-by-side-comparison");

    if (!comparison.innerHTML) {
      alert("Please compare two photos before exporting.");
      return;
    }

    alert("Exporting comparison feature coming soon!");
  });
}
