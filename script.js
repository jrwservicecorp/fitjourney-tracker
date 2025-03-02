/* FitJourney Tracker - JS v1.0.2 */
/* This script includes functionalities for chart rendering, weight logging, photo upload,
   and advanced side-by-side comparisons using JuxtaposeJS and TwentyTwenty with export options
   for social media. */

document.addEventListener("DOMContentLoaded", function() {
  // App version initialization
  const appVersion = "v1.0.2";
  document.getElementById("app-version").textContent = appVersion;

  // Initialize the overlay preview element only once.
  const overlayPreview = document.getElementById("overlay-preview");

  // ----------------------------
  // Chart Functionality using Chart.js
  // ----------------------------
  const ctx = document.getElementById("weightChart").getContext("2d");
  let weightChart;
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
  }

  // ----------------------------
  // JuxtaposeJS Side by Side Comparison
  // ----------------------------
  const juxtaposeContainer = document.getElementById("juxtapose-container");
  if (juxtaposeContainer) {
    window.juxtaposeInstance = new juxtapose.JXSlider('#juxtapose-container', {
      animate: true,
      showLabels: true,
      startingPosition: "50%",
      mode: "auto",
      images: [
        {
          src: "https://via.placeholder.com/300x400?text=Before",
          label: "Before"
        },
        {
          src: "https://via.placeholder.com/300x400?text=After",
          label: "After"
        }
      ]
    });
  }

  // Export functionality for JuxtaposeJS section
  const exportJuxtaposeBtn = document.getElementById("export-juxtapose-btn");
  if (exportJuxtaposeBtn) {
    exportJuxtaposeBtn.addEventListener("click", function() {
      html2canvas(juxtaposeContainer).then(function(canvas) {
        var link = document.createElement("a");
        link.download = "juxtapose_comparison.png";
        link.href = canvas.toDataURL();
        link.click();
      });
    });
  }

  // ----------------------------
  // TwentyTwenty Side by Side Comparison
  // ----------------------------
  // Initialize TwentyTwenty slider using jQuery
  $(document).ready(function() {
    $("#twentytwenty-container").twentytwenty({
      default_offset_pct: 0.5,
      orientation: 'horizontal'
    });
  });

  // Export functionality for TwentyTwenty section
  const twentytwentyContainer = document.getElementById("twentytwenty-container");
  const exportTwentyTwentyBtn = document.getElementById("export-twentytwenty-btn");
  if (exportTwentyTwentyBtn) {
    exportTwentyTwentyBtn.addEventListener("click", function() {
      html2canvas(twentytwentyContainer).then(function(canvas) {
        var link = document.createElement("a");
        link.download = "twentytwenty_comparison.png";
        link.href = canvas.toDataURL();
        link.click();
      });
    });
  }
});
