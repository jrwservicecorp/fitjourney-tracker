const appVersion = "v7.26-beta";

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
  // Comment out setupPhotoComparison until it's implemented
  // setupPhotoComparison();
  loadPhotos();

  // Add event listeners
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
    Photo Upload
================================ */
function setupPhotoUpload() {
  const photoForm = document.getElementById("photo-upload-form");
  if (!photoForm) {
    console.error("Photo upload form not found!");
    return;
  }

  photoForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    console.log("Photo upload form submitted!");

    const fileInput = document.getElementById("photo-upload");
    const dateInput = document.getElementById("photo-date");

    if (!fileInput || !dateInput) {
      console.error("File input or date input not found!");
      return;
    }

    if (!fileInput.files[0] || !dateInput.value) {
      alert("Please provide a photo and a date.");
      return;
    }

    console.log("Processing photo upload...");
    compressImage(fileInput.files[0], (compressedDataUrl) => {
      try {
        const photos = JSON.parse(localStorage.getItem("photos")) || [];
        photos.push({ src: compressedDataUrl, date: dateInput.value });
        localStorage.setItem("photos", JSON.stringify(photos));
        console.log("Photo saved to localStorage successfully.");
        loadPhotos();
      } catch (error) {
        console.error("QuotaExceededError: Failed to save photo to localStorage.", error);
        alert("Storage limit exceeded. Please clear some photos and try again.");
      }
    });
  });

  console.log("Photo upload setup complete.");
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

/* ================================
    Photo Gallery
================================ */
function loadPhotos() {
  const gallery = document.getElementById("photo-gallery");
  if (!gallery) {
    console.error("Photo gallery element not found!");
    return;
  }

  const photos = JSON.parse(localStorage.getItem("photos")) || [];

  gallery.innerHTML = "";

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

  document.querySelectorAll(".delete-photo-btn").forEach((btn) =>
    btn.addEventListener("click", (e) => {
      const index = e.target.getAttribute("data-index");
      deletePhoto(index);
    })
  );

  console.log("Photo gallery updated successfully.");
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
