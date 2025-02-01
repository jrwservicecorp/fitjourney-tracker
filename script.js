// FitJourney Tracker - Version v7.84 (NEW FEATURE: Photo Progress Overlays)

console.log("FitJourney Tracker v7.84 initializing...");

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
            overlayPhotoBtn: document.getElementById('overlay-photo-btn'), // NEW FEATURE
            overlayPreview: document.getElementById('overlay-preview'),   // NEW FEATURE
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
            requiredElements.versionDisplay.innerText = "v7.84";
        }

        ChartModule.init();  
        WeightLoggingModule.init();
        PhotoUploadModule.init();
        PhotoComparisonModule.init();
        ExportModule.init();
        PhotoOverlayModule.init();  // NEW FEATURE ADDED
        StreakTrackerModule.init();
        UserProfileModule.init();
        CommunityEngagementModule.init();
        DarkModeModule.init();
        CsvExportModule.init();

        console.log("All modules initialized successfully in FitJourney Tracker v7.84.");
    } catch (error) {
        console.error("Error initializing modules:", error);
    }
};

// Photo Overlay Module - NEW FEATURE
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

            // Use the latest uploaded photo
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
