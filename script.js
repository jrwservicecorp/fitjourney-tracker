/* Updated JavaScript for FitJourney Tracker v2.63 */
const appVersion = "v2.63";

let chartInstance = null;

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("app-version").textContent = appVersion;
  setupNavigation();
  setupWeightLogging();
  setupPhotoUpload();
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
  const progressData = JSON.parse(localStorage.getItem("progressData")) || [];

  if (progressData.length > 0) {
    document.getElementById("chart-placeholder").style.display = "none";
    renderChart(progressData);
    updateSummary(progressData);
    calculateMilestones(progressData);
  } else {
    document.getElementById("chart-placeholder").style.display = "block";
    updateSummary([]);
    renderChart(getPlaceholderData());
  }

  updatePhotoGallery();
  updateTimeline(progressData);
}

function renderChart(data) {
  const ctx = document.getElementById("weight-chart").getContext("2d");

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: data.map((entry) => entry.date),
      datasets: [
        {
          label: "Weight (lbs)",
          data: data.map((entry) => entry.weight),
          borderColor: "#ff6f61",
          backgroundColor: "rgba(255, 111, 97, 0.2)",
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        tooltip: {
          enabled: true,
        },
      },
      scales: {
        x: {
          grid: {
            color: "#cccccc",
          },
        },
        y: {
          grid: {
            color: "#cccccc",
          },
          beginAtZero: true,
        },
      },
    },
  });
}

function getPlaceholderData() {
  const today = new Date();
  const placeholderDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - i));
    return date.toISOString().split("T")[0];
  });

  const placeholderWeights = [150, 152, 151, 153, 150, 148, 149];

  return placeholderDates.map((date, index) => ({
    date,
    weight: placeholderWeights[index],
  }));
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
    <p><span class='label'>Average Weight:</span> ${average} lbs</p>
    <p><span class='label'>Highest Weight:</span> ${max} lbs</p>
    <p><span class='label'>Lowest Weight:</span> ${min} lbs</p>
  `;
}

function calculateMilestones(data) {
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

function setupPhotoUpload() {
  const uploadBtn = document.getElementById("upload-photo-btn");
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

function updatePhotoGallery() {
  const photos = JSON.parse(localStorage.getItem("photos")) || [];
  const gallery = document.getElementById("photo-gallery");
  gallery.innerHTML = "";

  if (photos.length === 0) {
    gallery.innerHTML = '<p class="placeholder">No photos uploaded yet. Start uploading to see your progress!</p>';
    return;
  }

  photos.forEach((photo) => {
    const photoEntry = document.createElement("div");
    photoEntry.innerHTML = `
      <img src="${photo.src}" alt="Progress Photo" title="${photo.date}">
      <p>${photo.date}</p>
      <p>${photo.description || ""}</p>
    `;
    gallery.appendChild(photoEntry);
  });
}

function updateTimeline(data) {
  const timelineContainer = document.getElementById("timeline-section");
  if (!timelineContainer) return;

  timelineContainer.innerHTML = data
    .map(
      (entry) => `
    <div>
      <p><span class='label'>${entry.date}:</span> ${entry.weight} lbs</p>
    </div>
  `
    )
    .join("");
}
