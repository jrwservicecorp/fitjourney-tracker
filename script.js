const appVersion = "v4.2";

let chartInstance = null;
let photoPage = 0;

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("app-version").textContent = appVersion;

  setupWeightLogging();
  setupPhotoUpload();
  renderChart();
  updateSummary();
  loadPhotos();
  loadRecentWeighins();
  setupPhotoEditor();
});

function setupWeightLogging() {
  const weightForm = document.getElementById("weight-form");

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
}

function setupPhotoEditor() {
  const photoEditor = window.FilerobotImageEditor.create('#image-editor-container', {
    tools: ['adjust', 'filters', 'crop', 'text', 'export'],
    cropPresets: [
      { label: 'Instagram Square', value: 1 },
      { label: 'Instagram Portrait', value: 4 / 5 },
      { label: 'Instagram Landscape', value: 16 / 9 },
    ],
  });

  document.getElementById('edit-photo-btn').addEventListener('click', () => {
    const selectedPhoto = 'path/to/photo.jpg'; // Placeholder
    photoEditor.open(selectedPhoto);
  });
}

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

  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: progressData.map((entry) => entry.date),
      datasets: [
        {
          label: "Weight",
          data: progressData.map((entry) => entry.weight),
          backgroundColor: "rgba(52, 152, 219, 0.4)",
          borderColor: "#3498db",
          borderWidth: 3,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { labels: { color: "#ffffff" } },
      },
      scales: {
        x: { ticks: { color: "#ffffff" } },
        y: { ticks: { color: "#ffffff" } },
      },
    },
  });
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
    .map((photo) => `<div><img src="${photo.src}" alt="Photo"><p>${photo.date}</p></div>`)
    .join("");
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
