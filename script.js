// FitJourney Tracker - Version v7.46 (Fixing Sample Data on Load and Missing Streak Tracker)

window.onload = function() {
    console.log("FitJourney Tracker v7.46 initializing...");

    try {
        ChartModule.init();
        WeightLoggingModule.init();
        PhotoUploadModule.init();
        PhotoComparisonModule.init();
        ExportModule.init();
        StreakTrackerModule.init(); // Fixing missing module
        UserProfileModule.init();
        CommunityEngagementModule.init();
        DarkModeModule.init();
        CsvExportModule.init();

        console.log("All modules initialized successfully in FitJourney Tracker v7.46.");
    } catch (error) {
        console.error("Error initializing modules:", error);
    }
};

// Chart Module - Ensuring Sample Data Loads on First Page Load
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

// Streak Tracker Module - Fixing Undefined Error
const StreakTrackerModule = {
    init: function() {
        console.log("StreakTrackerModule loaded");
    }
};
