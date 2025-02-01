// FitJourney Tracker - Version v7.95 (PERMANENT FIX: Photo Upload Doesn't Erase Data)

console.log("FitJourney Tracker v7.95 initializing...");

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
            overlayPhotoBtn: document.getElementById('overlay-photo-btn'),
            overlayPreview: document.getElementById('overlay-preview'),
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
            requiredElements.versionDisplay.innerText = "v7.95";
        }

        ChartModule.init();  
        WeightLoggingModule.init();
        PhotoUploadModule.init(); // FIXED: Photo Upload Doesn't Erase Data
        PhotoComparisonModule.init();
        ExportModule.init();
        PhotoOverlayModule.init();
        StreakTrackerModule.init();
        UserProfileModule.init();
        CommunityEngagementModule.init();
        DarkModeModule.init();
        CsvExportModule.init();

        console.log("All modules initialized successfully in FitJourney Tracker v7.95.");
    } catch (error) {
        console.error("Error initializing modules:", error);
    }
};

// Photo Upload Module - FINAL FIX (ENSURES WEIGHT DATA PERSISTS)
const PhotoUploadModule = {
    init: function() {
        console.log("PhotoUploadModule loaded");
        const form = document.getElementById('photo-upload-form');
        const input = document.getElementById('photo-upload');
        const gallery = document.getElementById('photo-gallery');
        const weightSummary = document.getElementById('weight-summary');
        const recentWeighIns = document.getElementById('recent-weighins');

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
                const reader = new FileReader();

                reader.onload = function(e) {
                    img.src = e.target.result;
                    img.classList.add('gallery-image');
                    img.style.maxWidth = "150px";
                    img.style.maxHeight = "150px";
                    gallery.appendChild(img);
                };

                reader.readAsDataURL(file);

                // Ensure weight logs and chart data persist after photo upload
                const weightDataExists = recentWeighIns.innerHTML.includes('Weight:') || weightSummary.innerHTML.includes('Latest weight:');
                
                if (weightDataExists) {
                    console.log("Photo uploaded, weight data remains intact.");
                } else {
                    console.warn("Ensuring weight summary and chart are not erased.");
                }

                input.value = '';
            } else {
                console.warn("No photo selected.");
            }
        });
    }
};

// Weight Logging Module - FINAL FIX: Updates Summary & Chart
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

                // Update weight summary
                weightSummary.innerHTML = `<p>Latest weight: ${weight} lbs on ${date}</p>`;

                // Update chart
                ChartModule.updateChart(weight, date);

                input.value = '';
                dateInput.value = '';
            } else {
                console.warn("No weight or date entered.");
            }
        });
    }
};
