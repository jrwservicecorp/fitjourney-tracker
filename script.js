// FitJourney Tracker - Full Debugging Version v7.50 (Ensuring All Modules)

console.log("FitJourney Tracker v7.50 initializing...");

window.onload = function() {
    try {
        console.log("Checking required elements before initializing modules...");
        
        const requiredElements = {
            chart: document.getElementById('weightChart'),
            weightForm: document.getElementById('weight-form'),
            weightInput: document.getElementById('weight-input'),
            dateInput: document.getElementById('date-input'),
            recentWeighIns: document.getElementById('recent-weighins'),
            photoUploadForm: document.getElementById('photo-upload-form'),
            photoUploadInput: document.getElementById('uploadPhoto'),
            photoGallery: document.getElementById('photo-gallery'),
            photoComparisonButton: document.getElementById('comparePhotosBtn'),
            exportButton: document.getElementById('exportDataBtn')
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
        ExportModule.init();
        StreakTrackerModule.init();
        UserProfileModule.init();
        CommunityEngagementModule.init();
        DarkModeModule.init();
        CsvExportModule.init();

        console.log("All modules initialized successfully in FitJourney Tracker v7.50.");
    } catch (error) {
        console.error("Error initializing modules:", error);
    }
};

// Chart Module
const ChartModule = {
    init: function() {
        console.log("ChartModule loaded");
    }
};

// Weight Logging Module
const WeightLoggingModule = {
    init: function() {
        console.log("WeightLoggingModule loaded");
    }
};

// Photo Upload Module
const PhotoUploadModule = {
    init: function() {
        console.log("PhotoUploadModule loaded");
    }
};

// Photo Comparison Module
const PhotoComparisonModule = {
    init: function() {
        console.log("PhotoComparisonModule loaded");
    }
};

// Export Module
const ExportModule = {
    init: function() {
        console.log("ExportModule loaded");
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
