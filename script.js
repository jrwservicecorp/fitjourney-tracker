/* script.js - FitJourney Tracker - Modern Edition - JS v3.7.1 */

// Set the app version
const APP_VERSION = "v3.7.1";
// USDA FoodData Central API Key
const USDA_API_KEY = "DBS7VaqKcIKES5QY36b8Cw8bdk80CHzoufoxjeh8";

// Global variable to store the currently selected USDA food data
let currentUSDAFood = null;
// Global daily goals object
let dailyGoals = { calories: 0, protein: 0, fat: 0, carbs: 0 };

function getNutrientValue(nutrients, nutrientName) {
  const nutrient = nutrients.find(n => n.nutrientName === nutrientName);
  return nutrient ? nutrient.value : "N/A";
}

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded");
  document.getElementById("app-version").textContent = APP_VERSION;
  
  // NAVIGATION MENU FUNCTIONALITY
  const navButtons = document.querySelectorAll('.nav-btn');
  navButtons.forEach(button => {
    button.addEventListener('click', function() {
      document.querySelectorAll('section.tile').forEach(section => {
        section.style.display = 'none';
      });
      const target = button.getAttribute('data-target');
      if (target) {
        const targetSection = document.querySelector(target);
        if (targetSection) {
          targetSection.style.display = 'block';
        }
      }
      navButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
    });
  });
  
  let dataLogs = [], nutritionLogs = [], photoLogs = [], meals = [];
  let editorStage, searchTimeout;
  
  // For advanced editor selection
  let selectedNode = null;
  
  // Advanced Editor globals
  let activeImage = null;
  let cropModeActive = false;
  let cropRect = null;
  
  // Keyword arrays for scoring adjustments
  const wholeFoodKeywords = ["poultry", "chicken breast", "chicken thigh", "drumstick", "wing", "fillet", "roast"];
  const processedKeywords = ["canned", "soup", "cold cuts", "pepperoni", "salami", "smoked"];
  
  // Initialize Weight Chart
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
          tension: 0.2
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: { type: 'time', time: { unit: 'day' }, title: { display: true, text: 'Date' } },
          y: { title: { display: true, text: 'Weight (lbs)' } }
        }
      }
    });
  } else {
    console.warn("Canvas 'weightChart' not found.");
  }
  
  // Initialize Nutrition Chart
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
    console.warn("Canvas 'nutritionChart' not found.");
  }
  
  // Load demo data if enabled
  const toggleDemo = document.getElementById("toggle-demo-data");
  if (toggleDemo && toggleDemo.checked && dataLogs.length === 0) {
    const demoData = [
      { date: '2023-01-01', weight: 200, waist: 34, hips: 36, chest: 40, calories: 2500 },
      { date: '2023-02-01', weight: 195, waist: 33.5, hips: 35.5, chest: 39, calories: 2450 },
      { date: '2023-03-01', weight: 190, waist: 33, hips: 35, chest: 38, calories: 2400 }
    ];
    const demoNutrition = [
      { date: '2023-01-01', food: 'Chicken Breast', quantity: 1, computedWeight: 150, calories: 250, protein: 40, fat: 3, carbs: 0, mealCategory: "Breakfast" },
      { date: '2023-01-02', food: 'Oatmeal', quantity: 1, computedWeight: 50, calories: 378, protein: 6, fat: 3, carbs: 32, mealCategory: "Breakfast" }
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
  
  // Data Log Submission
  const dataLogForm = document.getElementById("data-log-form");
  if(dataLogForm){
    dataLogForm.addEventListener("submit", function(e) {
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
  } else {
    console.error("data-log-form not found.");
  }
  
  function addDataLog(log) {
    dataLogs.push(log);
    dataLogs.sort((a, b) => new Date(a.date) - new Date(b.date));
    console.log("Data logs:", dataLogs);
  }
  
  // Updated updateSummary: check element exists before setting innerHTML
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
  
  // Nutrition Log Submission
  const nutritionLogForm = document.getElementById("nutrition-log-form");
  if(nutritionLogForm){
    nutritionLogForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const food = document.getElementById("food-name").value;
      let quantity = parseFloat(document.getElementById("food-quantity").value);
      if (isNaN(quantity)) {
        alert("Please enter a valid quantity.");
        return;
      }
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
  } else {
    console.error("nutrition-log-form not found.");
  }
  
  function addNutritionLog(log) {
    nutritionLogs.push(log);
    nutritionLogs.sort((a, b) => new Date(a.date) - new Date(b.date));
    console.log("Nutrition logs:", nutritionLogs);
  }
  
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
  
  // Meal Builder functions
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
    const meal = { name: mealName, category: mealCategory, ingredients: ingredients, totals: { calories: totalCalories, protein: totalProtein, fat: totalFat, carbs: totalCarbs } };
    meals.push(meal);
    displayMeals();
    $("#meal-builder-form").trigger("reset").removeData("ingredients");
    $("#meal-ingredients-list").empty();
  });
  
  $("#add-ingredient-btn").on("click", function() {
    const ingredientName = prompt("Enter ingredient name:");
    if (!ingredientName) return;
    const ingredientWeight = parseFloat(prompt("Enter weight (g):"));
    const ingredientCalories = parseFloat(prompt("Enter calories:"));
    const ingredientProtein = parseFloat(prompt("Enter protein (g):")) || 0;
    const ingredientFat = parseFloat(prompt("Enter fat (g):")) || 0;
    const ingredientCarbs = parseFloat(prompt("Enter carbs (g):")) || 0;
    const ingredient = { name: ingredientName, weight: ingredientWeight, calories: ingredientCalories, protein: ingredientProtein, fat: ingredientFat, carbs: ingredientCarbs };
    const ingredientHtml = `<div class="meal-ingredient">
      <strong>${ingredient.name}</strong> - ${ingredient.weight}g, ${ingredient.calories} kcal (P: ${ingredient.protein}g, F: ${ingredient.fat}g, C: ${ingredient.carbs}g)
    </div>`;
    $("#meal-ingredients-list").append(ingredientHtml);
    let currentIngredients = $("#meal-builder-form").data("ingredients") || [];
    currentIngredients.push(ingredient);
    $("#meal-builder-form").data("ingredients", currentIngredients);
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
  
  // USDA Search & Food Selection
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
            let validFoods = data.foods.filter(food =>
              food.foodNutrients && food.foodNutrients.some(n => n.nutrientName === "Energy") &&
              !(food.servingSizeUnit && food.servingSizeUnit.toUpperCase() === "IU")
            );
            if (validFoods.length === 0) {
              $("#usda-search-results").html("<p>No valid foods found. Please add custom food.</p>");
              return;
            }
            validFoods.forEach(food => {
              let bonus = 0;
              if (food.dataType && food.dataType.toLowerCase() === "sr legacy") bonus += 100;
              let desc = (food.description || "").toLowerCase();
              let category = (food.foodCategory || "").toLowerCase();
              wholeFoodKeywords.forEach(kw => {
                if (desc.includes(kw) || category.includes(kw)) bonus += 50;
              });
              if (desc.trim() === "chicken") {
                bonus -= 100;
              }
              processedKeywords.forEach(kw => {
                if (desc.includes(kw) || category.includes(kw)) bonus -= 100;
              });
              let servingSizeNum = parseFloat(food.servingSize);
              if (!isNaN(servingSizeNum) && servingSizeNum < 50) bonus -= 50;
              food.adjustedScore = (food.score || 0) + bonus;
            });
            const onlyWhole = $("#whole-food-toggle").is(":checked");
            if (onlyWhole) {
              validFoods = validFoods.filter(food => {
                let desc = (food.description || "").toLowerCase();
                let category = (food.foodCategory || "").toLowerCase();
                return wholeFoodKeywords.some(kw => desc.includes(kw) || category.includes(kw));
              });
            }
            if (validFoods.length === 0) {
              $("#usda-search-results").html("<p>No whole food results found. Please refine your search or add a custom food.</p>");
              return;
            }
            validFoods.sort((a, b) => b.adjustedScore - a.adjustedScore);
            validFoods.forEach(food => {
              const energy = (() => {
                const nutrient = food.foodNutrients.find(n => n.nutrientName === "Energy");
                return nutrient ? nutrient.value : "N/A";
              })();
              const servingSize = food.servingSize ? food.servingSize : "N/A";
              const servingUnit = food.servingSizeUnit ? food.servingSizeUnit : "";
              const brand = food.brandOwner ? `Brand: ${food.brandOwner}` : "";
              const foodEncoded = encodeURIComponent(JSON.stringify(food));
              resultsHtml += `<div class="food-item" data-food="${foodEncoded}">
                <strong>${food.description}</strong>
                <br>Category: ${food.foodCategory || "N/A"} ${brand}
                <br>Serving: ${servingSize} ${servingUnit}
                <br>Calories: ${energy} kcal
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
  
  // USDA food item click handler
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
      $("#food-uom").append($("<option>").attr("data-conversion", 1).text(currentUSDAFood.servingSizeUnit + " (Default)"));
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
  
  // Daily Goals Submission and Progress Update
  const dailyGoalsForm = document.getElementById("daily-goals-form");
  if(dailyGoalsForm){
    dailyGoalsForm.addEventListener("submit", function(e) {
      e.preventDefault();
      dailyGoals.calories = parseFloat(document.getElementById("goal-calories").value) || 0;
      dailyGoals.protein = parseFloat(document.getElementById("goal-protein").value) || 0;
      dailyGoals.fat = parseFloat(document.getElementById("goal-fat").value) || 0;
      dailyGoals.carbs = parseFloat(document.getElementById("goal-carbs").value) || 0;
      document.getElementById("goal-calories-display").textContent = dailyGoals.calories;
      document.getElementById("goal-protein-display").textContent = dailyGoals.protein;
      document.getElementById("goal-fat-display").textContent = dailyGoals.fat;
      document.getElementById("goal-carbs-display").textContent = dailyGoals.carbs;
      updateDailyGoalsProgress();
    });
  } else {
    console.error("daily-goals-form not found.");
  }
  
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
  
  function updateProgressBar(nutrient, total, goal) {
    const progressText = document.getElementById("progress-" + nutrient);
    const progressBar = document.getElementById("progress-bar-" + nutrient);
    progressText.textContent = total.toFixed(0);
    let percentage = goal > 0 ? (total / goal) * 100 : 0;
    if (percentage > 100) percentage = 100;
    progressBar.style.width = percentage + "%";
    progressBar.setAttribute("aria-valuenow", percentage);
  }
  
  // Photo Upload & Comparison functions
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
    if (startDate) {
      filtered = filtered.filter(photo => new Date(photo.date) >= new Date(startDate));
    }
    if (endDate) {
      filtered = filtered.filter(photo => new Date(photo.date) <= new Date(endDate));
    }
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
  
  // Main page comparison: use flex layout so each image occupies 50%
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
  
  // Advanced Editor using Konva with enhanced controls
  $("#open-editor-btn").on("click", function() {
    openComparisonEditor();
  });
  
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
        
        // Draw the frame using a checker pattern
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
        
        // "Show Data" event using drop-downs & radio buttons
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
  if(closeEditorBtn){
    closeEditorBtn.addEventListener("click", function() {
      document.getElementById("comparison-editor-modal").style.display = "none";
    });
  } else {
    console.error("close-editor-btn not found.");
  }
});
