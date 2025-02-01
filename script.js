// FitJourney Tracker - Version v7.62 (Fixing Photo Upload & Data Persistence)

console.log("FitJourney Tracker v7.62 initializing...");

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
            requiredElements.versionDisplay.innerText = "v7.62";
        }

        ChartModule.init();
        WeightLoggingModule.init();
        PhotoUploadModule.init(); // Fixing missing reference
        PhotoComparisonModule.init();
        ExportModule.init();
        StreakTrackerModule.init();
        UserProfileModule.init();
        CommunityEngagementModule.init();
        DarkModeModule.init();
        CsvExportModule.init();

        console.log("All modules initialized successfully in FitJourney Tracker v7.62.");
    } catch (error) {
        console.error("Error initializing modules:", error);
    }
};

// Photo Upload Module - Fixing Missing Reference & Data Persistence
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

        // Load stored photos from localStorage
        const storedPhotos = JSON.parse(localStorage.getItem("photoGallery")) || [];
        storedPhotos.forEach(src => {
            const img = document.createElement('img');
            img.src = src;
            img.classList.add('gallery-image');
            img.style.maxWidth = "150px";
            img.style.maxHeight = "150px";
            gallery.appendChild(img);
        });

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

                    // Save to localStorage
                    storedPhotos.push(e.target.result);
                    localStorage.setItem("photoGallery", JSON.stringify(storedPhotos));
                };

                reader.readAsDataURL(file);
                input.value = '';
            } else {
                console.warn("No photo selected.");
            }
        });
    }
};
