const appVersion = "v6.9";

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

  setupWeightLogging();
  setupPhotoComparison();
  setupChartOptions();

  // Ensure the chart renders demo data on load
  console.log("Rendering chart with demo data on page load...");
  renderChart(demoData, [], true);

  setupExportOptions(); // Ensure Filerobot integration is handled after initialization
});

/* Chart Rendering */
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
      datasets 
    },
  });
}

/* Weight Logging */
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
  });
}

/* Chart Options */
function setupChartOptions() {
  document.getElementById("toggle-demo-data").addEventListener("change", () => {
    const showDemo = document.getElementById("toggle-demo-data").checked;
    const progressData = JSON.parse(localStorage.getItem("progressData")) || [];
    renderChart(demoData, progressData, showDemo);
  });
}

/* Export Options */
function setupExportOptions() {
  if (typeof FilerobotImageEditor === "undefined") {
    console.error("Filerobot Image Editor is not loaded.");
    return;
  }

  const imageEditor = FilerobotImageEditor.create('#image-editor-container', {
    theme: { colors: { primary: '#3498db', secondary: '#1c1c1c', text: '#ffffff' } },
    tools: ['export'],
  });

  document.getElementById("export-photo-with-data").addEventListener("click", () => {
    imageEditor.open({ imageSrc: 'path-to-photo.jpg' });
  });
}
