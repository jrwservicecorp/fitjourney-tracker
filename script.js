/* Consolidated JavaScript for FitJourney Tracker v2.85c */

const appVersion = "v2.85";

let chartInstance = null;
let photoPage = 0; // For gallery pagination

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("app-version").textContent = appVersion;

  setupNavigation();
  setupWeightLogging();
  setupPhotoUpload();
  setupPhotoComparison();
  setupPhotoPagination();
  setupTimelineExpansion();
  setupChartFilters();

  loadDashboard();
  equalizeHeights();
});

/* ================================
    Navigation and Page Toggling
================================ */
function setupNavigation() {
  const links = document.querySelectorAll(".navbar a");
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      navigateTo(link.getAttribute("data-page"));
    });
  });
}

function navigateTo(pageId) {
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.toggle("hidden", page.id !== pageId);
  });

  if (pageId === "dashboard") {
    loadDashboard();
  }
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
    Chart Rendering and Filters
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

function setupChartFilters() {
  const filterButtons = document.querySelectorAll(".chart-filters button");
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.getAttribute("data-filter");
      if (filter === "7") {
        loadChartData(7);
      } else if (filter === "30") {
        loadChartData(30);
      } else if (filter === "custom") {
        const range = prompt("Enter the number of days for the custom range:");
        if (range) {
          loadChartData(parseInt(range));
        }
      }
    });
  });
}

function loadChartData(days) {
  const progressData = JSON.parse(localStorage.getItem("progressData")) || getSampleData();
  const filteredData = progressData.slice(-days);
  console.log(`Filtered chart data for last ${days} days:`, filteredData);
  renderChart(filteredData, false);
}

/* ================================
    Summary, Timeline, Milestones
================================ */
function updateSummary(data) {
  const summaryContainer = document.getElementById("weight-summary");
  if (!summaryContainer) return;

  if (data.length === 0) {
    summaryContainer.innerHTML = "<p class='placeholder'>No data available for summary.</p>";
    return;
  }

  const weights = data.map((entry) => entry.weight);
  const sum = weights.reduce((acc, w) => acc + w, 0);
  const averageVal = Math.round(sum / weights.length);
  const maxVal = Math.round(Math.max(...weights));
  const minVal = Math.round(Math.min(...weights));

  console.log("Summary data:", { averageVal, maxVal, minVal });
  summaryContainer.innerHTML = `
    <p><strong>Average Weight:</strong> ${averageVal} lbs</p>
    <p><strong>Highest Weight:</strong> ${maxVal} lbs</p>
    <p><strong>Lowest Weight:</strong> ${minVal} lbs</p>
  `;
  equalizeHeights();
}

function updateTimeline(data) {
  const timelineContainer = document.getElementById("timeline-section");
  if (!timelineContainer) return;

  if (data.length === 0) {
    timelineContainer.innerHTML =
      '<p class="placeholder">No timeline data yet. Start logging your weight to see it here!</p>';
    return;
  }

  const limitedData = data.slice(-7);
  console.log("Timeline data:", limitedData);
  timelineContainer.innerHTML = limitedData
    .map((entry) => `<p>${entry.date} - ${Math.round(entry.weight)} lbs</p>`)
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
