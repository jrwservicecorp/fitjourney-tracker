const appVersion = "v6.7";

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
  setupChartOptions();
  setupStreakOptions();

  console.log("Rendering initial chart...");
  renderChart(demoData, [], true);
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
    data: { labels: [...demoData.map((d) => d.date), ...userData.map((u) => u.date)], datasets },
  });
}

/* Weight Logging */
function setupWeightLogging() {
  document.getElementById("weight-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const weight = parseFloat(document.getElementById("weight-input").value);
    const date = document.getElementById("date-input").value;

    const progressData = JSON.parse(localStorage.getItem("progressData")) || [];
    progressData.push({ weight, date });
    localStorage.setItem("progressData", JSON.stringify(progressData));

    const showDemoData = document.getElementById("toggle-demo-data").checked;
    renderChart(demoData, progressData, showDemoData);
  });
}

/* Chart Options */
function setupChartOptions() {
  document.getElementById("toggle-demo-data").addEventListener("change", () => {
    const showDemoData = document.getElementById("toggle-demo-data").checked;
    const progressData = JSON.parse(localStorage.getItem("progressData")) || [];
    renderChart(demoData, progressData, showDemoData);
  });
}

/* Streak Options */
function setupStreakOptions() {
  document.getElementById("toggle-streaks").addEventListener("change", () => {
    const showStreaks = document.getElementById("toggle-streaks").checked;
    const streaksSection = document.getElementById("streaks-section");

    if (showStreaks) {
      streaksSection.innerHTML = `
        <p>🏆 7-day logging streak!</p>
        <p>🔥 30-day logging streak!</p>
      `;
    } else {
      streaksSection.innerHTML = "<p>Streaks are hidden. Enable them to see awards.</p>";
    }
  });
}
