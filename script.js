const appVersion = "v5.8";

let chartInstance = null;
let photoPage = 0;

// Demo Data
const demoData = [
  { date: "2023-12-01", weight: 200 },
  { date: "2023-12-02", weight: 198 },
  { date: "2023-12-03", weight: 195 },
];

// Ensure all functions are declared before calling them
function setupWeightLogging() {
  const weightForm = document.getElementById("weight-form");

  if (!weightForm) {
    console.error("Weight form not found. Skipping setupWeightLogging.");
    return;
  }

  weightForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const weightInput = document.getElementById("weight-input").value;
    const dateInput = document.getElementById("date-input").value;

    if (!weightInput || !dateInput) {
      alert("Please enter a valid weight and date.");
      return;
    }

    const progressData = JSON.parse(localStorage.getItem("progressData")) || [];
    progressData.push({ date: dateInput, weight: parseFloat(weightInput) });

    localStorage.setItem("progressData", JSON.stringify(progressData));
    alert("Weight logged successfully!");

    console.log("User logged weight:", { date: dateInput, weight: parseFloat(weightInput) });

    const showDemoData = document.getElementById("toggle-demo-data").checked;
    renderChart(showDemoData ? demoData : [], progressData); // Update chart based on toggle
    updateSummary();
    loadRecentWeighins();
  });
}

function loadChartWithDemoData() {
  console.log("Executing loadChartWithDemoData...");
  const progressData = JSON.parse(localStorage.getItem("progressData")) || [];
  console.log("Initial user data:", progressData);

  if (progressData.length === 0 && demoData.length === 0) {
    console.log("No data available for chart. Displaying placeholder.");
    displayChartPlaceholder();
    return;
  }

  console.log("Passing data to renderChart...");
  renderChart(demoData, progressData);
}

function renderChart(demoData = [], userData = []) {
  console.log("Executing renderChart...");
  console.log("Demo Data:", demoData);
  console.log("User Data:", userData);

  const canvas = document.getElementById("weight-chart");
  if (!canvas) {
    console.error("Chart canvas element not found!");
    return;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    console.error("Failed to get 2D context for chart canvas!");
    return;
  }

  if (chartInstance) {
    chartInstance.destroy();
  }

  const labels = [
    ...demoData.map((d) => d.date),
    ...userData.map((u) => u.date),
  ];

  const demoWeights = demoData.map((d) => d.weight);
  const userWeights = userData.map((u) => u.weight);

  console.log("Rendering chart with labels:", labels);
  console.log("Demo weights:", demoWeights);
  console.log("User weights:", userWeights);

  try {
    chartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Demo Data (Pink)",
            data: demoWeights,
            borderColor: "#e91e63",
            backgroundColor: "rgba(233, 30, 99, 0.2)",
            borderWidth: 2,
            pointRadius: 4,
          },
          {
            label: "User Data (Blue)",
            data: userWeights,
            borderColor: "#3498db",
            backgroundColor: "rgba(52, 152, 219, 0.2)",
            borderWidth: 2,
            pointRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            labels: { color: "#ffffff" },
          },
        },
        scales: {
          x: { ticks: { color: "#ffffff" } },
          y: { ticks: { color: "#ffffff" } },
        },
      },
    });
    console.log("Chart rendered successfully.");
  } catch (error) {
    console.error("Error rendering chart:", error);
  }
}

function setupChartOptions() {
  const toggleDemoCheckbox = document.getElementById("toggle-demo-data");
  toggleDemoCheckbox.addEventListener("change", () => {
    const progressData = JSON.parse(localStorage.getItem("progressData")) || [];
    const showDemoData = toggleDemoCheckbox.checked;

    console.log("Toggling demo data:", showDemoData);
    renderChart(showDemoData ? demoData : [], progressData);
  });
}

function displayChartPlaceholder() {
  const canvas = document.getElementById("weight-chart");
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "16px Arial";
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.fillText("No data available. Log your weight to get started!", canvas.width / 2, canvas.height / 2);
}

function updateSummary() {
  console.log("Updating weight summary...");
  const progressData = JSON.parse(localStorage.getItem("progressData")) || [];
  const summaryContainer = document.getElementById("weight-summary");

  if (progressData.length === 0) {
    summaryContainer.innerHTML = "<p class='placeholder'>No data available for summary.</p>";
    return;
  }

  const weights = progressData.map((entry) => entry.weight);
  const average = (weights.reduce((sum, w) => sum + w, 0) / weights.length).toFixed(1);
  const max = Math.max(...weights);
  const min = Math.min(...weights);

  summaryContainer.innerHTML = `
    <p><strong>Average Weight:</strong> ${average} lbs</p>
    <p><strong>Max Weight:</strong> ${max} lbs</p>
    <p><strong>Min Weight:</strong> ${min} lbs</p>
  `;
  console.log("Summary updated:", { average, max, min });
}

function loadRecentWeighins() {
  console.log("Loading recent weigh-ins...");
  const progressData = JSON.parse(localStorage.getItem("progressData")) || [];
  const recentContainer = document.getElementById("recent-weighins");

  if (progressData.length === 0) {
    recentContainer.innerHTML = "<p class='placeholder'>No weigh-ins recorded yet.</p>";
    return;
  }

  const recentWeighins = progressData.slice(-4).reverse();
  recentContainer.innerHTML = recentWeighins
    .map((entry) => `<p>${entry.date}: ${entry.weight} lbs</p>`)
    .join("");
  console.log("Recent weigh-ins updated:", recentWeighins);
}

async function waitForFilerobot() {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (window.FilerobotImageEditor) {
        clearInterval(interval);
        console.log("Filerobot Image Editor loaded successfully.");
        resolve();
      }
    }, 100);
  });
}

function setupPhotoUpload() {
  const photoForm = document.getElementById("photo-form");
  photoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const photoInput = document.getElementById("photo-upload").files[0];
    const photoDate = document.getElementById("photo-date").value;

    if (!photoInput || !photoDate) {
      alert("Select a photo and date.");
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      const photos = JSON.parse(localStorage.getItem("photos")) || [];
      photos.push({ date: photoDate, src: e.target.result });
      localStorage.setItem("photos", JSON.stringify(photos));
      loadPhotos();
    };
    reader.readAsDataURL(photoInput);
  });
}

function setupPhotoEditor() {
  const photoEditor = window.FilerobotImageEditor.create('#image-editor-container', {
    tools: ['adjust', 'filters', 'crop', 'text', 'export'],
  });

  document.getElementById('edit-photo-btn').addEventListener('click', () => {
    const photos = JSON.parse(localStorage.getItem("photos")) || [];
    if (photos.length === 0) {
      alert("No photos available to edit.");
      return;
    }
    const lastPhoto = photos[photos.length - 1];
    photoEditor.open(lastPhoto.src);
  });
}

// Ensure functions are called after being declared
window.addEventListener("DOMContentLoaded", async () => {
  console.log("Initializing FitJourney Tracker...");
  document.getElementById("app-version").textContent = appVersion;

  setupWeightLogging();
  setupPhotoUpload();
  await waitForFilerobot();
  setupPhotoEditor();
  setupChartOptions();

  loadChartWithDemoData();
  updateSummary();
  loadRecentWeighins();
});
