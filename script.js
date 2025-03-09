/* script.js - FitJourney Tracker - Tesla Edition */

/* Global arrays for data and photos */
let dataLogs = [];
let photoLogs = [];

/* Chart instance */
let weightChart = null;

document.addEventListener("DOMContentLoaded", function () {
  // Set app version
  document.getElementById("app-version").textContent = "v2.1";

  // Initialize Chart.js with time scale (using Luxon adapter)
  const ctx = document.getElementById('weightChart').getContext('2d');
  weightChart = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [{
        label: 'Weight (lbs)',
        data: [],
        borderColor: '#007bff',
        fill: false,
        tension: 0.2,
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: {
          type: 'time',
          time: { unit: 'day' },
          title: { display: true, text: 'Date' }
        },
        y: {
          title: { display: true, text: 'Weight (lbs)' }
        }
      }
    }
  });

  // Load demo data if toggled on and no logs exist
  const toggleDemo = document.getElementById("toggle-demo-data");
  if (toggleDemo.checked && dataLogs.length === 0) {
    const demoData = [
      { date: '2023-01-01', weight: 200, waist: 34, hips: 36, chest: 40, calories: 2500 },
      { date: '2023-02-01', weight: 195, waist: 33.5, hips: 35.5, chest: 39, calories: 2450 },
      { date: '2023-03-01', weight: 190, waist: 33, hips: 35, chest: 38, calories: 2400 }
    ];
    demoData.forEach(log => addDataLog(log));
    updateChart();
    updateSummary();
    updateRecentWeighIns();
    updateCalorieSummary();
  }

  // Data log form submission
  document.getElementById("data-log-form").addEventListener("submit", function(e) {
    e.preventDefault();
    const weight = parseFloat(document.getElementById("weight-input").value);
    const date = document.getElementById("date-input").value;
    const waist = parseFloat(document.getElementById("waist-input").value) || null;
    const hips = parseFloat(document.getElementById("hips-input").value) || null;
    const chest = parseFloat(document.getElementById("chest-input").value) || null;
    const calories = parseFloat(document.getElementById("calories-input").value) || null;
    if (!weight || !date) {
      alert("Please enter both weight and date.");
      return;
    }
    addDataLog({ date, weight, waist, hips, chest, calories });
    updateChart();
    updateSummary();
    updateRecentWeighIns();
    updateCalorieSummary();
    this.reset();
  });

  function addDataLog(log) {
    dataLogs.push(log);
    dataLogs.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  function updateChart() {
    weightChart.data.datasets[0].data = dataLogs.map(log => ({ x: log.date, y: log.weight }));
    weightChart.update();
  }

  function updateSummary() {
    const summaryDiv = document.getElementById("weight-summary");
    if (dataLogs.length === 0) {
      summaryDiv.innerHTML = '<p class="placeholder">No data available for summary.</p>';
      return;
    }
    const latest = dataLogs[dataLogs.length - 1];
    let html = `<p>Latest Weight: ${latest.weight} lbs on ${latest.date}</p>`;
    if (latest.waist) html += `<p>Waist: ${latest.waist} in</p>`;
    if (latest.hips) html += `<p>Hips: ${latest.hips} in</p>`;
    if (latest.chest) html += `<p>Chest: ${latest.chest} in</p>`;
    summaryDiv.innerHTML = html;
  }

  function updateRecentWeighIns() {
    const recentDiv = document.getElementById("recent-weighins");
    if (dataLogs.length === 0) {
      recentDiv.innerHTML = '<p class="placeholder">No weigh-ins recorded yet.</p>';
      return;
    }
    recentDiv.innerHTML = "";
    const recent = dataLogs.slice(-5).reverse();
    recent.forEach(log => {
      const p = document.createElement("p");
      p.textContent = `${log.date}: ${log.weight} lbs`;
      recentDiv.appendChild(p);
    });
  }

  function updateCalorieSummary() {
    const calorieDiv = document.getElementById("calorie-summary");
    const total = dataLogs.reduce((sum, log) => sum + (log.calories || 0), 0);
    if (dataLogs.length === 0 || total === 0) {
      calorieDiv.innerHTML = '<p class="placeholder">No calorie data available.</p>';
      return;
    }
    const avg = (total / dataLogs.length).toFixed(0);
    calorieDiv.innerHTML = `<p>Average Daily Calories: ${avg} kcal</p>`;
  }

  // Photo upload form submission using jQuery
  $("#photo-upload-form").on("submit", function (event) {
    event.preventDefault();
    const fileInput = $("#photo-upload")[0].files[0];
    const dateInput = $("#photo-date").val();
    if (!fileInput || !dateInput) {
      alert("Please select a photo and date.");
      return;
    }
    const reader = new FileReader();
    reader.onload = function (e) {
      photoLogs.push({ src: e.target.result, date: dateInput });
      updatePhotoGallery();
      updatePhotoSelectors();
    };
    reader.readAsDataURL(fileInput);
    this.reset();
  });

  function updatePhotoGallery() {
    const gallery = $("#photo-gallery");
    gallery.empty();
    if (photoLogs.length === 0) {
      gallery.html('<p class="placeholder">No photos uploaded yet.</p>');
      return;
    }
    photoLogs.forEach(photo => {
      gallery.append(`
        <div class="photo-entry">
          <img src="${photo.src}" alt="Progress Photo">
          <p>Date: ${photo.date}</p>
        </div>
      `);
    });
  }

  // Filter photos by date range
  $("#filter-photos-btn").on("click", function() {
    const startDate = $("#filter-start-date").val();
    const endDate = $("#filter-end-date").val();
    const gallery = $("#photo-gallery");
    gallery.empty();
    let filtered = photoLogs;
    if (startDate) filtered = filtered.filter(photo => new Date(photo.date) >= new Date(startDate));
    if (endDate) filtered = filtered.filter(photo => new Date(photo.date) <= new Date(endDate));
    if (filtered.length === 0) {
      gallery.html('<p class="placeholder">No photos match the selected date range.</p>');
    } else {
      filtered.forEach(photo => {
        gallery.append(`
          <div class="photo-entry">
            <img src="${photo.src}" alt="Progress Photo">
            <p>Date: ${photo.date}</p>
          </div>
        `);
      });
    }
  });

  $("#clear-filter-btn").on("click", function() {
    $("#filter-start-date, #filter-end-date").val("");
    updatePhotoGallery();
  });

  // Update photo selectors for comparison
  function updatePhotoSelectors() {
    const beforeSelect = $("#tt-before");
    const afterSelect = $("#tt-after");
    beforeSelect.empty();
    afterSelect.empty();
    photoLogs.forEach((photo, index) => {
      beforeSelect.append(`<option value="${index}">${photo.date}</option>`);
      afterSelect.append(`<option value="${index}">${photo.date}</option>`);
    });
  }

  // Initialize TwentyTwenty plugin for side-by-side comparison
  $(document).ready(function () {
    if ($.fn.twentytwenty) {
      $("#twentytwenty-container").twentytwenty();
    } else {
      console.error("TwentyTwenty plugin failed to load.");
    }
  });

  // Update comparison panel with selected photos for TwentyTwenty
  $("#tt-update").on("click", function() {
    const beforeIndex = parseInt($("#tt-before").val());
    const afterIndex = parseInt($("#tt-after").val());
    if (isNaN(beforeIndex) || isNaN(afterIndex)) {
      alert("Please select both before and after photos.");
      return;
    }
    const beforePhoto = photoLogs[beforeIndex];
    const afterPhoto = photoLogs[afterIndex];
    const container = $("#twentytwenty-container");
    container.empty();
    container.append(`<img src="${beforePhoto.src}" alt="Before">`);
    container.append(`<img src="${afterPhoto.src}" alt="After">`);
    container.twentytwenty();
  });

  // Advanced Comparison Editor using Fabric.js
  let comparisonCanvas = new fabric.Canvas('comparisonCanvas');
  
  // Open advanced comparison editor modal
  $("#open-comparison-editor").on("click", function() {
    $("#comparison-editor-modal").show();
    const beforeIndex = parseInt($("#tt-before").val());
    const afterIndex = parseInt($("#tt-after").val());
    if (isNaN(beforeIndex) || isNaN(afterIndex)) {
      alert("Please select both before and after photos for editing.");
      return;
    }
    const beforePhoto = photoLogs[beforeIndex];
    const afterPhoto = photoLogs[afterIndex];
    // Clear canvas and load the before image as background
    comparisonCanvas.clear();
    fabric.Image.fromURL(beforePhoto.src, function(img) {
      img.set({
        selectable: false,
        evented: false,
        scaleX: comparisonCanvas.width / img.width,
        scaleY: comparisonCanvas.height / img.height
      });
      comparisonCanvas.setBackgroundImage(img, comparisonCanvas.renderAll.bind(comparisonCanvas));
    });
    // Load the after image as an overlay (semi-transparent)
    fabric.Image.fromURL(afterPhoto.src, function(img) {
      img.set({
        opacity: 0.5,
        selectable: false,
        evented: false,
        scaleX: comparisonCanvas.width / img.width,
        scaleY: comparisonCanvas.height / img.height
      });
      comparisonCanvas.add(img);
    });
  });
  
  // Close advanced comparison editor modal
  $("#close-comparison-editor").on("click", function() {
    $("#comparison-editor-modal").hide();
  });
  
  // Sticker functionality: add sticker to comparison canvas
  $(".sticker-btn").on("click", function() {
    const stickerUrl = $(this).data("sticker");
    fabric.Image.fromURL(stickerUrl, function(img) {
      img.set({ left: 50, top: 50, scaleX: 0.5, scaleY: 0.5 });
      comparisonCanvas.add(img);
    });
  });
  
  // Export advanced comparison as image
  $("#export-comparison-btn").on("click", function() {
    html2canvas(document.getElementById("comparisonCanvas")).then(canvas => {
      let link = document.createElement("a");
      link.download = "comparison_export.png";
      link.href = canvas.toDataURL();
      link.click();
    });
  });
  
  // Export report as image
  $("#export-report-btn").on("click", function() {
    html2canvas(document.getElementById("main-app")).then(canvas => {
      let link = document.createElement("a");
      link.download = "fitjourney_report.png";
      link.href = canvas.toDataURL();
      link.click();
    });
  });
  
  // Social share buttons (dummy implementation)
  $(".share-btn").on("click", function() {
    const platform = $(this).data("platform");
    alert(`Sharing to ${platform} (functionality to be implemented).`);
  });
});
