/* Consolidated JavaScript for FitJourney Tracker v2.90 */

const appVersion = "v2.90";

let chartInstance = null;
let photoPage = 0; // For gallery pagination

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("app-version").textContent = appVersion;

  // Initialize all setup functions
  setupNavigation();
  setupWeightLogging(); // Fully defined and properly called
  setupPhotoUpload();
  setupPhotoComparison();
  setupPhotoPagination();
  setupTimelineExpansion();
  setupChartFilters();

  loadDashboard();
  equalizeHeights();
});

/* ================================
    Weight Logging
================================ */
function setupWeightLogging() {
  const weightForm = document.getElementById("weight-form");
  if (!weightForm) {
    console.warn("Weight form not found!");
    return;
  }

  weightForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const weightInput = document.getElementById("weight-input");
    const dateInput = document.getElementById("date-input");

    const weight = parseFloat(weightInput.value);
    const date = dateInput.value;

    if (!weight || !date) {
      alert("Please enter a valid weight and date.");
      return;
    }

    const progressData = JSON.parse(localStorage.getItem("progressData")) || [];
    progressData.push({ date, weight });

    localStorage.setItem("progressData", JSON.stringify(progressData));

    // Reset the form inputs
    weightInput.value = "";
    dateInput.value = "";

    alert("Weight logged successfully!");
    loadDashboard(); // Reload the dashboard to reflect the new data
  });
}

/* ================================
    Chart Rendering
================================ */
function renderChart(data, isSample = false) {
  const ctx = document.getElementById("weight-chart")?.getContext("2d");
  if (!ctx) {
    console.error("Chart container not found!");
    return;
  }

  if (chartInstance) {
    chartInstance.destroy();
  }

  console.log("Rendering chart with data:", data);
  if (!data || data.length === 0) {
    console.warn("No data available to render chart.");
    document.getElementById("chart-placeholder").textContent = "No data available to display.";
    return;
  }

  chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: data.map((entry) => entry.date),
      datasets: [
        {
          label: isSample ? "Sample Data" : "User Data",
          data: data.map((entry) => entry.weight),
          backgroundColor: data.map(() => (isSample ? "pink" : "#3498db")),
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          labels: {
            color: "#f5f5f5",
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: "#f5f5f5",
          },
        },
        y: {
          ticks: {
            color: "#f5f5f5",
          },
        },
      },
    },
  });
}

/* ================================
    Dashboard Loading
================================ */
function loadDashboard() {
  const progressData = JSON.parse(localStorage.getItem("progressData")) || getSampleData();
  console.log("Loaded progress data:", progressData);

  renderChart(progressData, !localStorage.getItem("progressData"));
  updateSummary(progressData);
  updateTimeline(progressData);
  updatePhotoGallery();
  updateMilestones(progressData);
  equalizeHeights();
}

/* ================================
    Summary Updates
================================ */
function updateSummary(data) {
  const summaryContainer = document.getElementById("weight-summary");
  if (!summaryContainer) return;

  if (data.length === 0) {
    summaryContainer.innerHTML = "<p class='placeholder'>No data available for summary.</p>";
    return;
  }

  const weights = data.map((entry) => entry.weight);
  const averageVal = Math.round(weights.reduce((acc, w) => acc + w, 0) / weights.length);
  const maxVal = Math.max(...weights);
  const minVal = Math.min(...weights);

  summaryContainer.innerHTML = `
    <p><strong>Average Weight:</strong> ${averageVal} lbs</p>
    <p><strong>Highest Weight:</strong> ${maxVal} lbs</p>
    <p><strong>Lowest Weight:</strong> ${minVal} lbs</p>
  `;
}

/* ================================
    Timeline Updates
================================ */
function updateTimeline(data) {
  const timelineContainer = document.getElementById("timeline-section");
  if (!timelineContainer) return;

  if (data.length === 0) {
    timelineContainer.innerHTML =
      '<p class="placeholder">No timeline data yet. Start logging your weight to see it here!</p>';
    return;
  }

  timelineContainer.innerHTML = data
    .slice(-7)
    .map((entry) => `<p>${entry.date} - ${entry.weight} lbs</p>`)
    .join("");
}

/* ================================
    Helper Functions
================================ */
function getSampleData() {
  const today = new Date();
  return Array.from({ length: 30 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    return {
      date: date.toISOString().split("T")[0],
      weight: Math.random() * 20 + 180,
    };
  });
}

function equalizeHeights() {
  const weightCheckInBox = document.querySelector(".weight-checkin");
  const otherBoxes = document.querySelectorAll(".dashboard-row .card:not(.weight-checkin)");

  if (weightCheckInBox) {
    const height = weightCheckInBox.offsetHeight;
    otherBoxes.forEach((box) => {
      box.style.height = `${height}px`;
    });
  }
}
