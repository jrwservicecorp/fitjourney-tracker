/* script.js - FitJourney Tracker - Tesla Edition */

document.addEventListener("DOMContentLoaded", function () {
  // Set app version
  const appVersionElem = document.getElementById("app-version");
  if (appVersionElem) {
    appVersionElem.textContent = "v2.0";
  }

  // Global arrays to store logs
  let dataLogs = [];
  let photoLogs = [];

  // Create the Chart.js instance only once
  const ctx = document.getElementById('weightChart').getContext('2d');
  let weightChart = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [{
        label: 'Weight (lbs)',
        data: [],
        borderColor: '#007bff',
        backgroundColor: 'rgba(0,123,255,0.2)',
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

  // Function to update the chart with current dataLogs
  function updateChart() {
    // Update the dataset for the chart
    weightChart.data.datasets[0].data = dataLogs.map(log => ({ x: log.date, y: log.weight }));
    weightChart.update();
  }

  // Function to update the weight summary section
  function updateSummary() {
    const summaryDiv = document.getElementById("weight-summary");
    if (!summaryDiv) return;
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

  // Function to update recent weigh-ins section
  function updateRecentWeighIns() {
    const recentDiv = document.getElementById("recent-weighins");
    if (!recentDiv) return;
    if (dataLogs.length === 0) {
      recentDiv.innerHTML = '<p class="placeholder">No weigh-ins recorded yet.</p>';
      return;
    }
    recentDiv.innerHTML = "";
    // Show the five most recent logs (reverse sorted)
    const recent = dataLogs.slice(-5).reverse();
    recent.forEach(log => {
      const p = document.createElement("p");
      p.textContent = `${log.date}: ${log.weight} lbs`;
      recentDiv.appendChild(p);
    });
  }

  // If demo data toggle is enabled and there are no logs, add demo data
  const toggleDemo = document.getElementById("toggle-demo-data");
  if (toggleDemo && toggleDemo.checked && dataLogs.length === 0) {
    const demoData = [
      { date: '2023-01-01', weight: 200, waist: 34, hips: 36, chest: 40 },
      { date: '2023-02-01', weight: 195, waist: 33.5, hips: 35.5, chest: 39 },
      { date: '2023-03-01', weight: 190, waist: 33, hips: 35, chest: 38 }
    ];
    demoData.forEach(log => addDataLog(log));
    updateChart();
    updateSummary();
    updateRecentWeighIns();
  }

  // Data log form submission
  const dataLogForm = document.getElementById("data-log-form");
  if (dataLogForm) {
    dataLogForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const weight = parseFloat(document.getElementById("weight-input").value);
      const date = document.getElementById("date-input").value;
      const waist = parseFloat(document.getElementById("waist-input").value) || null;
      const hips = parseFloat(document.getElementById("hips-input").value) || null;
      const chest = parseFloat(document.getElementById("chest-input").value) || null;
      if (!weight || !date) {
        alert("Please enter both weight and date.");
        return;
      }
      addDataLog({ date, weight, waist, hips, chest });
      updateChart();
      updateSummary();
      updateRecentWeighIns();
      dataLogForm.reset();
    });
  }

  // Helper function to add a data log and sort by date
  function addDataLog(log) {
    dataLogs.push(log);
    dataLogs.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  // Photo upload form submission
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

  // Function to update the photo gallery
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

  // Initialize TwentyTwenty plugin using your local file
  $(document).ready(function () {
    if ($.fn.twentytwenty) {
      $("#twentytwenty-container").twentytwenty();
    } else {
      console.error("TwentyTwenty plugin failed to load.");
    }
  });

  // Update comparison panel with selected photos
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

  // Export report as image using html2canvas
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
