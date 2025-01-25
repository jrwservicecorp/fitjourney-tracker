const appVersion = "v6.6";

let chartInstance = null;

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
  setupPhotoComparison();
  setupChartOptions();

  loadChartWithDemoData();
});

/* Chart Initialization */
function loadChartWithDemoData() {
  const progressData = JSON.parse(localStorage.getItem("progressData")) || [];
  renderChart(demoData, progressData);
}

function renderChart(demoData, userData) {
  if (chartInstance) {
    chartInstance.destroy();
  }

  const ctx = document.getElementById("weight-chart").getContext("2d");
  const datasets = [];

  if (document.getElementById("toggle-demo-data").checked) {
    datasets.push({
      label: "Demo Data (Pink)",
      data: demoData.map((d) => d.weight),
      borderColor: "#e91e63",
    });
  }

  datasets.push({
    label: "User Data (Blue)",
    data: userData.map((u) => u.weight),
    borderColor: "#3498db",
  });

  chartInstance = new Chart(ctx, {
    type: "line",
    data: { datasets },
  });
}

/* Photo Comparison */
function setupPhotoComparison() {
  document.getElementById("compare-photos-btn").addEventListener("click", () => {
    const photo1 = document.getElementById("photo-select-1").value;
    const photo2 = document.getElementById("photo-select-2").value;

    if (!photo1 || !photo2) {
      alert("Select two photos to compare!");
      return;
    }

    document.getElementById("side-by-side-comparison").innerHTML = `
      <img src="${photo1}" alt="Photo 1">
      <img src="${photo2}" alt="Photo 2">
    `;
  });
}

/* Weight Logging */
function setupWeightLogging() {
  document.getElementById("weight-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const weight = parseFloat(document.getElementById("weight-input").value);
    const date = document.getElementById("date-input").value;

    const data = JSON.parse(localStorage.getItem("progressData")) || [];
    data.push({ weight, date });
    localStorage.setItem("progressData", JSON.stringify(data));

    renderChart(demoData, data);
  });
}
