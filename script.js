// FitJourney Tracker - Version v7.46 (Ensuring Full Feature Support and Growth)

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

// Chart Module
const ChartModule = {
    init: function() {
        console.log("ChartModule loaded");
        const canvas = document.getElementById('weightChart');

        if (!canvas) {
            console.warn("Warning: Canvas element #weightChart is missing! Chart will not load.");
            return;
        }

        if (typeof Chart !== 'undefined') {
            const ctx = canvas.getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                    datasets: [{ label: 'Weight Progress', data: [200, 195, 190, 185], borderColor: 'blue', borderWidth: 2 }]
                },
                options: { responsive: true }
            });
        } else {
            console.error("Chart.js is missing!");
        }
    }
};

// Weight Logging Module
const WeightLoggingModule = {
    init: function() {
        console.log("WeightLoggingModule loaded");
        const button = document.getElementById('logWeightBtn');
        const input = document.getElementById('weightInput');

        if (!button || !input) {
            console.warn("Warning: Weight logging elements are missing! Weight logging will not work.");
            return;
        }

        button.addEventListener('click', () => {
            const weight = input.value;
            if (weight) {
                console.log("Weight logged:", weight);
            } else {
                console.warn("No weight entered.");
            }
        });
    }
};
