// FitJourney Tracker - Version v7.48 (Fixing Photo Upload & Weight Logging Elements)

console.log("FitJourney Tracker v7.48 initializing...");

window.onload = function() {
    try {
        ChartModule.init();
        WeightLoggingModule.init();
        PhotoUploadModule.init(); // Fixing missing module
        PhotoComparisonModule.init();
        ExportModule.init();
        StreakTrackerModule.init();
        UserProfileModule.init();
        CommunityEngagementModule.init();
        DarkModeModule.init();
        CsvExportModule.init();

        console.log("All modules initialized successfully in FitJourney Tracker v7.48.");
    } catch (error) {
        console.error("Error initializing modules:", error);
    }
};

// Chart Module - Ensuring Sample Data Loads and User Data Updates Chart
const ChartModule = {
    chartInstance: null,
    labels: ["Day 1", "Day 2", "Day 3", "Day 4"],
    sampleWeights: [200, 195, 190, 185],
    userWeights: [],

    init: function() {
        console.log("ChartModule loaded");
        const canvas = document.getElementById('weightChart');

        if (!canvas) {
            console.warn("Warning: Canvas element #weightChart is missing! Chart will not load.");
            return;
        }

        const ctx = canvas.getContext('2d');
        ChartModule.chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ChartModule.labels,
                datasets: [
                    { label: 'Sample Data', data: ChartModule.sampleWeights, borderColor: 'pink', borderWidth: 2 },
                    { label: 'Your Progress', data: ChartModule.userWeights, borderColor: 'blue', borderWidth: 2 }
                ]
            },
            options: { responsive: true }
        });
    },

    updateChart: function(weight, date) {
        if (ChartModule.chartInstance) {
            ChartModule.labels.push(date);
            ChartModule.userWeights.push(weight);

            if (ChartModule.labels.length > 4) {
                ChartModule.labels.shift();
                ChartModule.userWeights.shift();
            }

            ChartModule.chartInstance.data.labels = ChartModule.labels;
            ChartModule.chartInstance.data.datasets[1].data = ChartModule.userWeights;
            ChartModule.chartInstance.update();
            console.log("Chart updated with new data:", weight, "on", date);
        } else {
            console.warn("Chart instance not initialized!");
        }
    }
};

// Weight Logging Module - Ensuring Elements Exist Before Initializing
const WeightLoggingModule = {
    init: function() {
        console.log("WeightLoggingModule loaded");
        const form = document.getElementById('weight-form');
        const input = document.getElementById('weightInput');
        const dateInput = document.getElementById('dateInput');
        const recentWeighIns = document.getElementById('recent-weighins');

        if (!form || !input || !dateInput || !recentWeighIns) {
            console.warn("Warning: Weight logging elements are missing! Weight logging will not work.");
            return;
        }

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const weight = parseFloat(input.value.trim());
            const date = dateInput.value.trim();

            if (weight && date) {
                console.log("Weight logged:", weight, "on", date);

                // Ensure the placeholder is removed
                const placeholder = recentWeighIns.querySelector('.placeholder');
                if (placeholder) placeholder.remove();

                // Add the new weight entry
                const entry = document.createElement('p');
                entry.textContent = `Weight: ${weight} lbs on ${date}`;
                recentWeighIns.appendChild(entry);

                // Update the Chart
                ChartModule.updateChart(weight, date);

                // Clear input fields after logging
                input.value = '';
                dateInput.value = '';
            } else {
                console.warn("No weight or date entered.");
            }
        });
    }
};

// Photo Upload Module - Fixing Undefined Error
const PhotoUploadModule = {
    init: function() {
        console.log("PhotoUploadModule loaded");
        const form = document.getElementById('photo-upload-form');
        const input = document.getElementById('uploadPhoto');
        const gallery = document.getElementById('photo-gallery');

        if (!form || !input || !gallery) {
            console.warn("Warning: Photo upload elements are missing! Photo upload will not work.");
            return;
        }

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const file = input.files[0];

            if (file) {
                console.log("Photo uploaded:", file.name);
                const img = document.createElement('img');
                img.src = URL.createObjectURL(file);
                img.classList.add('gallery-image');
                gallery.appendChild(img);
                input.value = '';
            } else {
                console.warn("No photo selected.");
            }
        });
    }
};
