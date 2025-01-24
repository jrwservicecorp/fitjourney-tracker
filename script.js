const appVersion = "v3.6";

let chartInstance = null;
let photoPage = 0; // For gallery pagination

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("app-version").textContent = appVersion;

  setupWeightLogging();
  setupPhotoUpload();
  renderChart();
  updateSummary();
  loadPhotos();
  loadRecentWeighins();
});

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

    renderChart();
    updateSummary();
    loadRecentWeighins();
  });

  console.log("Weight logging setup completed.");
}

/* ================================
    Chart Rendering
================================ */
function renderChart() {
  const progressData = JSON.parse(localStorage.getItem("progressData")) || [];
  const ctx = document.getElementById("weight-chart").getContext("2d");

  if (chartInstance) {
    chartInstance.destroy();
  }

  if (progressData.length === 0) {
    document.getElementById("chart-placeholder").textContent = "No data available.";
    return;
  }

  const gradientFill = ctx.createLinearGradient(0, 0, 0, 400);
  gradientFill.addColorStop(0, "rgba(52, 152, 219, 0.4)"); // Light blue
  gradientFill.addColorStop(1, "rgba(52, 152, 219, 0)");   // Transparent

  const gradientBorder = ctx.createLinearGradient(0, 0, 400, 0);
  gradientBorder.addColorStop(0, "#1a73e8"); // Bright blue
  gradientBorder.addColorStop(1, "#3498db"); // Lighter blue

  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: progressData.map((entry) => entry.date),
      datasets: [
        {
          label: "Weight",
          data: progressData.map((entry) => entry.weight),
          backgroundColor: gradientFill,
          borderColor: gradientBorder,
          borderWidth: 3,
          pointRadius: 6,
          pointBackgroundColor: "#ffffff", // White glowing points
          pointBorderColor: "#3498db",
          pointHoverRadius: 8,
          tension: 0.4, // Smooth curve
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          labels: {
            color: "#ffffff", // White text for legend
            font: {
              size: 14,
            },
          },
        },
        tooltip: {
          backgroundColor: "#1c1c1c",
          titleColor: "#ffffff",
          bodyColor: "#ffffff",
          borderColor: "#3498db",
          borderWidth: 1,
        },
      },
      scales: {
        x: {
          ticks: {
            color: "#ffffff",
            font: {
              size: 12,
            },
          },
          grid: {
            color: "rgba(255, 255, 255, 0.1)", // Subtle gridlines
          },
        },
        y: {
          ticks: {
            color: "#ffffff",
            font: {
              size: 12,
            },
            padding: 10,
          },
          grid: {
            color: "rgba(255, 255, 255, 0.1)", // Subtle gridlines
          },
        },
      },
      animation: {
        duration: 1500,
        easing: "easeOutQuart", // Smooth animation
      },
    },
  });
}

/* ================================
    Weight Summary
================================ */
function updateSummary() {
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
}

/* ================================
    Recent Weigh-Ins
================================ */
function loadRecentWeighins() {
  const progressData = JSON.parse(localStorage.getItem("progressData")) || [];
  const recentContainer = document.getElementById("recent-weighins");

  if (progressData.length === 0) {
    recentContainer.innerHTML = "<p class='placeholder'>No weigh-ins recorded yet.</p>";
    return;
  }

  const recentWeighins = progressData.slice(-4);
  recentContainer.innerHTML = recentWeighins
    .map((entry) => `<p>${entry.date}: ${entry.weight} lbs</p>`)
    .join("");
}

/* ================================
    Photo Upload and Gallery
================================ */
function setupPhotoUpload() {
  const photoForm = document.getElementById("photo-form");

  if (!photoForm) {
    console.error("Photo form not found!");
    return;
  }

  photoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const photoInput = document.getElementById("photo-upload").files[0];
    const photoDate = document.getElementById("photo-date").value;

    if (!photoInput || !photoDate) {
      alert("Please select a photo and date.");
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      const photos = JSON.parse(localStorage.getItem("photos")) || [];
      photos.push({ date: photoDate, src: e.target.result });
      localStorage.setItem("photos", JSON.stringify(photos));
      loadPhotos();
      alert("Photo uploaded successfully!");
    };
    reader.readAsDataURL(photoInput);
  });

  console.log("Photo upload setup completed.");
}

function loadPhotos() {
  const photos = JSON.parse(localStorage.getItem("photos")) || [];
  const gallery = document.getElementById("photo-gallery");

  if (photos.length === 0) {
    gallery.innerHTML = "<p class='placeholder'>No photos uploaded yet.</p>";
    return;
  }

  const photosToShow = photos.slice(photoPage * 8, photoPage * 8 + 8);
  gallery.innerHTML = photosToShow
    .map((photo) => `<div><img src="${photo.src}" alt="Uploaded Photo"><p>${photo.date}</p></div>`)
    .join("");

  const showMoreBtn = document.getElementById("show-more-photos-btn");
  showMoreBtn.style.display = photos.length > photoPage * 8 + 8 ? "block" : "none";

  showMoreBtn.addEventListener("click", () => {
    photoPage++;
    loadPhotos();
  });
}
