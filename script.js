const appVersion = "v7.15a";

// Global Variables
let chartInstance = null;

// Demo Data for Chart
const demoData = [
  { date: "2023-12-01", weight: 200 },
  { date: "2023-12-02", weight: 198 },
  { date: "2023-12-03", weight: 195 },
];

// Event Listener: DOMContentLoaded
window.addEventListener("DOMContentLoaded", () => {
  console.log("Document fully loaded. Initializing FitJourney Tracker...");
  document.getElementById("app-version").textContent = appVersion;

  setupChart();
  setupWeightLogging();
  setupPhotoUpload();
  setupPhotoComparison();
  setupExportTemplate();
  loadPhotos();

  document.getElementById("clear-photos-btn")?.addEventListener("click", clearPhotos);
});

/* ================================
    Chart Setup
================================ */
function setupChart() {
  ensureCanvasReady(() => {
    const storedData = JSON.parse(localStorage.getItem("progressData")) || [];
    renderChart(demoData, storedData, true);
  });

  document.getElementById("toggle-demo-data")?.addEventListener("change", () => {
    const showDemo = document.getElementById("toggle-demo-data").checked;
    const progressData = JSON.parse(localStorage.getItem("progressData")) || [];
    renderChart(demoData, progressData, showDemo);
  });
}

function ensureCanvasReady(callback) {
  const canvas = document.getElementById("weight-chart");
  if (!canvas) return;

  const interval = setInterval(() => {
    if (canvas.getContext("2d")) {
      clearInterval(interval);
      callback();
    }
  }, 50);
}

function renderChart(demoData, userData, showDemo) {
  const ctx = document.getElementById("weight-chart").getContext("2d");
  if (chartInstance) chartInstance.destroy();

  const datasets = [];
  if (showDemo) {
    datasets.push({
      label: "Demo Data",
      data: demoData.map((d) => d.weight),
      borderColor: "#e91e63",
      backgroundColor: "rgba(233, 30, 99, 0.2)",
    });
  }
  datasets.push({
    label: "User Data",
    data: userData.map((u) => u.weight),
    borderColor: "#3498db",
    backgroundColor: "rgba(52, 152, 219, 0.2)",
  });

  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: [...demoData.map((d) => d.date), ...userData.map((u) => u.date)],
      datasets,
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
        },
      },
    },
  });
}

/* ================================
    Weight Logging
================================ */
function setupWeightLogging() {
  const weightForm = document.getElementById("weight-form");
  if (!weightForm) return;

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

    const showDemo = document.getElementById("toggle-demo-data").checked;
    renderChart(demoData, progressData, showDemo);
    updateSummary(progressData);
    updateRecentWeighIns(progressData);

    document.getElementById("weight-input").value = "";
    document.getElementById("date-input").value = "";
  });
}

function updateSummary(progressData) {
  const summaryContainer = document.getElementById("weight-summary");

  if (!progressData.length) {
    summaryContainer.innerHTML = "<p class='placeholder'>No data available for summary.</p>";
    return;
  }

  const weights = progressData.map((entry) => entry.weight);
  const averageWeight = (weights.reduce((sum, w) => sum + w, 0) / weights.length).toFixed(1);
  const maxWeight = Math.max(...weights);
  const minWeight = Math.min(...weights);

  summaryContainer.innerHTML = `
    <p><strong>Average Weight:</strong> ${averageWeight} lbs</p>
    <p><strong>Highest Weight:</strong> ${maxWeight} lbs</p>
    <p><strong>Lowest Weight:</strong> ${minWeight} lbs</p>
  `;
}

function updateRecentWeighIns(progressData) {
  const recentContainer = document.getElementById("recent-weighins");

  if (!progressData.length) {
    recentContainer.innerHTML = "<p class='placeholder'>No weigh-ins recorded yet.</p>";
    return;
  }

  const recentWeighIns = progressData.slice(-4).reverse();
  recentContainer.innerHTML = recentWeighIns
    .map((entry) => `<p>${entry.date}: ${entry.weight} lbs</p>`)
    .join("");
}

