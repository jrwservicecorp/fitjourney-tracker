// FitJourney Tracker - Version v7.60 (Fixing Weight Logging & Photo Upload)

console.log("FitJourney Tracker v7.60 initializing...");

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
            requiredElements.versionDisplay.innerText = "v7.60";
        }

        ChartModule.init();
        WeightLoggingModule.init(); // Fixing missing reference
        PhotoUploadModule.init();
        PhotoComparisonModule.init();
        ExportModule.init();
        StreakTrackerModule.init();
        UserProfileModule.init();
        CommunityEngagementModule.init();
        DarkModeModule.init();
        CsvExportModule.init();

        console.log("All modules initialized successfully in FitJourney Tracker v7.60.");
    } catch (error) {
        console.error("Error initializing modules:", error);
    }
};

// Weight Logging Module - Fixing UI Updates & Chart Logging
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

                if (recentWeighIns.querySelector('.placeholder')) {
                    recentWeighIns.innerHTML = "";
                }
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

// Photo Upload Module - Fixing Missing Reference & Restoring Functionality
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
                console.log(`Photo uploaded: ${file.name}`);
                const img = document.createElement('img');
                img.src = URL.createObjectURL(file);
                img.classList.add('gallery-image');
                img.style.maxWidth = "150px";
                img.style.maxHeight = "150px";
                gallery.appendChild(img);

                input.value = '';
            } else {
                console.warn("No photo selected.");
            }
        });
    }
};
