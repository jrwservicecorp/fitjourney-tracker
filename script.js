const appVersion = "v7.40-beta";

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

  // Initialize modules
  setupChart();
  setupWeightLogging();
  setupPhotoUpload();
  setupPhotoComparison();
  setupSinglePhotoExport();
  setupDataOnlyExport();
  loadPhotos();

  document.getElementById("clear-photos-btn")?.addEventListener("click", clearPhotos);
});

/* ================================
    Chart Setup
================================ */
function setupChart() {
  const canvas = document.getElementById("weight-chart");
  if (!canvas) {
    console.error("Chart canvas not found!");
    return;
  }

  ensureCanvasReady(() => {
    const storedData = JSON.parse(localStorage.getItem("progressData")) || [];
    renderChart(demoData, storedData, true);
  });

  const toggleDemoCheckbox = document.getElementById("toggle-demo-data");
  if (toggleDemoCheckbox) {
    toggleDemoCheckbox.addEventListener("change", () => {
      const showDemo = toggleDemoCheckbox.checked;
      const progressData = JSON.parse(localStorage.getItem("progressData")) || [];
      renderChart(demoData, progressData, showDemo);
    });
  }
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
  if (!weightForm) {
    console.error("Weight form not found!");
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
  if (!photoForm) {
    console.error("Photo upload form not found!");
    return;
  }

  photoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("Photo upload form submitted!");

    const fileInput = document.getElementById("photo-upload");
    const dateInput = document.getElementById("photo-date");

    if (!fileInput || !dateInput) {
      console.error("File input or date input not found!");
      return;
    }

    if (!fileInput.files[0] || !dateInput.value) {
      alert("Please provide a photo and a date.");
      console.log("Validation failed: missing file or date.");
      return;
    }

    compressImage(fileInput.files[0], (compressedDataUrl) => {
      const photos = JSON.parse(localStorage.getItem("photos")) || [];
      photos.push({ src: compressedDataUrl, date: dateInput.value });
      localStorage.setItem("photos", JSON.stringify(photos));
      console.log("Photo saved successfully!");
      loadPhotos();
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

      const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.7); // Compress image
      callback(compressedDataUrl);
    };
  };

  reader.onerror = () => {
    console.error("Error reading the photo file.");
    alert("There was an error processing your photo. Please try again.");
  };

  reader.readAsDataURL(file);
}

function loadPhotos() {
  const gallery = document.getElementById("photo-gallery");
  const photo1Select = document.getElementById("photo-select-1");
  const photo2Select = document.getElementById("photo-select-2");

  if (!gallery) {
    console.error("Photo gallery element not found!");
    return;
  }

  const photos = JSON.parse(localStorage.getItem("photos")) || [];

  gallery.innerHTML = "";
  photo1Select.innerHTML = "<option value=''>Select Photo 1</option>";
  photo2Select.innerHTML = "<option value=''>Select Photo 2</option>";

  if (!photos.length) {
    gallery.innerHTML = "<p class='placeholder'>No photos uploaded yet.</p>";
    return;
  }

  photos.forEach((photo, index) => {
    const option1 = document.createElement("option");
    const option2 = document.createElement("option");

    option1.value = photo.src;
    option1.textContent = `Photo ${index + 1} - ${photo.date}`;
    option2.value = photo.src;
    option2.textContent = `Photo ${index + 1} - ${photo.date}`;

    photo1Select.appendChild(option1);
    photo2Select.appendChild(option2);

    gallery.innerHTML += `
      <div class="photo-item">
        <img src="${photo.src}" alt="Progress Photo">
        <p>${photo.date}</p>
      </div>`;
  });

  console.log("Photo gallery and comparison dropdowns updated successfully.");
}

/* ================================
    Clear Photos
================================ */
function clearPhotos() {
  localStorage.removeItem("photos");
  loadPhotos();
  console.log("All photos cleared from localStorage.");
}

/* ================================
    Data Only Export
================================ */
function setupDataOnlyExport() {
  const dataExportButton = document.getElementById("data-export-btn");
  if (!dataExportButton) {
    console.error("Data export button not found!");
    return;
  }

  dataExportButton.addEventListener("click", () => {
    const progressData = JSON.parse(localStorage.getItem("progressData")) || [];

    if (!progressData.length) {
      alert("No data available for export.");
      return;
    }

    const csvContent = generateCSV(progressData);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "progress-data.csv";
    link.click();

    console.log("Data exported successfully as CSV.");
  });
}

function generateCSV(data) {
  const headers = ["Date", "Weight (lbs)"];
  const rows = data.map((entry) => [entry.date, entry.weight]);

  const csvContent = [headers, ...rows]
    .map((row) => row.join(","))
    .join("\n");

  return csvContent;
}
