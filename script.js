document.addEventListener("DOMContentLoaded", function () {
  // Set version number
  document.getElementById("app-version").textContent = "v1.4.3-local";
});

$(document).ready(function () {
  // Initialize TwentyTwenty if available
  if ($.fn.twentytwenty) {
    $("#twentytwenty-container").twentytwenty();
  } else {
    console.error("TwentyTwenty plugin failed to load.");
  }

  // Photo Upload handler
  // Remove any duplicate event handlers before adding a new one
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
      // Remove the placeholder if it exists
      $("#photo-gallery .placeholder").remove();
      // Append the uploaded photo only once
      $("#photo-gallery").append(`
        <div class="photo-entry">
          <img src="${e.target.result}" alt="Uploaded Progress Photo">
          <p>Date: ${dateInput}</p>
        </div>
      `);
      
      // Update the comparison dropdowns with this new photo.
      // Create a unique value (using timestamp) and use the image data URL as the value.
      var optionHTML = `<option value="${e.target.result}">${dateInput}</option>`;
      $("#tt-before").append(optionHTML);
      $("#tt-after").append(optionHTML);
    };
    reader.readAsDataURL(fileInput);
    
    // Clear the form so the same file isn't re-submitted
    $(this).trigger('reset');
  });

  // Handle update for the TwentyTwenty comparison section
  $("#tt-update").on("click", function () {
    var beforeSrc = $("#tt-before").val();
    var afterSrc = $("#tt-after").val();
    if (beforeSrc && afterSrc) {
      $("#twentytwenty-container").empty().append(`
        <img src="${beforeSrc}" alt="Before">
        <img src="${afterSrc}" alt="After">
      `);
      // Reinitialize the TwentyTwenty plugin on the updated images
      if ($.fn.twentytwenty) {
        $("#twentytwenty-container").twentytwenty();
      }
    } else {
      alert("Please select both before and after images from the dropdowns.");
    }
  });

  // (Optional) Other event listeners such as weight logging, chart initialization, etc.
});
