
// FitJourney Tracker - Version v7.46 (Fixed Canvas & EventListener Errors)

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

// Chart Module (Fixed for Missing Canvas)
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

// Weight Logging Module (Fixed for Missing Button)
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
            console.log("Weight logged:", weight);
        });
    }
};

// Photo Upload Module (Fixed for Missing Input)
const PhotoUploadModule = {
    init: function() {
        console.log("PhotoUploadModule loaded");
        const input = document.getElementById('uploadPhoto');

        if (!input) {
            console.warn("Warning: Photo upload input is missing! Photo upload will not work.");
            return;
        }

        input.addEventListener('change', (event) => {
            const file = event.target.files[0];
            console.log("Photo uploaded:", file.name);
        });
    }
};

// Photo Comparison Module (Fixed for Missing Button)
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

// Export Module (Fixed for Missing Button)
const ExportModule = {
    init: function() {
        console.log("ExportModule loaded");
        const button = document.getElementById('exportDataBtn');

        if (!button) {
            console.warn("Warning: Export button is missing! Export will not work.");
            return;
        }

        button.addEventListener('click', () => {
            console.log("Exporting data...");
        });
    }
};

// Streak Tracker Module
const StreakTrackerModule = {
    init: function() {
        console.log("StreakTrackerModule loaded");
    }
};

// User Profile Module
const UserProfileModule = {
    init: function() {
        console.log("UserProfileModule loaded");
    }
};

// Community Engagement Module
const CommunityEngagementModule = {
    init: function() {
        console.log("CommunityEngagementModule loaded");
    }
};

// Dark Mode Module
const DarkModeModule = {
    init: function() {
        console.log("DarkModeModule loaded");
    }
};

// CSV Export Module
const CsvExportModule = {
    init: function() {
        console.log("CsvExportModule loaded");
    }
};
