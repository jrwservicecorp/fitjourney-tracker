// FitJourney Tracker - Version v7.73 (Fixing PhotoComparisonModule - No Line Reductions)

console.log("FitJourney Tracker v7.73 initializing...");

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
            exportDataBtn: document.getElementById('exportDataBtn'),
            versionDisplay: document.getElementById('app-version')
        };

        for (const [key, value] of Object.entries(requiredElements)) {
            if (!value) {
                console.warn(`Warning: Element with ID '${key}' is missing!`);
            }
        }

        if (requiredElements.versionDisplay) {
            requiredElements.versionDisplay.innerText = "v7.73";
        }

        ChartModule.init();
        WeightLoggingModule.init();
        PhotoUploadModule.init();
        PhotoComparisonModule.init(); // Fixing missing reference
        ExportModule.init();
        StreakTrackerModule.init();
        UserProfileModule.init();
        CommunityEngagementModule.init();
        DarkModeModule.init();
        CsvExportModule.init();

        console.log("All modules initialized successfully in FitJourney Tracker v7.73.");
    } catch (error) {
        console.error("Error initializing modules:", error);
    }
};

// Photo Comparison Module - Restoring Functionality
const PhotoComparisonModule = {
    init: function() {
        console.log("PhotoComparisonModule loaded");
        const compareBtn = document.getElementById('comparePhotosBtn');
        const photoSelect1 = document.getElementById('photo-select-1');
        const photoSelect2 = document.getElementById('photo-select-2');
        const comparisonDisplay = document.getElementById('side-by-side-comparison');

        if (!compareBtn || !photoSelect1 || !photoSelect2 || !comparisonDisplay) {
            console.warn("Warning: Photo comparison elements are missing!");
            return;
        }

        // Populate dropdowns with stored images
        const storedPhotos = JSON.parse(localStorage.getItem("photoGallery")) || [];
        photoSelect1.innerHTML = "";
        photoSelect2.innerHTML = "";

        storedPhotos.forEach((src, index) => {
            const option1 = new Option(`Photo ${index + 1}`, src);
            const option2 = new Option(`Photo ${index + 1}`, src);
            photoSelect1.add(option1);
            photoSelect2.add(option2);
        });

        compareBtn.addEventListener('click', () => {
            const selectedPhoto1 = photoSelect1.value;
            const selectedPhoto2 = photoSelect2.value;

            if (!selectedPhoto1 || !selectedPhoto2) {
                console.warn("Please select two photos to compare.");
                return;
            }

            comparisonDisplay.innerHTML = `
                <div><img src="${selectedPhoto1}" class="gallery-image"></div>
                <div><img src="${selectedPhoto2}" class="gallery-image"></div>
            `;

            console.log("Photo comparison triggered.");
        });
    }
};
