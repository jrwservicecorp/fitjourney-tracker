/* JavaScript for FitJourney Tracker v2.69 */

const appVersion = "v2.69";

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
  const progressData = JSON.parse(localStorage.getItem("progressData")) || getSampleData();

  renderChart(progressData, !localStorage.getItem("progressData"));
  updateSummary(progressData);
  updateTimeline(progressData);
  updatePhotoGallery();
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
          display: false,
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
  gallery.innerHTML = ""; // Clear the gallery before updating

  if (photos.length === 0) {
    gallery.innerHTML = '<p class="placeholder">No photos uploaded yet. Start uploading to see your progress!</p>';
    return;
  }

  gallery.innerHTML = photos
    .map(
      (photo) => `
      <div>
        <img src="${photo.src}" alt="Progress Photo" title="${photo.date}">
        <p>${photo.date}</p>
        <p>${photo.description || ""}</p>
      </div>
    `
    )
    .join("");
}
