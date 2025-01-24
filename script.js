const appVersion = "v2.93-debug";

let chartInstance = null;

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("app-version").textContent = appVersion;

  setupWeightLogging();
  renderChart();
});

function setupWeightLogging() {
  const weightForm = document.getElementById("weight-form");

  if (!weightForm) {
    console.error("Weight form not found!");
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

    renderChart(); // Update the chart after logging new data
  });
}

function renderChart() {
  const progressData = JSON.parse(localStorage.getItem("progressData")) || [];
  const ctx = document.getElementById("weight-chart").getContext("2d");

  if (chartInstance) {
    chartInstance.destroy();
  }

  if (progressData.length === 0) {
    console.warn("No data available to render chart.");
    document.getElementById("chart-placeholder").textContent = "No data available.";
    return;
  }

  document.getElementById("chart-placeholder").textContent = "";

  chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: progressData.map((entry) => entry.date),
      datasets: [
        {
          label: "Weight",
          data: progressData.map((entry) => entry.weight),
          backgroundColor: "#3498db",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
        },
      },
      scales: {
        x: { ticks: { color: "#333" } },
        y: { ticks: { color: "#333" } },
      },
    },
  });
}
