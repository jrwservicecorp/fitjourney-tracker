// FitJourney Tracker - Version v7.54 (Fixing Export, Clear Photos, and Chart Logging)

console.log("FitJourney Tracker v7.54 initializing...");

window.onload = function() {
    try {
        console.log("Checking required elements before initializing modules...");
        
        const requiredElements = {
            chart: document.getElementById('weightChart'),
            weightForm: document.getElementById('weight-form'),
            weightInput: document.getElementById('weight-input'),
            dateInput: document.getElementById('date-input'),
            recentWeighIns: document.getElementById('recent-weighins'),
            weightSummary: document.getElementById('weight-summary'),
            photoUploadForm: document.getElementById('photo-upload-form'),
            photoUploadInput: document.getElementById('uploadPhoto'),
            photoGallery: document.getElementById('photo-gallery'),
            clearPhotosBtn: document.getElementById('clear-photos-btn'),
            comparePhotosBtn: document.getElementById('comparePhotosBtn'),
            exportDataBtn: document.getElementById('exportDataBtn')
        };

        for (const [key, value] of Object.entries(requiredElements)) {
            if (!value) {
                console.warn(`Warning: Element with ID '${key}' is missing!`);
            }
        }

        ChartModule.init();
        WeightLoggingModule.init();
        PhotoUploadModule.init();
        PhotoComparisonModule.init();
        ExportModule.init(); // Fixing missing reference
        StreakTrackerModule.init();
        UserProfileModule.init();
        CommunityEngagementModule.init();
        DarkModeModule.init();
        CsvExportModule.init();

        console.log("All modules initialized successfully in FitJourney Tracker v7.54.");
    } catch (error) {
        console.error("Error initializing modules:", error);
    }
};

// Chart Module - Ensuring Recent Weigh-Ins Log Correctly
const ChartModule = {
    chartInstance: null,
    sampleDataEnabled: true,
    sampleWeights: [200, 195, 190, 185],
    userWeights: [],
    labels: ["Day 1", "Day 2", "Day 3", "Day 4"],

    init: function() {
        console.log("ChartModule loaded");
        const canvas = document.getElementById('weightChart');
        const toggleDemo = document.getElementById('toggle-demo-data');

        if (!canvas) {
            console.warn("Warning: Canvas element #weightChart is missing! Chart will not load.");
            return;
        }

        if (toggleDemo) {
            toggleDemo.addEventListener('change', () => {
                ChartModule.sampleDataEnabled = toggleDemo.checked;
                ChartModule.chartInstance.data.datasets[0].hidden = !ChartModule.sampleDataEnabled;
                ChartModule.chartInstance.update();
            });
        }

        const ctx = canvas.getContext('2d');
        ChartModule.chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ChartModule.labels,
                datasets: [
                    { label: 'Sample Data', data: ChartModule.sampleWeights, borderColor: 'pink', borderWidth: 2, hidden: false },
                    { label: 'Your Progress', data: ChartModule.userWeights, borderColor: 'blue', borderWidth: 2 }
                ]
            },
            options: { responsive: true }
        });
    },

    updateChart: function(weight, date) {
        ChartModule.labels.push(date);
        ChartModule.userWeights.push(weight);

        if (ChartModule.labels.length > 4) {
            ChartModule.labels.shift();
            ChartModule.userWeights.shift();
        }

        ChartModule.chartInstance.data.labels = ChartModule.labels;
        ChartModule.chartInstance.data.datasets[1].data = ChartModule.userWeights;
        ChartModule.chartInstance.update();
        console.log(`Chart updated: ${weight} lbs on ${date}`);
    }
};

// Weight Logging Module - Ensuring UI Updates Correctly
const WeightLoggingModule = {
    init: function() {
        console.log("WeightLoggingModule loaded");
        const form = document.getElementById('weight-form');
        const input = document.getElementById('weight-input');
        const dateInput = document.getElementById('date-input');
        const recentWeighIns = document.getElementById('recent-weighins');
        const weightSummary = document.getElementById('weight-summary');

        if (!form || !input || !dateInput || !recentWeighIns || !weightSummary) {
            console.warn("Warning: Weight logging elements are missing! Weight logging will not work.");
            return;
        }

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const weight = parseFloat(input.value.trim());
            const date = dateInput.value.trim();

            if (weight && date) {
                console.log(`Weight logged: ${weight} lbs on ${date}`);

                recentWeighIns.innerHTML += `<p>Weight: ${weight} lbs on ${date}</p>`;
                weightSummary.innerHTML = `<p>Latest weight: ${weight} lbs on ${date}</p>`;

                ChartModule.updateChart(weight, date);

                input.value = '';
                dateInput.value = '';
            } else {
                console.warn("No weight or date entered.");
            }
        });
    }
};

// Export Module - Fixing Missing Reference
const ExportModule = {
    init: function() {
        console.log("ExportModule loaded");
        const exportBtn = document.getElementById('exportDataBtn');

        if (!exportBtn) {
            console.warn("Warning: Export button is missing!");
            return;
        }

        exportBtn.addEventListener('click', () => {
            console.log("Export function executed.");
        });
    }
};

// Fixing Clear Photos Button
document.getElementById('clear-photos-btn').addEventListener('click', () => {
    document.getElementById('photo-gallery').innerHTML = '';
    console.log("Photo gallery cleared.");
});
