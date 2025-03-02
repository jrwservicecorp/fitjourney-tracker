/* FitJourney Tracker - JS v1.0.1 */
/* This script includes functionalities for chart rendering, weight logging, photo upload,
   photo comparison, and export options. It also fixes the duplicate declaration issue with overlayPreview. */

document.addEventListener("DOMContentLoaded", function() {
  // App version initialization
  const appVersion = "v1.0.1";
  document.getElementById("app-version").textContent = appVersion;

  // Initialize the overlay preview element only once.
  const overlayPreview = document.getElementById("overlay-preview");

  // ----------------------------
  // Chart Functionality using Chart.js
  // ----------------------------
  const ctx = document.getElementById("weightChart").getContext("2d");
  let weightChart;
  // Demo data for chart
  let demoData = {
    labels: ["Jan", "Feb", "Mar", "Apr"],
    datasets: [{
      label: "Weight",
      data: [200, 195, 190, 185],
      borderColor: "rgba(75, 192, 192, 1)",
      fill: false
    }]
  };

  function initChart(data) {
    if (weightChart) {
      weightChart.destroy();
    }
    weightChart = new Chart(ctx, {
      type: "line",
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
      }
    });
  }

  // Toggle demo data checkbox functionality
  const toggleDemoData = document.getElementById("toggle-demo-data");
  toggleDemoData.addEventListener("change", function() {
    if (this.checked) {
      initChart(demoData);
      document.getElementById("chart-placeholder").style.display = "none";
    } else {
      if (weightChart) {
        weightChart.destroy();
        weightChart = null;
      }
      document.getElementById("chart-placeholder").style.display = "block";
    }
  });
  // Initialize chart with demo data if checkbox is checked
  if (toggleDemoData.checked) {
    initChart(demoData);
  }

  // ----------------------------
  // Weight Logging Functionality
  // ----------------------------
  const weightForm = document.getElementById("weight-form");
  const recentWeighinsContainer = document.getElementById("recent-weighins");
  const weightSummaryContainer = document.getElementById("weight-summary");
  let weighIns = [];

  weightForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const weightInput = document.getElementById("weight-input");
    const dateInput = document.getElementById("date-input");
    const weight = parseFloat(weightInput.value);
    const date = dateInput.value;
    if (!isNaN(weight) && date) {
      weighIns.push({ weight: weight, date: date });
      updateWeighIns();
      // Update demoData for chart display
      demoData.labels.push(date);
      demoData.datasets[0].data.push(weight);
      if (toggleDemoData.checked) {
        initChart(demoData);
      }
      weightInput.value = "";
      dateInput.value = "";
    }
  });

  function updateWeighIns() {
    recentWeighinsContainer.innerHTML = "";
    if (weighIns.length === 0) {
      recentWeighinsContainer.innerHTML = "<p class='placeholder'>No weigh-ins recorded yet.</p>";
    } else {
      weighIns.slice(-5).forEach(item => {
        const p = document.createElement("p");
        p.textContent = `Weight: ${item.weight} lbs on ${item.date}`;
        recentWeighinsContainer.appendChild(p);
      });
      const total = weighIns.reduce((acc, item) => acc + item.weight, 0);
      const avg = (total / weighIns.length).toFixed(1);
      weightSummaryContainer.innerHTML = `<p>Average Weight: ${avg} lbs</p>`;
    }
  }

  // ----------------------------
  // Photo Upload Functionality
  // ----------------------------
  const photoUploadForm = document.getElementById("photo-upload-form");
  const photoGallery = document.getElementById("photo-gallery");
  let photos = [];

  photoUploadForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const photoInput = document.getElementById("photo-upload");
    const photoDateInput = document.getElementById("photo-date");
    if (photoInput.files && photoInput.files[0]) {
      const file = photoInput.files[0];
      const reader = new FileReader();
      reader.onload = function(event) {
        photos.push({ src: event.target.result, date: photoDateInput.value });
        updatePhotoGallery();
      };
      reader.readAsDataURL(file);
      photoUploadForm.reset();
    }
  });

  function updatePhotoGallery() {
    photoGallery.innerHTML = "";
    if (photos.length === 0) {
      photoGallery.innerHTML = "<p class='placeholder'>No photos uploaded yet.</p>";
    } else {
      photos.forEach((photo, index) => {
        const img = document.createElement("img");
        img.src = photo.src;
        img.alt = `Progress Photo ${index + 1}`;
        photoGallery.appendChild(img);
      });
    }
    updatePhotoSelects();
  }

  // ----------------------------
  // Photo Comparison Functionality
  // ----------------------------
  const photoSelect1 = document.getElementById("photo-select-1");
  const photoSelect2 = document.getElementById("photo-select-2");
  const comparePhotosBtn = document.getElementById("compare-photos-btn");
  const sideBySideComparison = document.getElementById("side-by-side-comparison");

  function updatePhotoSelects() {
    [photoSelect1, photoSelect2].forEach(select => {
      select.innerHTML = "";
      photos.forEach((photo, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = `Photo ${index + 1} (${photo.date || "No date"})`;
        select.appendChild(option);
      });
    });
  }

  comparePhotosBtn.addEventListener("click", function() {
    const index1 = parseInt(photoSelect1.value);
    const index2 = parseInt(photoSelect2.value);
    sideBySideComparison.innerHTML = "";
    if (!isNaN(index1) && !isNaN(index2) && photos[index1] && photos[index2]) {
      const img1 = document.createElement("img");
      img1.src = photos[index1].src;
      img1.alt = `Photo ${index1 + 1}`;
      const img2 = document.createElement("img");
      img2.src = photos[index2].src;
      img2.alt = `Photo ${index2 + 1}`;
      sideBySideComparison.appendChild(img1);
      sideBySideComparison.appendChild(img2);
    }
  });

  // ----------------------------
  // Export Functionality (Dummy Implementation)
  // ----------------------------
  const prepareExportBtn = document.getElementById("prepare-export-btn");
  const exportDataBtn = document.getElementById("exportDataBtn");

  prepareExportBtn.addEventListener("click", function() {
    alert("Export prepared. Click 'Download Export' to proceed.");
  });

  exportDataBtn.addEventListener("click", function() {
    const exportData = {
      weighIns: weighIns,
      photos: photos,
      version: appVersion
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fitjourney_export.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  // Note: All references to the overlay preview should use the single instance declared above.
  // Additional functionalities can be built on here as needed.
});
