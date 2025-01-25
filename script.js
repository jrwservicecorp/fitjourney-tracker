const appVersion = "v6.3";

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

  // Initialize components
  setupWeightLogging();
  setupPhotoUpload();
  await waitForFilerobot();
  setupPhotoEditor();
  setupChartOptions();

  console.log("Ensuring canvas is ready before loading chart...");
  ensureCanvasReady(() => {
    console.log("Canvas is ready. Loading chart with demo data...");
    loadChartWithDemoData(); // Ensure demo data renders
    updateSummary();
    loadRecentWeighins();
  });
});

/* ================================
    Ensure Canvas is Ready
================================ */
function ensureCanvasReady(callback) {
  const canvas = document.getElementById("weight-chart");

  if (!canvas) {
    console.error("Chart canvas element not found!");
    return;
  }

  const interval = setInterval(() => {
    if (canvas.getContext("2d")) {
      clearInterval(interval);
      callback(); // Call the provided callback once the canvas is ready
    }
  }, 50);
}

/* ================================
    Chart Initialization
================================ */
function loadChartWithDemoData() {
  console.log("Executing loadChartWithDemoData...");
  const progressData = JSON.parse(localStorage.getItem("progressData")) || [];
  console.log("Initial user data from localStorage:", progressData);

  if (progressData.length === 0) {
    console.log("No user data found. Rendering demo data only.");
    renderChart(demoData, []); // Force demo data if no user data exists
  } else {
    console.log("Rendering chart with demo and user data...");
    renderChart(demoData, progressData);
  }
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

    const showDemoData = document.getElementById("toggle-demo-data").checked;
    renderChart(showDemoData ? demoData : [], progressData); // Update chart based on toggle
    updateSummary();
    loadRecentWeighins();
  });
}
