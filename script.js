// FitJourney Tracker - Version v7.86 (FULL RESTORE: Weight Logging, Photo Upload, Overlays)

console.log("FitJourney Tracker v7.86 initializing...");

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
            overlayPhotoBtn: document.getElementById('overlay-photo-btn'), // Fixed Missing Element
            overlayPreview: document.getElementById('overlay-preview'),   // Fixed Missing Element
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
            requiredElements.versionDisplay.innerText = "v7.86";
        }

        ChartModule.init();  
        WeightLoggingModule.init(); // FIXED
        PhotoUploadModule.init();  // FIXED
        PhotoComparisonModule.init();
        ExportModule.init();
        PhotoOverlayModule.init();  // FIXED
        StreakTrackerModule.init();
        UserProfileModule.init();
        CommunityEngagementModule.init();
        DarkModeModule.init();
        CsvExportModule.init();

        console.log("All modules initialized successfully in FitJourney Tracker v7.86.");
    } catch (error) {
        console.error("Error initializing modules:", error);
    }
};

// Weight Logging Module - FULL RESTORE
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

// Photo Upload Module - FULL RESTORE (Fixed Deleting Weight Data Bug)
const PhotoUploadModule = {
    init: function() {
        console.log("PhotoUploadModule loaded");
        const form = document.getElementById('photo-upload-form');
        const input = document.getElementById('photo-upload');
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
                const reader = new FileReader();

                reader.onload = function(e) {
                    img.src = e.target.result;
                    img.classList.add('gallery-image');
                    img.style.maxWidth = "150px";
                    img.style.maxHeight = "150px";
                    gallery.appendChild(img);
                };

                reader.readAsDataURL(file);
                input.value = '';
            } else {
                console.warn("No photo selected.");
            }
        });
    }
};

// Photo Overlay Module - FULL FIX & RESTORE
const PhotoOverlayModule = {
    init: function() {
        console.log("PhotoOverlayModule loaded");
        const overlayBtn = document.getElementById('overlay-photo-btn');
        const gallery = document.getElementById('photo-gallery');
        const preview = document.getElementById('overlay-preview');

        if (!overlayBtn || !gallery || !preview) {
            console.warn("Warning: Photo overlay elements are missing! Overlays will not work.");
            return;
        }

        overlayBtn.addEventListener('click', function() {
            const photos = gallery.getElementsByTagName('img');
            if (photos.length === 0) {
                console.warn("No photos available for overlay.");
                return;
            }

            const lastPhoto = photos[photos.length - 1];
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Set canvas size to match the image
            canvas.width = lastPhoto.naturalWidth;
            canvas.height = lastPhoto.naturalHeight;

            // Draw the image onto the canvas
            ctx.drawImage(lastPhoto, 0, 0, canvas.width, canvas.height);

            // Get last recorded weight & date
            const weightText = document.getElementById('weight-summary')?.innerText || "Weight Unknown";
            const dateText = document.getElementById('date-input')?.value || "Date Unknown";

            // Add overlay text
            ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
            ctx.fillRect(10, 10, 250, 80);  // Background box

            ctx.fillStyle = "#FFF";
            ctx.font = "24px Arial";
            ctx.fillText(`Weight: ${weightText}`, 20, 40);
            ctx.fillText(`Date: ${dateText}`, 20, 70);

            // Display in preview section
            preview.innerHTML = "";
            const imgPreview = document.createElement('img');
            imgPreview.src = canvas.toDataURL();
            imgPreview.style.maxWidth = "300px";
            imgPreview.style.border = "2px solid #000";
            preview.appendChild(imgPreview);

            console.log("Photo overlay created.");
        });
    }
};
