/* script.js - FitJourney Tracker - Modern Edition - JS v3.1 */

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded");
  document.getElementById("app-version").textContent = "v3.1";

  // Global arrays
  let dataLogs = [];
  let nutritionLogs = [];
  let photoLogs = [];
  let editorCanvas; // Fabric.js canvas for advanced editor

  // Initialize Weight Chart (Chart.js with Luxon)
  const weightCtx = document.getElementById('weightChart').getContext('2d');
  const weightChart = new Chart(weightCtx, {
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

  // Initialize Nutrition Chart (Bar chart for calories)
  const nutritionCtx = document.getElementById('nutritionChart').getContext('2d');
  const nutritionChart = new Chart(nutritionCtx, {
    type: 'bar',
    data: {
      labels: [],
      datasets: [{
        label: 'Calories (kcal)',
        data: [],
        backgroundColor: '#28a745'
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: { title: { display: true, text: 'Date' } },
        y: { title: { display: true, text: 'Calories (kcal)' } }
      }
    }
  });

  // Demo Data if demo checkbox is checked
  const toggleDemo = document.getElementById("toggle-demo-data");
  if (toggleDemo.checked && dataLogs.length === 0) {
    const demoData = [
      { date: '2023-01-01', weight: 200, waist: 34, hips: 36, chest: 40, calories: 2500 },
      { date: '2023-02-01', weight: 195, waist: 33.5, hips: 35.5, chest: 39, calories: 2450 },
      { date: '2023-03-01', weight: 190, waist: 33, hips: 35, chest: 38, calories: 2400 }
    ];
    const demoNutrition = [
      { date: '2023-01-01', food: 'Chicken Breast', weight: 150, calories: 250, protein: 40, fat: 3, carbs: 0 },
      { date: '2023-01-02', food: 'Oatmeal', weight: 50, calories: 180, protein: 6, fat: 3, carbs: 32 }
    ];
    demoData.forEach(log => addDataLog(log));
    demoNutrition.forEach(log => addNutritionLog(log));
    updateWeightChart();
    updateNutritionChart();
    updateSummary();
    updateRecentWeighIns();
    updateCalorieSummary();
    updateNutritionDisplay();
  }

  // Body Weight Log Form Submission
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
    updateWeightChart();
    updateSummary();
    updateRecentWeighIns();
    updateCalorieSummary();
    this.reset();
  });

  function addDataLog(log) {
    dataLogs.push(log);
    dataLogs.sort((a, b) => new Date(a.date) - new Date(b.date));
    console.log("Data logs:", dataLogs);
  }

  function updateWeightChart() {
    weightChart.data.datasets[0].data = dataLogs.map(log => ({ x: log.date, y: log.weight }));
    weightChart.update();
  }

  function updateSummary() {
    const summaryDiv = document.getElementById("weight-summary");
    if (dataLogs.length === 0) {
      summaryDiv.innerHTML = '<p class="placeholder">No weight data available.</p>';
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
    if (dataLogs.length === 0) {
      calorieDiv.innerHTML = '<p class="placeholder">No calorie data available.</p>';
      return;
    }
    const recent = dataLogs.slice(-3);
    const avg = recent.reduce((sum, log) => sum + (log.calories || 0), 0) / recent.length;
    calorieDiv.innerHTML = `<p>Average Calories: ${Math.round(avg)} kcal</p>`;
  }

  // Nutrition Log Form Submission
  document.getElementById("nutrition-log-form").addEventListener("submit", function(e) {
    e.preventDefault();
    const food = document.getElementById("food-name").value;
    const weight = parseFloat(document.getElementById("food-weight").value);
    const calories = parseFloat(document.getElementById("food-calories").value);
    const protein = parseFloat(document.getElementById("food-protein").value) || 0;
    const fat = parseFloat(document.getElementById("food-fat").value) || 0;
    const carbs = parseFloat(document.getElementById("food-carbs").value) || 0;
    const date = document.getElementById("nutrition-date").value;
    if (!food || !weight || !calories || !date) {
      alert("Please complete all required fields.");
      return;
    }
    addNutritionLog({ food, weight, calories, protein, fat, carbs, date });
    updateNutritionChart();
    updateNutritionDisplay();
    this.reset();
  });

  function addNutritionLog(log) {
    nutritionLogs.push(log);
    nutritionLogs.sort((a, b) => new Date(a.date) - new Date(b.date));
    console.log("Nutrition logs:", nutritionLogs);
  }

  function updateNutritionChart() {
    let dates = [];
    let calValues = [];
    nutritionLogs.forEach(log => {
      if (!dates.includes(log.date)) {
        dates.push(log.date);
        calValues.push(log.calories);
      } else {
        const idx = dates.indexOf(log.date);
        calValues[idx] += log.calories;
      }
    });
    nutritionChart.data.labels = dates;
    nutritionChart.data.datasets[0].data = calValues;
    nutritionChart.update();
  }

  function updateNutritionDisplay() {
    const displayDiv = document.getElementById("nutrition-log-display");
    if (nutritionLogs.length === 0) {
      displayDiv.innerHTML = '<p class="placeholder">No nutrition logs recorded yet.</p>';
      return;
    }
    let html = '<table class="table table-striped"><thead><tr><th>Date</th><th>Food</th><th>Weight (g)</th><th>Calories</th><th>Protein</th><th>Fat</th><th>Carbs</th></tr></thead><tbody>';
    nutritionLogs.forEach(log => {
      html += `<tr>
        <td>${log.date}</td>
        <td>${log.food}</td>
        <td>${log.weight}</td>
        <td>${log.calories}</td>
        <td>${log.protein}</td>
        <td>${log.fat}</td>
        <td>${log.carbs}</td>
      </tr>`;
    });
    html += '</tbody></table>';
    displayDiv.innerHTML = html;
  }

  // Nutrition Food Search using Nutritionix API (requires your API keys)
  $("#search-food-btn").on("click", function() {
    const query = $("#food-search").val().trim();
    if (!query) {
      alert("Please enter a food name to search.");
      return;
    }
    const appId = "YOUR_APP_ID";  // Replace with your Nutritionix App ID
    const appKey = "YOUR_APP_KEY"; // Replace with your Nutritionix App Key
    const url = `https://trackapi.nutritionix.com/v2/natural/nutrients`;
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-app-id": appId,
        "x-app-key": appKey
      },
      body: JSON.stringify({ query: query })
    })
    .then(response => response.json())
    .then(data => {
      console.log("Nutritionix response:", data);
      if (data.foods && data.foods.length > 0) {
        const foodData = data.foods[0];
        $("#food-name").val(foodData.food_name);
        $("#food-weight").val(foodData.serving_weight_grams);
        $("#food-calories").val(foodData.nf_calories);
        $("#food-protein").val(foodData.nf_protein);
        $("#food-fat").val(foodData.nf_total_fat);
        $("#food-carbs").val(foodData.nf_total_carbohydrate);
      } else {
        alert("No food data found.");
      }
    })
    .catch(error => {
      console.error("Error fetching food data:", error);
      alert("Error fetching food data. Check the console for details.");
    });
  });

  // Photo Upload Form Submission
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
          <img src="${photo.src}" alt="Progress Photo" class="img-fluid">
          <p>Date: ${photo.date}</p>
        </div>
      `);
    });
  }

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
            <img src="${photo.src}" alt="Progress Photo" class="img-fluid">
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

  // Update Photo Selectors for Comparison
  function updatePhotoSelectors() {
    console.log("Updating photo selectors", photoLogs);
    const beforeSelect = $("#tt-before");
    const afterSelect = $("#tt-after");
    beforeSelect.empty();
    afterSelect.empty();
    photoLogs.forEach((photo, index) => {
      beforeSelect.append(`<option value="${index}">${photo.date}</option>`);
      afterSelect.append(`<option value="${index}">${photo.date}</option>`);
    });
  }

  // Initialize TwentyTwenty plugin when ready
  $(document).ready(function () {
    if ($.fn.twentytwenty) {
      $("#twentytwenty-container").twentytwenty();
    } else {
      console.error("TwentyTwenty plugin failed to load.");
    }
  });

  // Update Comparison Panel with Selected Photos
  $("#tt-update").on("click", function() {
    console.log("Update comparison button clicked");
    const beforeIndex = parseInt($("#tt-before").val());
    const afterIndex = parseInt($("#tt-after").val());
    console.log("Before index:", beforeIndex, "After index:", afterIndex);
    if (isNaN(beforeIndex) || isNaN(afterIndex)) {
      alert("Please select both before and after photos.");
      return;
    }
    if (photoLogs.length === 0) {
      alert("No photos available");
      return;
    }
    const beforePhoto = photoLogs[beforeIndex];
    const afterPhoto = photoLogs[afterIndex];
    const container = $("#twentytwenty-container");
    container.empty();
    const $beforeImg = $(`<img class="twentytwenty-before" src="${beforePhoto.src}" alt="Before">`);
    const $afterImg = $(`<img class="twentytwenty-after" src="${afterPhoto.src}" alt="After">`);
    container.append($beforeImg, $afterImg);
    container.find("img").css({ "max-width": "100%", "height": "auto" });
    let loadedCount = 0;
    container.find("img").each(function() {
      $(this).on("load", function() {
        loadedCount++;
        if (loadedCount === 2) {
          container.twentytwenty();
          console.log("Comparison updated with before and after photos");
        }
      });
    });
  });

  // Advanced Comparison Editor Functions
  $("#open-editor-btn").on("click", function() {
    openComparisonEditor();
  });

  function openComparisonEditor() {
    if (photoLogs.length < 2) {
      alert("Please upload at least two photos and select them for comparison.");
      return;
    }
    const beforeIndex = parseInt($("#tt-before").val()) || 0;
    const afterIndex = parseInt($("#tt-after").val()) || 1;
    const beforePhoto = photoLogs[beforeIndex];
    const afterPhoto = photoLogs[afterIndex];
    $("#comparison-editor-modal").show();
    editorCanvas = new fabric.Canvas('comparisonCanvas', {
      backgroundColor: '#f7f7f7',
      selection: true
    });
    editorCanvas.clear();
    fabric.Image.fromURL(beforePhoto.src, function(img) {
      img.set({ left: 0, top: 0, scaleX: 0.5, scaleY: 0.5, selectable: true });
      editorCanvas.add(img);
    });
    fabric.Image.fromURL(afterPhoto.src, function(img) {
      img.set({ left: 300, top: 0, scaleX: 0.5, scaleY: 0.5, selectable: true });
      editorCanvas.add(img);
    });
  }

  $("#add-text-btn").on("click", function() {
    if (editorCanvas) {
      const text = new fabric.IText('New Overlay', { left: 50, top: 50, fill: '#333', fontSize: 20 });
      editorCanvas.add(text);
      editorCanvas.setActiveObject(text);
    }
  });

  $("#save-editor-btn").on("click", function() {
    if (editorCanvas) {
      const dataURL = editorCanvas.toDataURL({ format: 'png' });
      const container = $("#twentytwenty-container");
      container.empty();
      const $editedImg = $(`<img src="${dataURL}" alt="Edited Comparison">`);
      container.append($editedImg);
      $("#comparison-editor-modal").hide();
      editorCanvas.dispose();
      editorCanvas = null;
      console.log("Advanced editor changes saved to main comparison area");
    }
  });

  $("#close-comparison-editor").on("click", function() {
    $("#comparison-editor-modal").hide();
    if (editorCanvas) {
      editorCanvas.dispose();
      editorCanvas = null;
    }
  });

  $("#export-comparison-btn").on("click", function() {
    if (editorCanvas) {
      const dataURL = editorCanvas.toDataURL({ format: 'png' });
      let link = document.createElement("a");
      link.download = "comparison_for_instagram.png";
      link.href = dataURL;
      link.click();
    }
  });

  $("#export-report-btn").on("click", function() {
    html2canvas(document.getElementById("main-app")).then(canvas => {
      let link = document.createElement("a");
      link.download = "fitjourney_report.png";
      link.href = canvas.toDataURL();
      link.click();
    });
  });

  $(".share-btn").on("click", function() {
    const platform = $(this).data("platform");
    alert(`Sharing to ${platform} (functionality to be implemented).`);
  });
});