const appVersion = "v6.8";

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
  setupPhotoComparison();
  setupChartOptions();
  setupStreakOptions();

  console.log("Rendering initial chart...");
  renderChart(demoData, [], true);
  loadPhotos(); // Load photo gallery
});

/* ================================
    Chart Rendering
================================ */
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
    data: { 
      labels: [...demoData.map((d) => d.date), ...userData.map((u) => u.date)], 
      datasets 
    },
  });
}

/* ================================
    Weight Logging
================================ */
function setupWeightLogging() {
  const weightForm = document.getElementById("weight-form");

  if (!weightForm) {
    console.error("Weight form not found. Skipping weight logging setup.");
    return;
  }

  weightForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const weight = parseFloat(document.getElementById("weight-input").value);
    const date = document.getElementById("date-input").value;

    if (!weight || !date) {
      alert("Please enter valid weight and date.");
      return;
    }

    const progressData = JSON.parse(localStorage.getItem("progressData")) || [];
    progressData.push({ weight, date });
    localStorage.setItem("progressData", JSON.stringify(progressData));

    console.log("Weight logged:", { weight, date });

    const showDemoData = document.getElementById("toggle-demo-data").checked;
    renderChart(demoData, progressData, showDemoData);
    updateStreaks(progressData);
  });
}

/* ================================
    Streak Awards
================================ */
function setupStreakOptions() {
  const streakToggle = document.getElementById("toggle-streaks");

  streakToggle.addEventListener("change", () => {
    const showStreaks = streakToggle.checked;
    const streaksSection = document.getElementById("streaks-section");

    if (showStreaks) {
      streaksSection.innerHTML = `
        <p>🏆 7-day logging streak achieved!</p>
        <p>🔥 30-day logging streak achieved!</p>
      `;
    } else {
      streaksSection.innerHTML = "<p>Streaks are hidden. Enable streaks to see awards.</p>";
    }
  });
}

function updateStreaks(progressData) {
  const streaksSection = document.getElementById("streaks-section");
  const streakLength = progressData.length;

  if (streakLength >= 7) {
    streaksSection.innerHTML = "<p>🏆 7-day logging streak achieved!</p>";
  }
  if (streakLength >= 30) {
    streaksSection.innerHTML += "<p>🔥 30-day logging streak achieved!</p>";
  }
}

/* ================================
    Chart Options
================================ */
function setupChartOptions() {
  const demoToggle = document.getElementById("toggle-demo-data");

  demoToggle.addEventListener("change", () => {
    const showDemo = demoToggle.checked;
    const progressData = JSON.parse(localStorage.getItem("progressData")) || [];
    renderChart(demoData, progressData, showDemo);
  });
}

/* ================================
    Photo Comparison
================================ */
function setupPhotoComparison() {
  document.getElementById("compare-photos-btn").addEventListener("click", () => {
    const photo1 = document.getElementById("photo-select-1").value;
    const photo2 = document.getElementById("photo-select-2").value;

    if (!photo1 || !photo2) {
      alert("Please select two photos for comparison.");
      return;
    }

    document.getElementById("side-by-side-comparison").innerHTML = `
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

/* ================================
    Photo Gallery
================================ */
function loadPhotos() {
  const photoGallery = document.getElementById("photo-gallery");
  const photos = JSON.parse(localStorage.getItem("photos")) || [];

  if (photos.length === 0) {
    photoGallery.innerHTML = "<p class='placeholder'>No photos uploaded yet.</p>";
    return;
  }

  photoGallery.innerHTML = photos
    .map((photo) => `<img src="${photo.src}" alt="Photo">`)
    .join("");

  const photoSelect1 = document.getElementById("photo-select-1");
  const photoSelect2 = document.getElementById("photo-select-2");

  photoSelect1.innerHTML = photos
    .map((photo, index) => `<option value="${photo.src}">Photo ${index + 1}</option>`)
    .join("");

  photoSelect2.innerHTML = photos
    .map((photo, index) => `<option value="${photo.src}">Photo ${index + 1}</option>`)
    .join("");
}
