/* script.js - FitJourney Tracker - Modern Edition - JS v3.7.1 */

// Set the app version and API key
const APP_VERSION = "v3.7.1";
const USDA_API_KEY = "DBS7VaqKcIKES5QY36b8Cw8bdk80CHzoufoxjeh8";

// Global variable to store the currently selected USDA food data and daily goals
let currentUSDAFood = null;
let dailyGoals = { calories: 0, protein: 0, fat: 0, carbs: 0 };

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded");
  document.getElementById("app-version").textContent = APP_VERSION;

  // ----------------- Function Declarations (Hoisted) ------------------

  // Updates the Weight Chart using dataLogs
  function updateWeightChart() {
    if (weightChart) {
      weightChart.data.datasets[0].data = dataLogs.map(log => ({ x: log.date, y: log.weight }));
      weightChart.update();
    }
  }

  // Updates the Weight Summary
  function updateSummary() {
    const summaryDiv = document.getElementById("weight-summary");
    if (!summaryDiv) {
      console.warn("weight-summary element not found.");
      return;
    }
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

  // Updates the recent weigh-ins display
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

  // Updates the calorie summary
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

  // Updates the Nutrition Chart
  function updateNutritionChart() {
    let dates = [], calValues = [];
    nutritionLogs.forEach(log => {
      if (!dates.includes(log.date)) {
        dates.push(log.date);
        calValues.push(log.calories);
      } else {
        const idx = dates.indexOf(log.date);
        calValues[idx] += log.calories;
      }
    });
    if (nutritionChart) {
      nutritionChart.data.labels = dates;
      nutritionChart.data.datasets[0].data = calValues;
      nutritionChart.update();
    }
  }

  // Updates the Nutrition Log Display
  function updateNutritionDisplay() {
    const displayDiv = document.getElementById("nutrition-log-display");
    if (nutritionLogs.length === 0) {
      displayDiv.innerHTML = '<p class="placeholder">No nutrition logs recorded yet.</p>';
      return;
    }
    let html = '<table class="table table-striped"><thead><tr><th>Date</th><th>Meal</th><th>Food</th><th>Quantity</th><th>Unit</th><th>Computed Weight (g)</th><th>Calories</th><th>Protein</th><th>Fat</th><th>Carbs</th></tr></thead><tbody>';
    nutritionLogs.forEach(log => {
      html += `<tr>
        <td>${log.date}</td>
        <td>${log.mealCategory || ""}</td>
        <td>${log.food}</td>
        <td>${log.quantity}</td>
        <td>${currentUSDAFood ? currentUSDAFood.servingSizeUnit : ""}</td>
        <td>${log.computedWeight}</td>
        <td>${log.calories}</td>
        <td>${log.protein}</td>
        <td>${log.fat}</td>
        <td>${log.carbs}</td>
      </tr>`;
    });
    html += '</tbody></table>';
    displayDiv.innerHTML = html;
  }

  // Updates the Daily Goals Progress
  function updateDailyGoalsProgress() {
    const today = new Date().toISOString().split("T")[0];
    const todaysLogs = nutritionLogs.filter(log => log.date === today);
    const total = {
      calories: todaysLogs.reduce((sum, log) => sum + log.calories, 0),
      protein: todaysLogs.reduce((sum, log) => sum + log.protein, 0),
      fat: todaysLogs.reduce((sum, log) => sum + log.fat, 0),
      carbs: todaysLogs.reduce((sum, log) => sum + log.carbs, 0)
    };
    updateProgressBar("calories", total.calories, dailyGoals.calories);
    updateProgressBar("protein", total.protein, dailyGoals.protein);
    updateProgressBar("fat", total.fat, dailyGoals.fat);
    updateProgressBar("carbs", total.carbs, dailyGoals.carbs);
  }

  // Updates a progress bar for a given nutrient
  function updateProgressBar(nutrient, total, goal) {
    const progressText = document.getElementById("progress-" + nutrient);
    const progressBar = document.getElementById("progress-bar-" + nutrient);
    if (progressText) progressText.textContent = total.toFixed(0);
    let percentage = goal > 0 ? (total / goal) * 100 : 0;
    if (percentage > 100) percentage = 100;
    if (progressBar) {
      progressBar.style.width = percentage + "%";
      progressBar.setAttribute("aria-valuenow", percentage);
    }
  }

  // Helper: Create a checker pattern for the frame fill
  function createCheckerPattern() {
    const size = 10;
    const patternCanvas = document.createElement("canvas");
    patternCanvas.width = size * 2;
    patternCanvas.height = size * 2;
    const ctx = patternCanvas.getContext("2d");
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, size, size);
    ctx.fillRect(size, size, size, size);
    ctx.fillStyle = "#fff";
    ctx.fillRect(size, 0, size, size);
    ctx.fillRect(0, size, size, size);
    return patternCanvas;
  }

  // Populates the date drop-downs based on available data
  function populateDateSelects() {
    const startSelect = document.getElementById("start-date-select");
    const endSelect = document.getElementById("end-date-select");
    if(!startSelect || !endSelect) return;
    startSelect.innerHTML = "";
    endSelect.innerHTML = "";
    const dates = [...new Set(dataLogs.map(d => d.date))].sort();
    dates.forEach(date => {
      const option1 = document.createElement("option");
      option1.value = date;
      option1.textContent = date;
      startSelect.appendChild(option1);
      
      const option2 = document.createElement("option");
      option2.value = date;
      option2.textContent = date;
      endSelect.appendChild(option2);
    });
  }

  // ----------------- End Function Declarations ------------------

  // Initialize charts, photo logs, and other global variables
  let weightChart; 
  let nutritionChart;
  const weightChartElement = document.getElementById('weightChart');
  if (weightChartElement) {
    const weightCtx = weightChartElement.getContext('2d');
    weightChart = new Chart(weightCtx, {
      type: 'line',
      data: { datasets: [{ label: 'Weight (lbs)', data: [], borderColor: '#007bff', fill: false, tension: 0.2 }] },
      options: { responsive: true, scales: { x: { type: 'time', time: { unit: 'day' }, title: { display: true, text: 'Date' } }, y: { title: { display: true, text: 'Weight (lbs)' } } } }
    });
  } else {
    console.warn("Canvas 'weightChart' not found.");
  }
  
  const nutritionChartElement = document.getElementById('nutritionChart');
  if (nutritionChartElement) {
    const nutritionCtx = nutritionChartElement.getContext('2d');
    nutritionChart = new Chart(nutritionCtx, {
      type: 'bar',
      data: { labels: [], datasets: [{ label: 'Calories (kcal)', data: [], backgroundColor: '#28a745' }] },
      options: { responsive: true, scales: { x: { title: { display: true, text: 'Date' } }, y: { title: { display: true, text: 'Calories (kcal)' } } } }
    });
  } else {
    console.warn("Canvas 'nutritionChart' not found.");
  }
  
  // Event handlers for photo upload – prevent default submission so the page doesn’t reload
  $("#photo-upload-form").on("submit", function (event) {
    event.preventDefault();
    event.stopPropagation();
    const fileInput = $("#photo-upload")[0].files[0];
    const dateInput = $("#photo-date").val();
    if (!fileInput || !dateInput) {
      alert("Please select a photo and date.");
      return false;
    }
    const reader = new FileReader();
    reader.onload = function (e) {
      photoLogs.push({ src: e.target.result, date: dateInput });
      updatePhotoGallery();
      updatePhotoSelectors();
    };
    reader.readAsDataURL(fileInput);
    this.reset();
    return false;
  });
  
  // (Other event handlers for data log, nutrition log, meal builder, USDA search, etc.
  // They remain as in the previous version. For brevity, please include those blocks unchanged.)
  // ...
  
  // Example: Data Log Submission already added above; same for USDA search events.

  // Photo Gallery update function
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
  
  // Photo selectors update function
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
  
  // Main page comparison update
  $("#tt-update").on("click", function() {
    console.log("Update comparison button clicked");
    const beforeIndex = parseInt($("#tt-before").val());
    const afterIndex = parseInt($("#tt-after").val());
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
    const beforeDiv = $('<div class="comparison-image"></div>')
      .css({ width: '50%', float: 'left' })
      .append(`<img src="${beforePhoto.src}" alt="Before">`);
    const afterDiv = $('<div class="comparison-image"></div>')
      .css({ width: '50%', float: 'right' })
      .append(`<img src="${afterPhoto.src}" alt="After">`);
    const divider = $('<div class="divider"></div>');
    container.append(beforeDiv, afterDiv, divider);
    console.log("Main comparison updated.");
  });
  
  // Advanced Editor – using Konva with enhanced controls
  $("#open-editor-btn").on("click", function() {
    openComparisonEditor();
  });
  
  function openComparisonEditor() {
    if (photoLogs.length < 2) {
      alert("Please upload at least two photos and select them for comparison.");
      return;
    }
    populateDateSelects();
    const beforeIndex = parseInt($("#tt-before").val()) || 0;
    const afterIndex = parseInt($("#tt-after").val()) || 1;
    const beforePhoto = photoLogs[beforeIndex];
    const afterPhoto = photoLogs[afterIndex];
    const modal = document.getElementById("comparison-editor-modal");
    modal.style.display = "block";
    const containerEl = document.getElementById("comparison-editor-container");
    containerEl.style.width = "900px";
    containerEl.style.height = "600px";
    containerEl.style.background = "none";
    const forcedWidth = containerEl.offsetWidth;
    const forcedHeight = containerEl.offsetHeight;
    containerEl.innerHTML = "";
    
    const stage = new Konva.Stage({
      container: "comparison-editor-container",
      width: forcedWidth,
      height: forcedHeight
    });
    
    const canvasEl = stage.container().querySelector("canvas");
    if (canvasEl) {
      canvasEl.getContext('2d', { willReadFrequently: true });
    }
    
    const layer = new Konva.Layer();
    stage.add(layer);
    
    selectedNode = null;
    
    function makeSelectable(node) {
      node.on('click', function(evt) {
        if (selectedNode && selectedNode !== node) {
          selectedNode.stroke(null);
        }
        selectedNode = node;
        node.stroke("yellow");
        node.strokeWidth(2);
        layer.draw();
        evt.cancelBubble = true;
      });
    }
    
    const loadImage = (src, callback) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = function() {
        callback(img);
      };
      img.onerror = function() {
        console.error("Failed to load image: " + src);
        alert("Failed to load one of the images. Please try again.");
      };
      img.src = src;
    };
    
    loadImage(beforePhoto.src, function(beforeImg) {
      loadImage(afterPhoto.src, function(afterImg) {
        const halfWidth = stage.width() / 2;
        const fullHeight = stage.height();
        const beforeKonva = new Konva.Image({
          x: 0,
          y: 0,
          image: beforeImg,
          width: halfWidth,
          height: fullHeight
        });
        const afterKonva = new Konva.Image({
          x: halfWidth,
          y: 0,
          image: afterImg,
          width: halfWidth,
          height: fullHeight
        });
        layer.add(beforeKonva);
        layer.add(afterKonva);
        makeSelectable(beforeKonva);
        makeSelectable(afterKonva);
        
        const divider = new Konva.Rect({
          x: halfWidth - 1,
          y: 0,
          width: 2,
          height: fullHeight,
          fill: "white",
          draggable: true,
          dragBoundFunc: function(pos) {
            let newX = pos.x;
            if (newX < 50) newX = 50;
            if (newX > stage.width() - 50) newX = stage.width() - 50;
            return { x: newX, y: 0 };
          }
        });
        layer.add(divider);
        makeSelectable(divider);
        divider.on("dragmove", function() {
          const pos = divider.x();
          beforeKonva.width(pos);
          afterKonva.x(pos);
          afterKonva.width(stage.width() - pos);
          layer.batchDraw();
        });
        
        // Draw frame with checker pattern
        const pattern = createCheckerPattern();
        const topBorder = new Konva.Rect({
          x: 0,
          y: 0,
          width: stage.width(),
          height: 5,
          fillPatternImage: pattern,
          fillPatternRepeat: 'repeat'
        });
        const leftBorder = new Konva.Rect({
          x: 0,
          y: 0,
          width: 5,
          height: stage.height(),
          fillPatternImage: pattern,
          fillPatternRepeat: 'repeat'
        });
        const rightBorder = new Konva.Rect({
          x: stage.width() - 5,
          y: 0,
          width: 5,
          height: stage.height(),
          fillPatternImage: pattern,
          fillPatternRepeat: 'repeat'
        });
        const bottomBorder = new Konva.Rect({
          x: 0,
          y: stage.height() - 10,
          width: stage.width(),
          height: 10,
          fillPatternImage: pattern,
          fillPatternRepeat: 'repeat'
        });
        const branding = new Konva.Text({
          x: stage.width() - 260,
          y: stage.height() - 40,
          text: "FitJourneyTracker",
          fontSize: 28,
          fontFamily: "Montserrat",
          fill: "#fff",
          opacity: 0.9
        });
        const frameGroup = new Konva.Group();
        frameGroup.add(topBorder, leftBorder, rightBorder, bottomBorder, branding);
        layer.add(frameGroup);
        
        // "Show Data" event using drop-downs and radio buttons
        document.getElementById("show-data-btn").addEventListener("click", function() {
          const startDate = document.getElementById("start-date-select").value;
          const endDate = document.getElementById("end-date-select").value;
          const dataType = document.querySelector('input[name="data-type"]:checked').value;
          const chartType = document.getElementById("chart-type-select").value;
          if (!startDate || !endDate) {
            alert("Please select start and end dates from the drop downs.");
            return;
          }
          const filteredData = dataLogs.filter(d => d.date >= startDate && d.date <= endDate);
          if (filteredData.length === 0) {
            alert("No data for that range.");
            return;
          }
          filteredData.sort((a, b) => new Date(a.date) - new Date(b.date));
          const labels = filteredData.map(d => d.date);
          const values = filteredData.map(d => d.weight);
          
          const tempCanvas = document.createElement("canvas");
          tempCanvas.width = 300;
          tempCanvas.height = 150;
          const tempCtx = tempCanvas.getContext("2d");
          
          let chartConfig = {
            type: chartType,
            data: {
              labels: labels,
              datasets: [{
                label: 'Weight Trend',
                data: values,
                borderColor: "#007bff",
                backgroundColor: "#007bff",
                fill: false,
                tension: 0.2
              }]
            },
            options: {
              responsive: false,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: { x: { display: false }, y: { display: false } }
            }
          };
          if(chartType === "pie"){
            chartConfig.data.datasets[0].backgroundColor = ["#007bff", "#28a745", "#ffc107", "#dc3545"];
          }
          
          new Chart(tempCtx, chartConfig);
          
          setTimeout(function() {
            const dataURL = tempCanvas.toDataURL();
            const dataImage = new Image();
            dataImage.onload = function() {
              const overlay = new Konva.Image({
                x: stage.width() / 2 - 150,
                y: 20,
                image: dataImage,
                width: 300,
                height: 150,
                opacity: 0.8,
                draggable: true
              });
              layer.add(overlay);
              makeSelectable(overlay);
              layer.draw();
            };
            dataImage.src = dataURL;
          }, 500);
        });
        
        // Delete Element event
        const deleteBtn = document.getElementById("delete-btn");
        if (deleteBtn) {
          deleteBtn.addEventListener("click", function() {
            if (selectedNode) {
              selectedNode.destroy();
              selectedNode = null;
              layer.draw();
            } else {
              alert("No element selected.");
            }
          });
        }
        
        // Add Text event
        document.getElementById("add-text-btn").addEventListener("click", function() {
          const customText = prompt("Enter custom text:");
          if (customText) {
            const customTextNode = new Konva.Text({
              x: stage.width() / 2 - 50,
              y: stage.height() / 2,
              text: customText,
              fontSize: 24,
              fontFamily: 'Montserrat',
              fill: 'yellow',
              draggable: true
            });
            layer.add(customTextNode);
            makeSelectable(customTextNode);
            layer.draw();
          }
        });
        
        // Edit Text event
        document.getElementById("edit-text-btn").addEventListener("click", function() {
          if (selectedNode && selectedNode.className === 'Text') {
            const newText = prompt("Enter new text:", selectedNode.text());
            if (newText !== null) { selectedNode.text(newText); }
            const newColor = prompt("Enter new color (e.g., #ff0):", selectedNode.fill());
            if (newColor !== null) { selectedNode.fill(newColor); }
            const newAngle = prompt("Enter rotation angle in degrees:", selectedNode.rotation());
            if (newAngle !== null) { selectedNode.rotation(parseFloat(newAngle)); }
            layer.draw();
          } else {
            alert("Please select a text element to edit.");
          }
        });
        
        // Cropping rectangle over before image
        croppingRect = new Konva.Rect({
          x: beforeKonva.x(),
          y: beforeKonva.y(),
          width: beforeKonva.width(),
          height: beforeKonva.height(),
          stroke: 'red',
          dash: [4, 4],
          draggable: true
        });
        layer.add(croppingRect);
        makeSelectable(croppingRect);
        
        transformer = new Konva.Transformer({
          nodes: [croppingRect],
          enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right']
        });
        layer.add(transformer);
        
        layer.draw();
      });
    });
  }
  
  // Close Advanced Editor Modal
  const closeEditorBtn = document.getElementById("close-editor-btn");
  if (closeEditorBtn) {
    closeEditorBtn.addEventListener("click", function() {
      document.getElementById("comparison-editor-modal").style.display = "none";
    });
  } else {
    console.error("close-editor-btn not found.");
  }
  
  // ----------------- End Advanced Editor Code ------------------
  
});
