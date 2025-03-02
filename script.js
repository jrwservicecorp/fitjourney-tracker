/* FitJourney Tracker - JS v1.0.3 */
/* This script now includes functionalities for:
   - Chart rendering and weight logging
   - Photo upload with a unified gallery display
   - Advanced side-by-side comparisons using JuxtaposeJS and TwentyTwenty,
     including photo selectors and export with a watermark overlay.
*/

document.addEventListener("DOMContentLoaded", function() {
  // App version initialization
  const appVersion = "v1.0.3";
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
  // Photo Upload Functionality & Gallery Display
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
        updatePhotoSelectors();
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
  // Populate Photo Selectors for Comparisons
  // ----------------------------
  function updatePhotoSelectors() {
    // Update selectors for JuxtaposeJS
    const juxtaBefore = document.getElementById("juxta-before");
    const juxtaAfter = document.getElementById("juxta-after");
    // Update selectors for TwentyTwenty
    const ttBefore = document.getElementById("tt-before");
    const ttAfter = document.getElementById("tt-after");
    
    // Clear existing options
    [juxtaBefore, juxtaAfter, ttBefore, ttAfter].forEach(select => {
      select.innerHTML = "";
    });
    
    photos.forEach((photo, index) => {
      const optionText = `Photo ${index + 1} (${photo.date || "No date"})`;
      [juxtaBefore, juxtaAfter, ttBefore, ttAfter].forEach(select => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = optionText;
        select.appendChild(option);
      });
    });
  }

  // ----------------------------
  // JuxtaposeJS Side by Side Comparison
  // ----------------------------
  let juxtaInstance;
  const juxtaposeContainer = document.getElementById("juxtapose-container");
  const juxtaUpdateBtn = document.getElementById("juxta-update");

  juxtaUpdateBtn.addEventListener("click", function() {
    const beforeIndex = parseInt(document.getElementById("juxta-before").value);
    const afterIndex = parseInt(document.getElementById("juxta-after").value);
    let beforeSrc, afterSrc;
    if (photos[beforeIndex]) {
      beforeSrc = photos[beforeIndex].src;
    } else {
      beforeSrc = "https://via.placeholder.com/300x400?text=Before";
    }
    if (photos[afterIndex]) {
      afterSrc = photos[afterIndex].src;
    } else {
      afterSrc = "https://via.placeholder.com/300x400?text=After";
    }
    // Clear existing content
    juxtaposeContainer.innerHTML = "";
    // Reinitialize JuxtaposeJS slider
    juxtaInstance = new juxtapose.JXSlider('#juxtapose-container', {
      animate: true,
      showLabels: true,
      startingPosition: "50%",
      mode: "auto",
      images: [
        {
          src: beforeSrc,
          label: "Before"
        },
        {
          src: afterSrc,
          label: "After"
        }
      ]
    });
  });

  // Export functionality for JuxtaposeJS section with watermark overlay
  const exportJuxtaBtn = document.getElementById("export-juxtapose-btn");
  exportJuxtaBtn.addEventListener("click", function() {
    addWatermark(juxtaposeContainer, function() {
      html2canvas(juxtaposeContainer).then(function(canvas) {
        removeWatermark(juxtaposeContainer);
        var link = document.createElement("a");
        link.download = "juxtapose_comparison.png";
        link.href = canvas.toDataURL();
        link.click();
      });
    });
  });

  // ----------------------------
  // TwentyTwenty Side by Side Comparison
  // ----------------------------
  const ttUpdateBtn = document.getElementById("tt-update");
  ttUpdateBtn.addEventListener("click", function() {
    const beforeIndex = parseInt(document.getElementById("tt-before").value);
    const afterIndex = parseInt(document.getElementById("tt-after").value);
    let beforeSrc, afterSrc;
    if (photos[beforeIndex]) {
      beforeSrc = photos[beforeIndex].src;
    } else {
      beforeSrc = "https://via.placeholder.com/300x400?text=Before";
    }
    if (photos[afterIndex]) {
      afterSrc = photos[afterIndex].src;
    } else {
      afterSrc = "https://via.placeholder.com/300x400?text=After";
    }
    // Update TwentyTwenty container with new images
    const ttContainer = document.getElementById("twentytwenty-container");
    ttContainer.innerHTML = `
      <img src="${beforeSrc}" alt="Before">
      <img src="${afterSrc}" alt="After">
    `;
    // Reinitialize the TwentyTwenty slider
    $(ttContainer).twentytwenty({ default_offset_pct: 0.5, orientation: 'horizontal' });
  });

  // Export functionality for TwentyTwenty section with watermark overlay
  const exportTTBtn = document.getElementById("export-twentytwenty-btn");
  exportTTBtn.addEventListener("click", function() {
    addWatermark(document.getElementById("twentytwenty-container"), function() {
      html2canvas(document.getElementById("twentytwenty-container")).then(function(canvas) {
        removeWatermark(document.getElementById("twentytwenty-container"));
        var link = document.createElement("a");
        link.download = "twentytwenty_comparison.png";
        link.href = canvas.toDataURL();
        link.click();
      });
    });
  });

  // ----------------------------
  // Watermark Overlay Functions
  // ----------------------------
  function addWatermark(container, callback) {
    const watermark = document.createElement("div");
    watermark.className = "watermark";
    watermark.textContent = "FitJourney Tracker";
    container.style.position = "relative";
    container.appendChild(watermark);
    // Give time for DOM update then call callback
    setTimeout(callback, 100);
  }
  
  function removeWatermark(container) {
    const watermark = container.querySelector(".watermark");
    if (watermark) {
      container.removeChild(watermark);
    }
  }
});
