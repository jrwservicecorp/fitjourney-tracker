// JavaScript (v2.60)
const appVersion = "v2.60";

let chartInstance = null;

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("app-version").textContent = appVersion;
  setupNavigation();
  setupPhotoUpload();
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

function getPlaceholderData() {
  const today = new Date();
  const placeholderDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - i));
    return date.toISOString().split("T")[0];
  });

  const placeholderWeights = [150, 152, 151, 153, 150, 148, 149];

  return placeholderDates.map((date, index) => ({
    date,
    weight: placeholderWeights[index],
  }));
}

function setupPhotoUpload() {
  const uploadBtn = document.getElementById("upload-photo-btn");
  uploadBtn.addEventListener("click", () => {
    const file = document.getElementById("photo-upload").files[0];
    const description = document.getElementById("photo-description").value;

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
    updatePhotoGallery();
  });
}

function updatePhotoGallery() {
  const photos = JSON.parse(localStorage.getItem("photos")) || [];
  const gallery = document.getElementById("photo-gallery");
  gallery.innerHTML = "";

  if (photos.length === 0) {
    gallery.innerHTML = '<p class="placeholder">No photos uploaded yet. Start uploading to see your progress!</p>';
    return;
  }

  photos.forEach((photo) => {
    const photoEntry = document.createElement("div");
    photoEntry.innerHTML = `
      <img src="${photo.src}" alt="Progress Photo" title="${photo.date}">
      <p>${photo.date}</p>
      <p>${photo.description || ""}</p>
    `;
    gallery.appendChild(photoEntry);
  });
}
