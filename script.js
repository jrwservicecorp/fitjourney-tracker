
// FitJourney Tracker - Version v7.46 (Fixed Chart Issue)

document.addEventListener('DOMContentLoaded', () => {
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
});

// Chart Module (Fixed)
const ChartModule = {
    init: function() {
        console.log("ChartModule loaded");
        const canvas = document.getElementById('weightChart');

        if (!canvas) {
            console.error("Canvas element #weightChart is missing!");
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
        document.getElementById('logWeightBtn').addEventListener('click', () => {
            const weight = document.getElementById('weightInput').value;
            console.log("Weight logged:", weight);
        });
    }
};

// Photo Upload Module
const PhotoUploadModule = {
    init: function() {
        console.log("PhotoUploadModule loaded");
        document.getElementById('uploadPhoto').addEventListener('change', (event) => {
            const file = event.target.files[0];
            console.log("Photo uploaded:", file.name);
        });
    }
};

// Photo Comparison Module
const PhotoComparisonModule = {
    init: function() {
        console.log("PhotoComparisonModule loaded");
        document.getElementById('comparePhotosBtn').addEventListener('click', () => {
            console.log("Photo comparison triggered");
        });
    }
};

// Export Module
const ExportModule = {
    init: function() {
        console.log("ExportModule loaded");
        document.getElementById('exportDataBtn').addEventListener('click', () => {
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
