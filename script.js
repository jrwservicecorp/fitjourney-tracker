/* Updated JavaScript for FitJourney Tracker v2.77 - Sample Data Fix and Chart Readability */

const appVersion = "v2.77";

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
  loadDashboard();
});

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
}

function renderChart(data, isSample = false) {
  const ctx = document.getElementById("weight-chart").getContext("2d");

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
          backgroundColor: isSample ? "pink" : "#3498db",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          labels: {
            color: "#f5f5f5", // Improve label readability
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: "#f5f5f5", // Improve x-axis tick readability
          },
        },
        y: {
          ticks: {
            color: "#f5f5f5", // Improve y-axis tick readability
          },
        },
      },
    },
  });
}

function getSampleData() {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - i));
    return {
      date: date.toISOString().split("T")[0],
      weight: Math.random() * 20 + 180,
    };
  });
}

function setupWeightLogging() {
  const weightForm = document.getElementById("weight-form");
  if (!weightForm) return;

  weightForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const weight = parseFloat(document.getElementById("weight-input").value);
    const date = document.getElementById("date-input").value;

    if (!weight || !date) {
      alert("Please enter both weight and date.");
      return;
    }

    const progressData = JSON.parse(localStorage.getItem("progressData")) || [];
    progressData.push({ date, weight });
    localStorage.setItem("progressData", JSON.stringify(progressData));
    loadDashboard();
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
}

function updateTimeline(data) {
  const timelineContainer = document.getElementById("timeline-section");
  if (!timelineContainer) return;

  if (data.length === 0) {
    timelineContainer.innerHTML =
      '<p class="placeholder">No timeline data yet. Start logging your weight to see it here!</p>';
    return;
  }

  timelineContainer.innerHTML = data
    .map(
      (entry) => `
      <div>
        <p>${entry.date}</p>
        <p>${entry.weight.toFixed(1)} lbs</p>
      </div>
    `
    )
    .join("");
}

function setupTimelineExpansion() {
  const expandBtn = document.getElementById("expand-timeline-btn");
  if (!expandBtn) return;

  expandBtn.addEventListener("click", () => {
    const timelineSection = document.getElementById("timeline-section");
    timelineSection.classList.toggle("expanded");
    expandBtn.textContent = timelineSection.classList.contains("expanded")
      ? "Show Less"
      : "Show More";
  });
}

function setupPhotoUpload() {
  const uploadBtn = document.getElementById("upload-photo-btn");
  if (!uploadBtn) return;

  uploadBtn.addEventListener("click", () => {
    const fileInput = document.getElementById("photo-upload");
    const file = fileInput.files[0];
    const description = document.getElementById("photo-description").value;

    if (!file) {
      alert("Please select a photo to upload.");
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      const photoDataUrl = e.target.result;

      const photos = JSON.parse(localStorage.getItem("photos")) || [];
      photos.push({
        date: new Date().toISOString().split("T")[0],
        src: photoDataUrl,
        weight: getAssociatedWeight(new Date().toISOString().split("T")[0]),
        description,
      });
      localStorage.setItem("photos", JSON.stringify(photos));

      alert("Photo uploaded successfully!");
      fileInput.value = ""; // Clear the file input
      document.getElementById("photo-description").value = ""; // Clear the description
      updatePhotoGallery();
    };

    reader.readAsDataURL(file); // Convert the image file to Base64
  });
}

function getAssociatedWeight(date) {
  const progressData = JSON.parse(localStorage.getItem("progressData")) || [];
  const weightEntry = progressData.find((entry) => entry.date === date);
  return weightEntry ? weightEntry.weight : "Unknown";
}

function updatePhotoGallery() {
  const photos = JSON.parse(localStorage.getItem("photos")) || [];
  const gallery = document.getElementById("photo-gallery");
  const select1 = document.getElementById("photo-select-1");
  const select2 = document.getElementById("photo-select-2");
  gallery.innerHTML = ""; // Clear gallery
  select1.innerHTML = ""; // Clear dropdown
  select2.innerHTML = "";

  photos.forEach((photo) => {
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

function setupPhotoPagination() {
  const loadMoreBtn = document.getElementById("load-more-photos-btn");
  if (!loadMoreBtn) return;

  loadMoreBtn.addEventListener("click", () => {
    photoPage++;
    updatePhotoGallery();
  });
}

function setupPhotoComparison() {
  const compareBtn = document.getElementById("compare-photos-btn");
  if (!compareBtn) return;

  compareBtn.addEventListener("click", () => {
    const select1 = document.getElementById("photo-select-1");
    const select2 = document.getElementById("photo-select-2");
    const gallery = document.getElementById("photo-gallery");
    const comparisonContainer = document.getElementById("photo-comparison");

    const photo1 = select1.value;
    const photo2 = select2.value;

    if (!photo1 || !photo2) {
      alert("Please select two photos to compare.");
      return;
    }

    // Hide the photo gallery
    gallery.style.display = "none";

    // Show comparison view
    comparisonContainer.innerHTML = `
      <div class="comparison-container" style="display: flex; justify-content: space-between; align-items: center;">
        <div style="flex: 1; text-align: center;">
          <h4>Photo 1</h4>
          <img src="${photo1}" alt="Photo 1" style="max-width: 150px; height: auto;">
        </div>
        <div style="flex: 1; text-align: center;">
          <h4>Photo 2</h4>
          <img src="${photo2}" alt="Photo 2" style="max-width: 150px; height: auto;">
        </div>
        <div style="margin-top: 20px;">
          <textarea id="custom-text" placeholder="Add your text here..."></textarea>
          <button id="export-comparison-btn">Export</button>
        </div>
      </div>
    `;

    setupExportComparison(photo1, photo2);
  });
}

function setupExportComparison(photo1, photo2) {
  const exportBtn = document.getElementById("export-comparison-btn");
  if (!exportBtn) return;

  exportBtn.addEventListener("click", () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const customText = document.getElementById("custom-text").value;

    canvas.width = 800;
    canvas.height = 400;

    const img1 = new Image();
    const img2 = new Image();

    img1.onload = () => {
      ctx.drawImage(img1, 0, 0, 400, 400);
      img2.onload = () => {
        ctx.drawImage(img2, 400, 0, 400, 400);

        // Add custom text
        ctx.font = "20px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(customText, canvas.width / 2, 380);

        // Export the canvas
        const exportLink = document.createElement("a");
        exportLink.download = "comparison.png";
        exportLink.href = canvas.toDataURL();
        exportLink.click();
      };
      img2.src = photo2;
    };
    img1.src = photo1;
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
