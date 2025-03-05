// Wait for the DOM content to load before accessing elements
document.addEventListener("DOMContentLoaded", function () {
  var appVersionElem = document.getElementById("app-version");
  if (appVersionElem) {
    appVersionElem.textContent = "v1.4.3-local";
  } else {
    console.error("App version element not found.");
  }
});

$(document).ready(function () {
  // Initialize TwentyTwenty if plugin loaded
  if ($.fn.twentytwenty) {
    $("#twentytwenty-container").twentytwenty();
  } else {
    console.error("TwentyTwenty plugin failed to load.");
  }
  
  // Initialize Juxtapose if available (adjust or remove if not used)
  try {
    if (typeof juxtapose !== "undefined") {
      // Example initialization (uncomment and adjust paths if needed):
      // juxtapose([
      //   { src: 'path/to/before.jpg', label: 'Before' },
      //   { src: 'path/to/after.jpg', label: 'After' }
      // ], '#juxtapose-container', { animate: true });
    } else {
      console.error("Juxtapose plugin failed to load.");
    }
  } catch (e) {
    console.error("Error initializing Juxtapose:", e);
  }
  
  // Photo Upload Handling
  $("#photo-upload-form").on("submit", function (event) {
    event.preventDefault();
    var fileInput = $("#photo-upload")[0].files[0];
    var dateInput = $("#photo-date").val();
    
    if (!fileInput || !dateInput) {
      alert("Please select a photo and date.");
      return;
    }
    
    var reader = new FileReader();
    reader.onload = function (e) {
      $("#photo-gallery").append(
        '<div class="photo-entry">' +
          '<img src="' + e.target.result + '" alt="Uploaded Progress Photo">' +
          '<p>Date: ' + dateInput + '</p>' +
        '</div>'
      );
    };
    reader.readAsDataURL(fileInput);
  });
});
