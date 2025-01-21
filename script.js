// JavaScript (v2.58)
const appVersion = "v2.58";

let chartInstance = null;

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("app-version").textContent = appVersion;
  setupNavigation();
  setupLogWeight();
  setupPhotoUpload();
  loadDashboard();
  setupCollapsibleSections();
  setupThemeToggle();
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

  if (pageId === "dashboard") loadDashboard();
}

function loadDashboard() {
  const progressData = JSON.parse(localStorage.getItem("progressData")) || [];

  if (progressData.length > 0) {
    document.getElementById("chart-placeholder").style.display = "none";
    renderChart(progressData);
  } else {
    document.getElementById("chart-placeholder").style.display = "block";
    renderChart(getPlaceholderData());
  }
}

function renderChart(data) {
  const ctx = document.getElementById("weight-chart").getContext("2d");

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: data.map((entry) => entry.date),
      datasets: [
        {
          label: "Weight (lbs)",
          data: data.map((entry) => entry.weight),
          borderColor: "#ff6f61",
          backgroundColor: "rgba(255, 111, 97, 0.2)",
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        tooltip: {
          enabled: true,
        },
      },
      scales: {
        x: {
          grid: {
            color: "#cccccc",
          },
        },
        y: {
          grid: {
            color: "#cccccc",
          },
          beginAtZero: true,
        },
      },
    },
  });
}

function setupLogWeight() {
  const logWeightBtn = document.getElementById("log-weight-btn");
  logWeightBtn.addEventListener("click", () => {
    const weight = parseFloat(document.getElementById("weight-input").value);
    const bodyFat = parseFloat(document.getElementById("body-fat").value);
    const waist = parseFloat(document.getElementById("waist").value);

    if (isNaN(weight) || weight < 20 || weight > 500) {
      alert("Please enter a valid weight between 20 and 500 lbs.");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    const progressData = JSON.parse(localStorage.getItem("progressData")) || [];
    progressData.push({ date: today, weight, bodyFat, waist });
    localStorage.setItem("progressData", JSON.stringify(progressData));
    alert("Entry logged successfully!");
    loadDashboard();
  });
}

function setupPhotoUpload() {
  const uploadBtn = document.getElementById("upload-photo-btn");
  const photoInput = document.getElementById("photo-upload");
  const descriptionInput = document.getElementById("photo-description");

  uploadBtn.addEventListener("click", () => {
    const file = photoInput.files[0];
    const description = descriptionInput.value;

    if (!file) {
      alert("Please select a photo to upload.");
      return;
    }

    const photoUrl = URL.createObjectURL(file);

    const photos = JSON.parse(localStorage.getItem("photos")) || [];
    photos.push({
      date: new Date().toISOString().split("T")[0],
      src: photoUrl,
      description,
    });
    localStorage.setItem("photos", JSON.stringify(photos));

    alert("Photo uploaded successfully!");
    descriptionInput.value = "";
    photoInput.value = "";
    updatePhotoGallery();
  });
}

function updatePhotoGallery() {
  const photos = JSON.parse(localStorage.getItem("photos")) || [];
  const gallery = document.getElementById("photo-gallery");
  gallery.innerHTML =
