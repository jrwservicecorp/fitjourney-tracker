/* Updated JavaScript for FitJourney Tracker v2.71 */

const appVersion = "v2.71";

let chartInstance = null;

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("app-version").textContent = appVersion;
  setupNavigation();
  setupWeightLogging();
  setupPhotoUpload();
  setupPhotoComparison();
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

      // Save photo to localStorage
      const photos = JSON.parse(localStorage.getItem("photos")) || [];
      photos.push({
        date: new Date().toISOString().split("T")[0],
        src: photoDataUrl, // Base64 URL
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
  const select1 = document.getElementById("photo-select-1");
  const select2 = document.getElementById("photo-select-2");
  gallery.innerHTML = ""; // Clear the gallery before updating
  select1.innerHTML = ""; // Clear photo select options
  select2.innerHTML = "";

  if (photos.length === 0) {
    gallery.innerHTML = '<p class="placeholder">No photos uploaded yet. Start uploading to see your progress!</p>';
    return;
  }

  photos.forEach((photo, index) => {
    const optionHTML = `<option value="${photo.src}">${photo.date}</option>`;
    select1.innerHTML += optionHTML;
    select2.innerHTML += optionHTML;

    gallery.innerHTML += `
      <div>
        <img src="${photo.src}" alt="Progress Photo" title="${photo.date}">
        <p>${photo.date}</p>
        <p>${photo.description || ""}</p>
      </div>
    `;
  });
}

function setupPhotoComparison() {
  const compareBtn = document.getElementById("compare-photos-btn");
  if (!compareBtn) return;

  compareBtn.addEventListener("click", () => {
    const select1 = document.getElementById("photo-select-1");
    const select2 = document.getElementById("photo-select-2");
    const comparisonContainer = document.getElementById("photo-comparison");

    const photo1 = select1.value;
    const photo2 = select2.value;

    if (!photo1 || !photo2) {
      alert("Please select two photos to compare.");
      return;
    }

    comparisonContainer.innerHTML = `
      <div>
        <h4>Photo 1</h4>
        <img src="${photo1}" alt="Photo 1">
      </div>
      <div>
        <h4>Photo 2</h4>
        <img src="${photo2}" alt="Photo 2">
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
