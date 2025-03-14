/* script.js - FitJourney Tracker - Modern Edition - JS v3.2 */

// Set the app version here:
const APP_VERSION = "v3.2";

// USDA FoodData Central API Key
const USDA_API_KEY = "DBS7VaqKcIKES5QY36b8Cw8bdk80CHzoufoxjeh8";

// Global variable to store the currently selected USDA food data (including serving info & nutrients)
let currentUSDAFood = null;

// Global daily goals object
let dailyGoals = { calories: 0, protein: 0, fat: 0, carbs: 0 };

/**
 * Helper function to safely extract a nutrient value from an array.
 * Returns the nutrient's value if found, otherwise returns "N/A".
 */
function getNutrientValue(nutrients, nutrientName) {
  var nutrient = nutrients.find(n => n.nutrientName === nutrientName);
  return nutrient ? nutrient.value : "N/A";
}

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded");
  document.getElementById("app-version").textContent = APP_VERSION;
  
  // Global arrays
  let dataLogs = [];
  let nutritionLogs = [];
  let photoLogs = [];
  let meals = [];
  let editorCanvas; // Fabric.js canvas for advanced editor
  
  // Declare searchTimeout only once
  let searchTimeout;
  
  // Initialize Weight Chart if canvas exists
  const weightChartElement = document.getElementById('weightChart');
  let weightChart;
  if (weightChartElement) {
    const weightCtx = weightChartElement.getContext('2d');
    weightChart = new Chart(weightCtx, {
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
  } else {
    console.warn("Canvas with ID 'weightChart' not found.");
  }
  
  // Initialize Nutrition Chart if canvas exists
  const nutritionChartElement = document.getElementById('nutritionChart');
  let nutritionChart;
  if (nutritionChartElement) {
    const nutritionCtx = nutritionChartElement.getContext('2d');
    nutritionChart = new Chart(nutritionCtx, {
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
  } else {
    console.warn("Canvas with ID 'nutritionChart' not found.");
  }
  
  // (Optional) Demo data
  const toggleDemo = document.getElementById("toggle-demo-data");
  if (toggleDemo.checked && dataLogs.length === 0) {
    const demoData = [
      { date: '2023-01-01', weight: 200, waist: 34, hips: 36, chest: 40, calories: 2500 },
      { date: '2023-02-01', weight: 195, waist: 33.5, hips: 35.5, chest: 39, calories: 2450 },
      { date: '2023-03-01', weight: 190, waist: 33, hips: 35, chest: 38, calories: 2400 }
    ];
    const demoNutrition = [
      { date: '2023-01-01', food: 'Chicken Breast', quantity: 1, computedWeight: 150, calories: 250, protein: 40, fat: 3, carbs: 0, mealCategory: "Breakfast" },
      { date: '2023-01-02', food: 'Oatmeal', quantity: 1, computedWeight: 50, calories: 180, protein: 6, fat: 3, carbs: 32, mealCategory: "Breakfast" }
    ];
    demoData.forEach(log => addDataLog(log));
    demoNutrition.forEach(log => addNutritionLog(log));
    updateWeightChart();
    updateNutritionChart();
    updateSummary();
    updateRecentWeighIns();
    updateCalorieSummary();
    updateNutritionDisplay();
    updateDailyGoalsProgress();
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
    if (weightChart) {
      weightChart.data.datasets[0].data = dataLogs.map(log => ({ x: log.date, y: log.weight }));
      weightChart.update();
    }
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
  
  // Nutrition Log Form Submission – defaults date if missing and includes meal category.
  document.getElementById("nutrition-log-form").addEventListener("submit", function(e) {
    e.preventDefault();
    const food = document.getElementById("food-name").value;
    let quantity = parseFloat(document.getElementById("food-quantity").value);
    if (isNaN(quantity)) {
      alert("Please enter a valid quantity.");
      return;
    }
    // Get conversion factor from the selected unit; default to 1.
    let conversion = parseFloat($("#food-uom option:selected").attr("data-conversion")) || 1;
    let computedWeight = quantity * conversion;
    
    const calories = parseFloat(document.getElementById("food-calories").value);
    const protein = parseFloat(document.getElementById("food-protein").value) || 0;
    const fat = parseFloat(document.getElementById("food-fat").value) || 0;
    const carbs = parseFloat(document.getElementById("food-carbs").value) || 0;
    let date = document.getElementById("nutrition-date").value;
    if (!date) {
      date = new Date().toISOString().split("T")[0];
    }
    const mealCategory = document.getElementById("meal-category").value;
    
    addNutritionLog({ food, quantity, computedWeight, calories, protein, fat, carbs, date, mealCategory });
    updateNutritionChart();
    updateNutritionDisplay();
    updateDailyGoalsProgress();
    this.reset();
    currentUSDAFood = null;
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
      if (dates.indexOf(log.date) === -1) {
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
  
  // ------------------------------
  // Meal Builder Functions
  // ------------------------------
  $("#add-ingredient-btn").on("click", function() {
    const ingredientName = prompt("Enter ingredient name:");
    if (!ingredientName) return;
    const ingredientWeight = parseFloat(prompt("Enter weight (g):"));
    const ingredientCalories = parseFloat(prompt("Enter calories:"));
    const ingredientProtein = parseFloat(prompt("Enter protein (g):")) || 0;
    const ingredientFat = parseFloat(prompt("Enter fat (g):")) || 0;
    const ingredientCarbs = parseFloat(prompt("Enter carbs (g):")) || 0;
    const ingredient = {
      name: ingredientName,
      weight: ingredientWeight,
      calories: ingredientCalories,
      protein: ingredientProtein,
      fat: ingredientFat,
      carbs: ingredientCarbs
    };
    const ingredientHtml = `<div class="meal-ingredient">
      <strong>${ingredient.name}</strong> - ${ingredient.weight}g, ${ingredient.calories} kcal
      (P: ${ingredient.protein}g, F: ${ingredient.fat}g, C: ${ingredient.carbs}g)
    </div>`;
    $("#meal-ingredients-list").append(ingredientHtml);
    let currentIngredients = $("#meal-builder-form").data("ingredients") || [];
    currentIngredients.push(ingredient);
    $("#meal-builder-form").data("ingredients", currentIngredients);
  });
  
  $("#meal-builder-form").on("submit", function(e) {
    e.preventDefault();
    const mealName = $("#meal-name").val();
    const mealCategory = $("#meal-category-builder").val();
    const ingredients = $("#meal-builder-form").data("ingredients") || [];
    if (!mealName || ingredients.length === 0) {
      alert("Please provide a meal name and at least one ingredient.");
      return;
    }
    let totalCalories = 0, totalProtein = 0, totalFat = 0, totalCarbs = 0;
    ingredients.forEach(ing => {
      totalCalories += ing.calories;
      totalProtein += ing.protein;
      totalFat += ing.fat;
      totalCarbs += ing.carbs;
    });
    const meal = {
      name: mealName,
      category: mealCategory,
      ingredients: ingredients,
      totals: {
        calories: totalCalories,
        protein: totalProtein,
        fat: totalFat,
        carbs: totalCarbs
      }
    };
    meals.push(meal);
    displayMeals();
    $("#meal-builder-form").trigger("reset").removeData("ingredients");
    $("#meal-ingredients-list").empty();
  });
  
  function displayMeals() {
    let html = "<h4>Your Meals</h4>";
    meals.forEach(meal => {
      html += `<div class="meal-entry">
        <strong>${meal.name}</strong> (${meal.category})<br>
        Calories: ${meal.totals.calories} kcal, Protein: ${meal.totals.protein}g, Fat: ${meal.totals.fat}g, Carbs: ${meal.totals.carbs}g
        <br><em>Ingredients:</em>`;
      meal.ingredients.forEach(ing => {
        html += `<div class="meal-ingredient">
          ${ing.name} - ${ing.weight}g, ${ing.calories} kcal
        </div>`;
      });
      html += "</div><hr>";
    });
    $("#meals-display").html(html);
  }
  
  // ------------------------------
  // USDA Search & Food Selection with Debouncing and Filtering
  // ------------------------------
  $("#food-name").on("input", function() {
    clearTimeout(searchTimeout);
    const query = $(this).val().trim();
    if (!query) {
      $("#usda-search-results").empty();
      currentUSDAFood = null;
      return;
    }
    if (currentUSDAFood && query.toLowerCase() === currentUSDAFood.description.toLowerCase()) {
      return;
    }
    searchTimeout = setTimeout(function() {
      const url = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${USDA_API_KEY}&query=${encodeURIComponent(query)}&pageSize=5`;
      console.log("USDA search query:", query);
      fetch(url)
        .then(response => response.json())
        .then(data => {
          console.log("USDA response:", data);
          let resultsHtml = "";
          if (data.foods && data.foods.length > 0) {
            let validFoods = data.foods.filter(food => food.foodNutrients && food.foodNutrients.some(n => n.nutrientName === "Energy"));
            if (validFoods.length === 0) {
              $("#usda-search-results").html("<p>No valid foods found. Please add custom food.</p>");
              return;
            }
            validFoods.sort((a, b) => {
              let aRank = (a.foodCategory && a.foodCategory.toLowerCase().includes("fast")) ? 1 : 0;
              let bRank = (b.foodCategory && b.foodCategory.toLowerCase().includes("fast")) ? 1 : 0;
              return aRank - bRank;
            });
            validFoods.forEach(food => {
              const foodEncoded = encodeURIComponent(JSON.stringify(food));
              resultsHtml += `<div class="food-item" data-food="${foodEncoded}">
                <strong>${food.description}</strong>
                <br>Calories: ${food.foodNutrients && Array.isArray(food.foodNutrients) ? (() => {
                  var nutrient = food.foodNutrients.find(n => n.nutrientName === "Energy");
                  return nutrient ? nutrient.value : "N/A";
                })() : "N/A"} kcal
              </div>`;
            });
            resultsHtml += `<div class="food-item">
                <strong>Add Custom Food</strong>
              </div>`;
            $("#usda-search-results").html(resultsHtml);
          } else {
            $("#usda-search-results").html("<p>No foods found. Please add custom food.</p>");
          }
        })
        .catch(error => {
          console.error("Error fetching USDA food data:", error);
          alert("Error fetching food data. Check the console for details.");
        });
    }, 300);
  });
  
  // USDA food item click handler using .closest() and JSON decoding
  $("#usda-search-results").on("click", ".food-item", function() {
    if ($(this).text().trim().toLowerCase().includes("add custom food")) {
      openCustomFoodEntry();
      return;
    }
    try {
      const foodString = $(this).closest(".food-item").attr("data-food");
      if (!foodString) {
        openCustomFoodEntry();
        return;
      }
      const decoded = decodeURIComponent(foodString);
      const foodData = JSON.parse(decoded);
      console.log("Food selected:", foodData);
      console.log("Nutrients:", foodData.foodNutrients);
      const nutrients = Array.isArray(foodData.foodNutrients) ? foodData.foodNutrients : [];
      currentUSDAFood = {
        baseWeight: foodData.servingSize || 100,
        servingSizeUnit: foodData.servingSizeUnit || "serving",
        calories: parseFloat(getNutrientValue(nutrients, "Energy")) || 0,
        protein: parseFloat(getNutrientValue(nutrients, "Protein")) || 0,
        fat: parseFloat(getNutrientValue(nutrients, "Total lipid (fat)")) || 0,
        carbs: parseFloat(getNutrientValue(nutrients, "Carbohydrate, by difference")) || 0,
        foodMeasures: foodData.foodMeasures || []
      };
      $("#food-uom").empty();
      $("#food-uom").append($("<option>")
        .attr("data-conversion", 1)
        .text(currentUSDAFood.servingSizeUnit + " (Default)"));
      if (currentUSDAFood.foodMeasures.length > 0) {
        currentUSDAFood.foodMeasures.forEach(measure => {
          if (measure.gramWeight) {
            $("#food-uom").append($("<option>")
              .attr("data-conversion", measure.gramWeight)
              .text(measure.modifier + " (" + measure.measureUnit + ", ~" + measure.gramWeight + "g)"));
          }
        });
      }
      $("#selected-uom-display").text("Selected Unit: " + currentUSDAFood.servingSizeUnit + " (Default)");
      $("#food-quantity").val(1);
      recalcNutrients();
      $("#food-name").val(foodData.description);
      $("#usda-search-results").empty();
    } catch (error) {
      console.error("Error parsing selected food:", error);
    }
  });
  
  $("#food-uom").on("change", function() {
    let selectedText = $("#food-uom option:selected").text();
    $("#selected-uom-display").text("Selected Unit: " + selectedText);
    recalcNutrients();
  });
  
  $("#food-quantity, #food-uom").on("input change", function() {
    recalcNutrients();
  });
  
  function recalcNutrients() {
    if (!currentUSDAFood) {
      console.log("No USDA food selected yet.");
      return;
    }
    let quantity = parseFloat($("#food-quantity").val());
    if (isNaN(quantity) || quantity <= 0) return;
    let conversion = parseFloat($("#food-uom option:selected").attr("data-conversion")) || 1;
    let computedWeight = quantity * conversion;
    let multiplier = computedWeight / currentUSDAFood.baseWeight;
    let newCalories = (currentUSDAFood.calories * multiplier).toFixed(2);
    let newProtein = (currentUSDAFood.protein * multiplier).toFixed(2);
    let newFat = (currentUSDAFood.fat * multiplier).toFixed(2);
    let newCarbs = (currentUSDAFood.carbs * multiplier).toFixed(2);
    $("#food-calories").val(newCalories);
    $("#food-protein").val(newProtein);
    $("#food-fat").val(newFat);
    $("#food-carbs").val(newCarbs);
    console.log("Recalculated nutrients based on quantity and unit:", { newCalories, newProtein, newFat, newCarbs });
  }
  
  function openCustomFoodEntry() {
    alert("Enter custom food details directly in the form.");
    $("#usda-search-results").empty();
  }
  
  $("#add-custom-food-btn").on("click", function() {
    openCustomFoodEntry();
  });
  
  // ------------------------------
  // Photo Upload & Comparison Code
  // ------------------------------
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
  
  $(document).ready(function () {
    if ($.fn.twentytwenty) {
      $("#twentytwenty-container").twentytwenty();
    } else {
      console.error("TwentyTwenty plugin failed to load.");
    }
  });
  
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
    html2canvas(document.getElementById("main-app")).then(function(canvas) {
      let link = document.createElement("a");
      link.download = "fitjourney_report.png";
      link.href = canvas.toDataURL();
      link.click();
    });
  });
  
  $(".share-btn").on("click", function() {
    const platform = $(this).data("platform");
    alert("Sharing to " + platform + " (functionality to be implemented).");
  });
});
