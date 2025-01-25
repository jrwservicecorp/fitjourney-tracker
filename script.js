const appVersion = "v6.5";

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
  setupChartOptions();

  console.log("Ensuring canvas is ready before loading chart...");
  ensureCanvasReady(() => {
    console.log("Canvas is ready. Rendering chart...");
    loadChartWithDemoData(); // Load chart with both demo and user data
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

  renderChart(demoData, progressData); // Render chart with both demo and user data
}

function renderChart(demoData = [], userData = [], showDemo = true) {
  console.log("Executing renderChart...");
  console.log("Demo Data:", demoData);
  console.log("User Data:", userData);
  console.log("Show Demo Data:", showDemo);

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

  const datasets = [];

  // Add demo data only if showDemo is true
  if (showDemo) {
    datasets.push({
      label: "Demo Data (Pink)",
      data: demoData.map((d) => d.weight),
      borderColor: "#e91e63",
      backgroundColor: "rgba(233, 30, 99, 0.2)",
      borderWidth: 2,
      pointRadius: 4,
    });
  }

  // Add user data
  datasets.push({
    label: "User Data (Blue)",
    data: userData.map((u) => u.weight),
    borderColor: "#3498db",
    backgroundColor: "rgba(52, 152, 219, 0.2)",
    borderWidth: 2,
    pointRadius: 4,
  });

  console.log("Rendering chart with labels:", labels);
  console.log("Datasets:", datasets);

  try {
    chartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets,
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
    renderChart(demoData, progressData, showDemoData); // Update chart based on toggle
  });
}

/* ================================
    Chart Options
================================ */
function setupChartOptions() {
  const toggleDemoCheckbox = document.getElementById("toggle-demo-data");
  toggleDemoCheckbox.addEventListener("change", () => {
    const progressData = JSON.parse(localStorage.getItem("progressData")) || [];
    const showDemoData = toggleDemoCheckbox.checked;

    console.log("Toggling demo data:", showDemoData);
    renderChart(demoData, progressData, showDemoData); // Re-render chart based on toggle
  });
}
