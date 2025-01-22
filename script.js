/* Updated JavaScript for FitJourney Tracker v2.83 */

const appVersion = "v2.83";

let chartInstance = null;
let photoPage = 0; // Pagination for photos

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("app-version").textContent = appVersion;
  setupNavigation();
  setupWeightLogging();
  setupPhotoUpload();
  setupPhotoComparison();
  setupPhotoPagination();
  setupTimelineExpansion();
  setupGoalProgress();
  setupChartFilters();
  loadDashboard();
  equalizeHeights(); // Ensure equal heights on page load
});

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

function loadDashboard() {
  const progressData = JSON.parse(localStorage.getItem("progressData")) || getSampleData();

  renderChart(progressData, !localStorage.getItem("progressData"));
  updateSummary(progressData);
  updateTimeline(progressData);
  updatePhotoGallery();
  updateMilestones(progressData);
  equalizeHeights(); // Reapply equal heights after loading content
}

function renderChart(data, isSample = false) {
  const ctx = document.getElementById("weight-chart").getContext("2d");

  if (!ctx) {
    console.error("Chart container not found!");
    return;
  }

  if (chartInstance) {
    chartInstance.destroy();
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

function updateSummary(data) {
  const summaryContainer = document.getElementById("weight-summary");
  if (!summaryContainer) return;

  if (data.length === 0) {
    summaryContainer.innerHTML = "<p class='placeholder'>No data available for summary.</p>";
    return;
  }

  const weights = data.map((entry) => entry.weight);
  const average = (weights.reduce((sum, w) => sum + w, 0) / weights.length).toFixed(2);
  const max = Math.max(...weights);
  const min = Math.min(...weights);

  summaryContainer.innerHTML = `
    <p><strong>Average Weight:</strong> ${average} lbs</p>
    <p><strong>Highest Weight:</strong> ${max} lbs</p>
    <p><strong>Lowest Weight:</strong> ${min} lbs</p>
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
  timelineContainer.innerHTML = limitedData
    .map((entry) => `<p>${entry.date} - ${Math.round(entry.weight)} lbs</p>`)
    .join("");
}

function setupTimelineExpansion() {
  const expandBtn = document.getElementById("expand-timeline-btn");
  if (!expandBtn) return;

  expandBtn.addEventListener("click", () => {
    const timelineSection = document.getElementById("timeline-section");
    const isExpanded = timelineSection.classList.toggle("expanded");

    expandBtn.textContent = isExpanded ? "Show Less" : "Show More";

    if (!isExpanded) {
      timelineSection.scrollTop = 0;
    }
  });
}

function updatePhotoGallery() {
  const photos = JSON.parse(localStorage.getItem("photos")) || [];
  const gallery = document.getElementById("photo-gallery");
  const select1 = document.getElementById("photo-select-1");
  const select2 = document.getElementById("photo-select-2");
  gallery.innerHTML = ""; // Clear gallery
  select1.innerHTML = ""; // Clear dropdown
  select2.innerHTML = "";

  photos.slice(photoPage * 4, photoPage * 4 + 4).forEach((photo) => {
    const optionHTML = `<option value="${photo.src}">${photo.date}</option>`;
    select1.innerHTML += optionHTML;
    select2.innerHTML += optionHTML;

    gallery.innerHTML += `
      <div>
        <img src="${photo.src}" alt="Progress Photo" style="max-width: 150px;">
        <p>${photo.date}</p>
        <p>${photo.weight || "Unknown Weight"} lbs</p>
      </div>
    `;
  });
}

function updateMilestones(data) {
  const milestoneContainer = document.getElementById("milestone-section");
  if (!milestoneContainer) return;

  let milestones = "";
  const totalWeightLoss = data[0].weight - data[data.length - 1].weight;

  if (totalWeightLoss >= 10) {
    milestones += "<p>🏆 Lost 10 lbs! Great job!</p>";
  }

  if (data.length >= 7) {
    milestones += "<p>🔥 7-day logging streak!</p>";
  }

  milestoneContainer.innerHTML = milestones || "<p>No milestones achieved yet. Keep going!</p>";
}

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
