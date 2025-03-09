/* script.js - FitJourney Tracker - Tesla Edition (v2.1) */

document.addEventListener("DOMContentLoaded", function () {
  // Set app version
  document.getElementById("app-version").textContent = "v2.1";

  // Global arrays to store logs
  let dataLogs = [];
  let photoLogs = [];

  // Initialize Chart.js – note: make sure you load a complete date adapter (e.g. chartjs-adapter-luxon)
  const ctx = document.getElementById('weightChart').getContext('2d');
  const weightChart = new Chart(ctx, {
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

  // Toggle demo data if none exists
  const toggleDemo = document.getElementById("toggle-demo-data");
  if (toggleDemo.checked && dataLogs.length === 0) {
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
  document.getElementById("data-log-form").addEventListener("submit", function(e) {
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
  $("#filter-photos-btn").on("click", function () {
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

  $("#clear-filter-btn").on("click", function () {
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

  // Initialize TwentyTwenty plugin for simple side-by-side comparison
  $(document).ready(function () {
    if ($.fn.twentytwenty) {
      $("#twentytwenty-container").twentytwenty();
    } else {
      console.error("TwentyTwenty plugin failed to load.");
    }
  });

  // Advanced Comparison Editor – when the user clicks "Update Comparison"
  $("#tt-update").on("click", function () {
    const beforeIndex = parseInt($("#tt-before").val());
    const afterIndex = parseInt($("#tt-after").val());
    if (isNaN(beforeIndex) || isNaN(afterIndex)) {
      alert("Please select both before and after photos.");
      return;
    }
    const beforePhoto = photoLogs[beforeIndex];
    const afterPhoto = photoLogs[afterIndex];
    openComparisonEditor(beforePhoto, afterPhoto);
  });

  // Advanced Comparison Editor using Fabric.js
  function openComparisonEditor(beforePhoto, afterPhoto) {
    // Show the modal (ensure this element exists in your HTML)
    $("#comparison-editor-modal").show();
    // Initialize Fabric.js canvas inside the modal
    const canvas = new fabric.Canvas('comparisonCanvas', { width: 600, height: 400 });
    canvas.clear();

    // Load the before image as the base layer
    fabric.Image.fromURL(beforePhoto.src, function (img1) {
      img1.set({
        left: 0,
        top: 0,
        selectable: false,
        scaleX: 600 / img1.width,
        scaleY: 400 / img1.height
      });
      canvas.add(img1);

      // Load the after image on top with adjustable opacity for a blended effect
      fabric.Image.fromURL(afterPhoto.src, function (img2) {
        img2.set({
          left: 0,
          top: 0,
          selectable: false,
          opacity: 0.5,
          scaleX: 600 / img2.width,
          scaleY: 400 / img2.height
        });
        canvas.add(img2);

        // Example: add a draggable text overlay (editable)
        const overlayText = new fabric.Text(`Before: ${beforePhoto.date}\nAfter: ${afterPhoto.date}`, {
          left: 10,
          top: 10,
          fill: '#fff',
          fontSize: 20,
          fontFamily: 'Roboto',
          editable: true
        });
        canvas.add(overlayText);

        // Example: add a sticker image (change the URL to a branded sticker as needed)
        fabric.Image.fromURL('https://via.placeholder.com/50x50.png?text=Sticker', function (sticker) {
          sticker.set({
            left: 500,
            top: 350,
            selectable: true,
            scaleX: 1,
            scaleY: 1
          });
          canvas.add(sticker);
        });
      });
    });

    // Set up Export button for the advanced editor
    $("#export-comparison-btn").off("click").on("click", function () {
      const dataURL = canvas.toDataURL({ format: 'png' });
      // Open the exported image in a new window/tab for sharing
      window.open(dataURL, '_blank');
    });

    // Set up Close button for the editor modal
    $("#close-comparison-editor").off("click").on("click", function () {
      $("#comparison-editor-modal").hide();
      canvas.dispose();
    });
  }

  // Export Report as Image using html2canvas
  $("#export-report-btn").on("click", function () {
    html2canvas(document.getElementById("main-app")).then(canvas => {
      let link = document.createElement("a");
      link.download = "fitjourney_report.png";
      link.href = canvas.toDataURL();
      link.click();
    });
  });

  // Social share buttons (dummy implementation)
  $(".share-btn").on("click", function () {
    const platform = $(this).data("platform");
    alert(`Sharing to ${platform} (functionality to be implemented).`);
  });
});
