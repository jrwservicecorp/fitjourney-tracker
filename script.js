const appVersion = "v5.7";

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
  await waitForFilerobot();
  setupPhotoEditor();
  setupChartOptions();

  console.log("Loading chart with demo data...");
  loadChartWithDemoData();

  updateSummary();
  loadPhotos();
  loadRecentWeighins();
});

function loadChartWithDemoData() {
  console.log("Executing loadChartWithDemoData...");
  const progressData = JSON.parse(localStorage.getItem("progressData")) || [];
  console.log("Initial user data:", progressData);

  if (progressData.length === 0 && demoData.length === 0) {
    console.log("No data available for chart. Displaying placeholder.");
    displayChartPlaceholder();
    return;
  }

  console.log("Passing data to renderChart...");
  renderChart(demoData, progressData);
}

function renderChart(demoData = [], userData = []) {
  console.log("Executing renderChart...");
  console.log("Demo Data:", demoData);
  console.log("User Data:", userData);

  const canvas = document.getElementById("weight-chart");
  if (!canvas) {
    console.error("Chart canvas element not found!");
    return;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    console.error("Failed to get 2D context for chart canvas!");
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

  console.log("Rendering chart with labels:", labels);
  console.log("Demo weights:", demoWeights);
  console.log("User weights:", userWeights);

  try {
    chartInstance = new Chart(ctx, {
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
  } catch (error) {
    console.error("Error rendering chart:", error);
  }
}
