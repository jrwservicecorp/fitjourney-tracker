const appVersion = "v6.9";

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
  setupExportOptions();

  console.log("Rendering initial chart...");
  renderChart(demoData, [], true);
  loadPhotos(); // Load photo gallery
});

/* Chart Rendering */
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

/* Weight Logging */
function setupWeightLogging() {
  const weightForm = document.getElementById("weight-form");

  weightForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const weight = parseFloat(document.getElementById("weight-input").value);
    const date = document.getElementById("date-input").value;

    const progressData = JSON.parse(localStorage.getItem("progressData")) || [];
    progressData.push({ weight, date });
    localStorage.setItem("progressData", JSON.stringify(progressData));

    const showDemo = document.getElementById("toggle-demo-data").checked;
    renderChart(demoData, progressData, showDemo);
  });
}

/* Chart Options */
function setupChartOptions() {
  document.getElementById("toggle-demo-data").addEventListener("change", () => {
    const showDemo = document.getElementById("toggle-demo-data").checked;
    const progressData = JSON.parse(localStorage.getItem("progressData")) || [];
    renderChart(demoData, progressData, showDemo);
  });
}

/* Export Options */
function setupExportOptions() {
  const imageEditor = FilerobotImageEditor.create('#image-editor-container', {
    theme: { colors: { primary: '#3498db', secondary: '#1c1c1c', text: '#ffffff' } },
    tools: ['export'],
  });

  document.getElementById("export-photo-with-data").addEventListener("click", () => {
    imageEditor.open({ imageSrc: 'path-to-photo.jpg' });
  });

  document.getElementById("export-data-only").addEventListener("click", () => {
    const data = { weight: '200 lbs', date: 'Jan 2025', milestones: '10 lbs lost' };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'progress-data.json';
    link.click();
  });
}

/* Photo Comparison */
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

/* Photo Gallery */
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
