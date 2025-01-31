// FitJourney Tracker - Version v7.46 (Restoring Full Chart Features, Goals, and Weight Trends)

window.onload = function() {
    console.log("FitJourney Tracker v7.46 initializing...");

    try {
        ChartModule.init();
        WeightLoggingModule.init();
        PhotoUploadModule.init();
        PhotoComparisonModule.init();
        ExportModule.init();
        StreakTrackerModule.init();
        UserProfileModule.init();
        CommunityEngagementModule.init();
        DarkModeModule.init();
        CsvExportModule.init();

        console.log("All modules initialized successfully in FitJourney Tracker v7.46.");
    } catch (error) {
        console.error("Error initializing modules:", error);
    }
};

// Chart Module - Restoring Sample Data, Goal Line, and User Data Updates
const ChartModule = {
    chartInstance: null,

    init: function() {
        console.log("ChartModule loaded");
        const canvas = document.getElementById('weightChart');
        const demoToggle = document.getElementById('toggle-demo-data');

        if (!canvas) {
            console.warn("Warning: Canvas element #weightChart is missing! Chart will not load.");
            return;
        }

        if (typeof Chart !== 'undefined') {
            const ctx = canvas.getContext('2d');
            ChartModule.chartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [
                        { label: 'User Data', data: [], borderColor: 'blue', borderWidth: 2 },
                        { label: 'Sample Data', data: [200, 195, 190, 185], borderColor: 'pink', borderWidth: 2, hidden: false },
                        { label: 'Goal Line', data: [180, 180, 180, 180], borderColor: 'green', borderWidth: 2, borderDash: [5, 5] }
                    ]
                },
                options: { responsive: true }
            });

            // Add toggle functionality for demo data
            if (demoToggle) {
                demoToggle.addEventListener('change', function() {
                    ChartModule.chartInstance.data.datasets[1].hidden = !this.checked;
                    ChartModule.chartInstance.update();
                });
            }

        } else {
            console.error("Chart.js is missing!");
        }
    },

    updateChart: function(weight, date) {
        if (ChartModule.chartInstance) {
            let chartData = ChartModule.chartInstance.data;
            chartData.labels.push(date);
            chartData.datasets[0].data.push(weight);

            // Ensure we only keep the last 4 entries for trends
            if (chartData.labels.length > 4) {
                chartData.labels.shift();
                chartData.datasets[0].data.shift();
            }

            ChartModule.chartInstance.update();
            console.log("Chart updated with new data:", weight, "on", date);
        } else {
            console.warn("Chart instance not initialized!");
        }
    }
};

// Weight Logging Module - Fully Fixed and Connected to Chart Updates
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

                // Remove placeholder
                const placeholder = recentWeighIns.querySelector('.placeholder');
                if (placeholder) placeholder.remove();

                // Add new entry
                const entry = document.createElement('p');
                entry.textContent = `Weight: ${weight} lbs on ${date}`;
                recentWeighIns.appendChild(entry);

                // Update Chart
                ChartModule.updateChart(weight, date);

                // Clear input fields
                input.value = '';
                dateInput.value = '';
            } else {
                console.warn("No weight or date entered.");
            }
        });
    }
};

// Photo Upload Module - Fully Functional
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

                // Clear input
                input.value = '';
            } else {
                console.warn("No photo selected.");
            }
        });
    }
};

// Fixing Reference Error for Photo Comparison Module
const PhotoComparisonModule = {
    init: function() {
        console.log("PhotoComparisonModule loaded");
        const button = document.getElementById('comparePhotosBtn');

        if (!button) {
            console.warn("Warning: Photo comparison button is missing! Comparison will not work.");
            return;
        }

        button.addEventListener('click', () => {
            console.log("Photo comparison triggered");
        });
    }
};
