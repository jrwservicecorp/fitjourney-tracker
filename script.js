// FitJourney Tracker - Version v7.85 (FULL ROLLBACK + PHOTO OVERLAYS)

console.log("FitJourney Tracker v7.85 initializing...");

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
            requiredElements.versionDisplay.innerText = "v7.85";
        }

        ChartModule.init();  
        WeightLoggingModule.init();
        PhotoUploadModule.init();
        PhotoComparisonModule.init();
        ExportModule.init();
        PhotoOverlayModule.init();  // NEW FEATURE ADDED, but no removals.
        StreakTrackerModule.init();
        UserProfileModule.init();
        CommunityEngagementModule.init();
        DarkModeModule.init();
        CsvExportModule.init();

        console.log("All modules initialized successfully in FitJourney Tracker v7.85.");
    } catch (error) {
        console.error("Error initializing modules:", error);
    }
};

// Chart Module - FULL ROLLBACK
const ChartModule = {
    chartInstance: null,
    sampleDataEnabled: true,
    sampleWeights: [200, 195, 190, 185],
    userWeights: [],
    labels: ["Day 1", "Day 2", "Day 3", "Day 4"],
    goalWeight: null,

    init: function() {
        console.log("ChartModule loaded");
        const canvas = document.getElementById('weightChart');

        if (!canvas) {
            console.warn("Warning: Canvas element #weightChart is missing! Chart will not load.");
            return;
        }

        const ctx = canvas.getContext('2d');
        ChartModule.chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ChartModule.labels,
                datasets: [
                    { label: 'Sample Data', data: ChartModule.sampleWeights, borderColor: 'pink', borderWidth: 2, hidden: !ChartModule.sampleDataEnabled },
                    { label: 'Your Progress', data: ChartModule.userWeights, borderColor: 'blue', borderWidth: 2 },
                    { label: 'Goal Weight', data: [], borderColor: 'green', borderWidth: 2, borderDash: [5, 5], hidden: false }
                ]
            },
            options: { responsive: true }
        });
    },

    updateChart: function(weight, date) {
        if (!ChartModule.chartInstance) {
            console.warn("Chart not initialized properly!");
            return;
        }

        ChartModule.labels.push(date);
        ChartModule.userWeights.push(weight);

        if (ChartModule.labels.length > 5) {
            ChartModule.labels.shift();
            ChartModule.userWeights.shift();
        }

        if (!ChartModule.goalWeight) {
            ChartModule.goalWeight = weight - 10; // Default goal is 10 lbs below first entry
        }

        ChartModule.chartInstance.data.labels = [...ChartModule.labels];
        ChartModule.chartInstance.data.datasets[1].data = [...ChartModule.userWeights];
        ChartModule.chartInstance.data.datasets[2].data = Array(ChartModule.labels.length).fill(ChartModule.goalWeight);
        ChartModule.chartInstance.update();

        console.log(`Chart updated: ${weight} lbs on ${date}`);
    }
};

// Photo Overlay Module - NEW FEATURE ADDED, NO REMOVALS
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
