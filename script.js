document.addEventListener("DOMContentLoaded", function () {
    // Set the app version
    document.getElementById("app-version").textContent = "v1.4.3-local";

    // Initialize TwentyTwenty if available
    if ($.fn.twentytwenty) {
        $("#twentytwenty-container").twentytwenty();
    } else {
        console.error("TwentyTwenty plugin failed to load.");
    }

    // Photo upload functionality
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
                '<div class="photo-entry"><img src="' + e.target.result + 
                '" alt="Uploaded Progress Photo"><p>Date: ' + dateInput + '</p></div>'
            );
        };
        reader.readAsDataURL(fileInput);
    });

    // Initialize Chart.js with a simple demo chart
    var ctx = document.getElementById('weightChart');
    if (ctx) {
        var weightChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['January', 'February', 'March', 'April', 'May'],
                datasets: [{
                    label: 'Weight',
                    data: [180, 178, 177, 175, 174],
                    borderColor: '#007bff',
                    backgroundColor: 'rgba(0,123,255,0.2)',
                    fill: true,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
            }
        });
    } else {
        console.error("Chart element not found.");
    }
});
