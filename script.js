document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("app-version").textContent = "v1.4.3-local";
});

$(document).ready(function () {
  /***********************
   * Chart.js Integration
   ***********************/
  var weightData = {
    labels: [],
    datasets: [{
      label: 'Weight (lbs)',
      data: [],
      borderColor: '#007bff',
      backgroundColor: 'rgba(0,123,255,0.1)',
      fill: false,
      tension: 0.1
    }]
  };

  var ctx = document.getElementById('weightChart').getContext('2d');
  var weightChart = new Chart(ctx, {
    type: 'line',
    data: weightData,
    options: {
      responsive: true,
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'day',
            tooltipFormat: 'MMM DD, YYYY'
          },
          title: {
            display: true,
            text: 'Date'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Weight (lbs)'
          }
        }
      }
    }
  });

  // Handle weight form submission
  $("#weight-form").off("submit").on("submit", function (e) {
    e.preventDefault();
    var weight = parseFloat($("#weight-input").val());
    var date = $("#date-input").val();
    if (!isNaN(weight) && date) {
      weightData.labels.push(date);
      weightData.datasets[0].data.push(weight);
      weightChart.update();

      // Update Weight Summary & Recent Weigh-ins
      $("#weight-summary").html(`<p>Latest Weight: ${weight} lbs on ${date}</p>`);
      $("#recent-weighins").append(`<p>${date}: ${weight} lbs</p>`);
    }
  });

  /**************************
   * Initialize TwentyTwenty
   **************************/
  if ($.fn.twentytwenty) {
    $("#twentytwenty-container").twentytwenty();
  } else {
    console.error("TwentyTwenty plugin failed to load.");
  }

  /**************************
   * Photo Upload Handler
   **************************/
  $("#photo-upload-form").off("submit").on("submit", function (event) {
    event.preventDefault();
    const fileInput = $("#photo-upload")[0].files[0];
    const dateInput = $("#photo-date").val();

    if (!fileInput || !dateInput) {
      alert("Please select a photo and date.");
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      // Remove placeholder if present
      $("#photo-gallery .placeholder").remove();
      // Append the uploaded photo once
      $("#photo-gallery").append(`
        <div class="photo-entry">
          <img src="${e.target.result}" alt="Uploaded Progress Photo">
          <p>Date: ${dateInput}</p>
        </div>
      `);
      // Update dropdowns for comparison (use the image data URL as value)
      var optionHTML = `<option value="${e.target.result}">${dateInput}</option>`;
      $("#tt-before").append(optionHTML);
      $("#tt-after").append(optionHTML);
    };
    reader.readAsDataURL(fileInput);
    
    $(this).trigger('reset');
  });

  /*************************************
   * TwentyTwenty Comparison Update
   *************************************/
  $("#tt-update").on("click", function () {
    var beforeSrc = $("#tt-before").val();
    var afterSrc = $("#tt-after").val();
    if (beforeSrc && afterSrc) {
      $("#twentytwenty-container").empty().append(`
        <img src="${beforeSrc}" alt="Before">
        <img src="${afterSrc}" alt="After">
      `);
      if ($.fn.twentytwenty) {
        $("#twentytwenty-container").twentytwenty();
      }
    } else {
      alert("Please select both before and after images from the dropdowns.");
    }
  });

  // (Optional) Additional export or interaction functions can be added here.
});