/* ================================
    Photo Upload
================================ */
function setupPhotoUpload() {
  const photoForm = document.getElementById("photo-upload-form");
  if (!photoForm) return;

  photoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const fileInput = document.getElementById("photo-upload");
    const dateInput = document.getElementById("photo-date");

    const file = fileInput.files[0];
    const date = dateInput.value;

    if (!file || !date) {
      alert("Please complete all fields.");
      return;
    }

    compressImage(file, (compressedDataUrl) => {
      const photos = JSON.parse(localStorage.getItem("photos")) || [];
      photos.push({ date, src: compressedDataUrl });

      try {
        localStorage.setItem("photos", JSON.stringify(photos));
        loadPhotos();
      } catch (err) {
        console.error("QuotaExceededError: Cannot save photo to localStorage.", err);
        alert(
          "Storage limit exceeded. Please clear some photos using the 'Clear Photos' button and try again."
        );
      }
    });
  });
}

function compressImage(file, callback) {
  const reader = new FileReader();

  reader.onload = (e) => {
    const img = new Image();
    img.src = e.target.result;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const maxWidth = 800;
      const scale = maxWidth / img.width;
      canvas.width = maxWidth;
      canvas.height = img.height * scale;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.7);
      callback(compressedDataUrl);
    };
  };

  reader.onerror = () => {
    console.error("Error reading image file.");
    alert("Failed to upload the photo. Please try again.");
  };

  reader.readAsDataURL(file);
}

function loadPhotos() {
  const gallery = document.getElementById("photo-gallery");
  if (!gallery) {
    console.error("Photo gallery element not found!");
    return;
  }

  const photos = JSON.parse(localStorage.getItem("photos")) || [];

  if (!photos.length) {
    gallery.innerHTML = "<p class='placeholder'>No photos uploaded yet.</p>";
    return;
  }

  gallery.innerHTML = photos
    .map(
      (photo, index) => `
      <div class="photo-item">
        <img src="${photo.src}" alt="Progress Photo">
        <p>${photo.date}</p>
        <button class="delete-photo-btn" data-index="${index}">Delete</button>
      </div>
    `
    )
    .join("");

  const deleteButtons = document.querySelectorAll(".delete-photo-btn");
  deleteButtons.forEach((button) =>
    button.addEventListener("click", (e) => {
      const index = e.target.getAttribute("data-index");
      deletePhoto(index);
    })
  );
}

function deletePhoto(index) {
  const photos = JSON.parse(localStorage.getItem("photos")) || [];
  photos.splice(index, 1);
  localStorage.setItem("photos", JSON.stringify(photos));
  loadPhotos();
}

function clearPhotos() {
  localStorage.removeItem("photos");
  loadPhotos();
}

/* ================================
    Photo Comparison
================================ */
function setupPhotoComparison() {
  const photo1Select = document.getElementById("photo-select-1");
  const photo2Select = document.getElementById("photo-select-2");
  const compareButton = document.getElementById("prepare-share-btn");

  compareButton.addEventListener("click", () => {
    const photo1Src = photo1Select.value;
    const photo2Src = photo2Select.value;

    if (!photo1Src || !photo2Src) {
      alert("Please select two photos for comparison.");
      return;
    }

    document.getElementById("photo-1").src = photo1Src;
    document.getElementById("photo-2").src = photo2Src;

    const photos = JSON.parse(localStorage.getItem("photos")) || [];
    const photo1 = photos.find((photo) => photo.src === photo1Src);
    const photo2 = photos.find((photo) => photo.src === photo2Src);

    const weightDiff = Math.abs(photo1.weight - photo2.weight).toFixed(1);
    document.getElementById("date-1").textContent = photo1.date;
    document.getElementById("date-2").textContent = photo2.date;
    document.getElementById("weight-diff").textContent = `${weightDiff} lbs`;
  });
}

/* ================================
    Export Template
================================ */
function setupExportTemplate() {
  const exportButton = document.getElementById("export-results-btn");

  exportButton.addEventListener("click", () => {
    const exportTemplate = document.getElementById("share-template");
    const photo1Src = document.getElementById("photo-1").src;
    const photo2Src = document.getElementById("photo-2").src;

    document.getElementById("export-photo-1").src = photo1Src;
    document.getElementById("export-photo-2").src = photo2Src;
    document.getElementById("export-weight-diff").textContent = document.getElementById("weight-diff").textContent;

    html2canvas(exportTemplate).then((canvas) => {
      const link = document.createElement("a");
      link.download = "fitjourney-comparison.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  });
}
