const appVersion = "v5.6";

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

  // Initialize all components
  setupWeightLogging();
  setupPhotoUpload();
  await waitForFilerobot(); // Wait for Filerobot to load
  setupPhotoEditor();

  // Load chart and other components
  loadChartWithDemoData(); // Ensure demo data renders initially
  updateSummary();
  loadPhotos();
  loadRecentWeighins();
});

/* ================================
    Chart Initialization
================================ */
function loadChartWithDemoData() {
  console.log("Loading chart with demo data...");
  const progressData = JSON.parse(localStorage.getItem("progressData")) || [];
  console.log("User data:", progressData);

  if (progressData.length === 0 && demoData.length === 0) {
    console.log("No data available for chart. Displaying placeholder.");
    displayChartPlaceholder();
    return;
  }

  // Render chart with demo and user data
  renderChart(demoData, progressData);
}

function renderChart(demoData = [], userData = []) {
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

  console.log("Rendering chart with data:", { labels, demoWeights, userWeights });

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

function displayChartPlaceholder() {
  const canvas = document.getElementById("weight-chart");
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "16px Arial";
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.fillText("No data available. Log your weight to get started!", canvas.width / 2, canvas.height / 2);
}

/* ================================
    Weight Logging
================================ */
function setupWeightLogging() {
  const weightForm = document.getElementById("weight-form");

  if (!weightForm) {
    console.error("Weight form not found. Skipping setupWeightLogging.");
    return;
  }

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

    renderChart(demoData, progressData); // Update chart with demo and user data
    updateSummary();
    loadRecentWeighins();
  });
}

/* ================================
    Summary Update
================================ */
function updateSummary() {
  console.log("Updating weight summary...");
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
  console.log("Loading recent weigh-ins...");
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
