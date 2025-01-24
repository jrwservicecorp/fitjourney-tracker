/* Consolidated JavaScript for FitJourney Tracker v2.85 */

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
  timelineContainer.innerHTML = limitedData
    .map((entry) => `<p>${entry.date} - ${Math.round(entry.weight)} lbs</p>`)
    .join("");
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

/* ================================
    Photo Gallery & Comparison
================================ */
function updatePhotoGallery() {
  const photos = JSON.parse(localStorage.getItem("photos")) || [];
  const gallery = document.getElementById("photo-gallery");
  const select1 = document.getElementById("photo-select-1");
  const select2 = document.getElementById("photo-select-2");
  gallery.innerHTML = "";
  select1.innerHTML = "";
  select2.innerHTML = "";

  photos.slice(photoPage * 4, photoPage * 4 + 4).forEach((photo) => {
    const optionHTML = `<option value="${photo.src}">${photo.date}</option>`;
    select1.innerHTML += optionHTML;
    select2.innerHTML += optionHTML;

    gallery.innerHTML += `
      <div>
        <img src="${photo.src}" alt="Progress Photo" style="max-width: 150px;">
        <p>${photo.date}</p>
        <p>${photo.keywords || ""}</p>
        <p>${photo.weight || "Unknown Weight"} lbs</p>
        <p>${photo.description || ""}</p>
      </div>
    `;
  });
}

function setupPhotoPagination() {
  const loadMoreBtn = document.getElementById("load-more-photos-btn");
  if (!loadMoreBtn) return;

  loadMoreBtn.addEventListener("click", () => {
    photoPage++;
    updatePhotoGallery();
  });
}

function setupPhotoUpload() {
  const uploadBtn = document.getElementById("upload-photo-btn");
  if (!uploadBtn) return;

  uploadBtn.addEventListener("click", () => {
    const fileInput = document.getElementById("photo-upload");
    const file = fileInput.files[0];
    const photoDate = document.getElementById("photo-date").value;
    const keywords = document.getElementById("photo-keywords").value;
    const description = document.getElementById("photo-description").value;

    if (!file) {
      alert("Please select a photo to upload.");
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      const photoDataUrl = e.target.result;
      const photos = JSON.parse(localStorage.getItem("photos")) || [];

      const finalDate = photoDate || new Date().toISOString().split("T")[0];

      photos.push({
        date: finalDate,
        src: photoDataUrl,
        keywords: keywords,
        weight: getAssociatedWeight(finalDate),
        description,
      });

      localStorage.setItem("photos", JSON.stringify(photos));

      alert("Photo uploaded successfully!");
      fileInput.value = "";
      document.getElementById("photo-date").value = "";
      document.getElementById("photo-keywords").value = "";
      document.getElementById("photo-description").value = "";
      updatePhotoGallery();
    };
    reader.readAsDataURL(file);
  });
}

function setupPhotoComparison() {
  const compareBtn = document.getElementById("compare-photos-btn");
  if (!compareBtn) return;

  compareBtn.addEventListener("click", () => {
    const select1 = document.getElementById("photo-select-1");
    const select2 = document.getElementById("photo-select-2");
    const comparisonContainer = document.getElementById("side-by-side-comparison");

    const photo1Src = select1.value;
    const photo2Src = select2.value;

    if (!photo1Src || !photo2Src) {
      alert("Please select two photos to compare.");
      return;
    }

    comparisonContainer.innerHTML = `
      <div>
        <h4>Photo 1</h4>
        <img src="${photo1Src}" alt="Photo 1">
      </div>
      <div>
        <h4>Photo 2</h4>
        <img src="${photo2Src}" alt="Photo 2">
      </div>
    `;
  });

  const photos = JSON.parse(localStorage.getItem("photos")) || [];
  const select1 = document.getElementById("photo-select-1");
  const select2 = document.getElementById("photo-select-2");

  photos.forEach((photo) => {
    const optionHTML = `<option value="${photo.src}">${photo.date}</option>`;
    select1.innerHTML += optionHTML;
    select2.innerHTML += optionHTML;
  });
}

/* ================================
    Helper Functions
================================ */
function getAssociatedWeight(date) {
  const progressData = JSON.parse(localStorage.getItem("progressData")) || [];
  const weightEntry = progressData.find((entry) => entry.date === date);
  return weightEntry ? weightEntry.weight : "Unknown";
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
