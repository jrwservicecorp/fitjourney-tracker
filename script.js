// FitJourney Tracker - Version v7.79 (FULL RESTORE - Photo Comparison FIXED)

console.log("FitJourney Tracker v7.79 initializing...");

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
            photoUploadInput: document.getElementById('photo-upload'),
            photoGallery: document.getElementById('photo-gallery'),
            clearPhotosBtn: document.getElementById('clear-photos-btn'),
            comparePhotosBtn: document.getElementById('compare-photos-btn'),
            exportDataBtn: document.getElementById('exportDataBtn'),
            toggleSampleData: document.getElementById('toggle-demo-data'),
            trendAnalysis: document.getElementById('trend-analysis'),
            versionDisplay: document.getElementById('app-version')
        };

        for (const [key, value] of Object.entries(requiredElements)) {
            if (!value) {
                console.warn(`Warning: Element with ID '${key}' is missing!`);
            }
        }

        if (requiredElements.versionDisplay) {
            requiredElements.versionDisplay.innerText = "v7.79";
        }

        ChartModule.init();  
        WeightLoggingModule.init();
        PhotoUploadModule.init();
        PhotoComparisonModule.init(); // FIXED - Now Defined
        ExportModule.init();
        StreakTrackerModule.init();
        UserProfileModule.init();
        CommunityEngagementModule.init();
        DarkModeModule.init();
        CsvExportModule.init();

        console.log("All modules initialized successfully in FitJourney Tracker v7.79.");
    } catch (error) {
        console.error("Error initializing modules:", error);
    }
};

// Photo Comparison Module - FULL RESTORE
const PhotoComparisonModule = {
    init: function() {
        console.log("PhotoComparisonModule loaded");
        const compareBtn = document.getElementById('compare-photos-btn');
        const photoSelect1 = document.getElementById('photo-select-1');
        const photoSelect2 = document.getElementById('photo-select-2');
        const comparisonDisplay = document.getElementById('side-by-side-comparison');

        if (!compareBtn || !photoSelect1 || !photoSelect2 || !comparisonDisplay) {
            console.warn("Warning: Photo comparison elements are missing! Photo comparison will not work.");
            return;
        }

        compareBtn.addEventListener('click', function() {
            const selectedPhoto1 = photoSelect1.value;
            const selectedPhoto2 = photoSelect2.value;

            if (!selectedPhoto1 || !selectedPhoto2) {
                console.warn("No photos selected for comparison.");
                return;
            }

            comparisonDisplay.innerHTML = `
                <div class="comparison-image"><img src="${selectedPhoto1}" alt="Photo 1"></div>
                <div class="comparison-image"><img src="${selectedPhoto2}" alt="Photo 2"></div>
            `;
            console.log("Photo comparison triggered");
        });
    }
};
