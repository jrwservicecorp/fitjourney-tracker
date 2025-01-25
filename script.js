import { FilerobotImageEditor } from 'https://cdn.scaleflex.it/plugins/filerobot-image-editor/3.15.0/filerobot-image-editor.min.js';

const appVersion = "v3.8";

let chartInstance = null;
let photoPage = 0;

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("app-version").textContent = appVersion;

  setupWeightLogging();
  setupPhotoUpload();
  renderChart();
  updateSummary();
  loadPhotos();
  loadRecentWeighins();
  setupPhotoEditor();
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

    renderChart();
    updateSummary();
    loadRecentWeighins();
  });
}

/* ================================
    Photo Editor
================================ */
function setupPhotoEditor() {
  const photoEditor = new FilerobotImageEditor('#image-editor-container', {
    tools: ['adjust', 'filters', 'crop', 'text', 'export'],
    cropPresets: [
      { label: 'Instagram Square', value: 1 },
      { label: 'Instagram Portrait', value: 4 / 5 },
      { label: 'Instagram Landscape', value: 16 / 9 },
    ],
  });

  document.getElementById('edit-photo-btn').addEventListener('click', () => {
    const selectedPhoto = 'path/to/selected/photo.jpg'; // Replace with selected photo logic
    photoEditor.open(selectedPhoto);
  });
}

/* ================================
    Chart Rendering
================================ */
function renderChart() {
  const progressData = JSON.parse(localStorage.getItem("progressData")) || [];
  const ctx = document.getElementById("weight-chart").getContext("2d");

  if (chartInstance) {
    chartInstance.destroy();
  }

  if (progressData.length === 0) {
    document.getElementById("chart-placeholder").textContent = "No data available.";
    return;
  }

  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: progressData.map((entry) => entry.date),
      datasets: [
        {
          label: "Weight",
          data: progressData.map((entry) => entry.weight),
          backgroundColor: "rgba(52, 152, 219, 0.4)",
          borderColor: "#3498db",
          borderWidth: 3,
          pointRadius: 6,
          pointBackgroundColor: "#ffffff",
          pointBorderColor: "#3498db",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          labels: {
            color: "#ffffff",
          },
        },
      },
      scales: {
        x: { ticks: { color: "#ffffff" } },
        y: { ticks: { color: "#ffffff" } },
      },
    },
  });
}
