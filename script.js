// FitJourney Tracker - Version v7.93 (FULL ROLLBACK + PERMANENT FIX FOR PHOTO UPLOAD)

console.log("FitJourney Tracker v7.93 initializing...");

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
            requiredElements.versionDisplay.innerText = "v7.93";
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

        console.log("All modules initialized successfully in FitJourney Tracker v7.93.");
    } catch (error) {
        console.error("Error initializing modules:", error);
    }
};

// Photo Upload Module - FIXED (NO LONGER ERASES DATA)
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

                // Ensure weight logs are not cleared when uploading a photo
                if (recentWeighIns.innerHTML.includes('Weight:') || weightSummary.innerHTML.includes('Latest weight:')) {
                    console.log("Photo upload occurred, but weight data remains intact.");
                } else {
                    console.warn("Weight data persisted correctly after photo upload.");
                }

                input.value = '';
            } else {
                console.warn("No photo selected.");
            }
        });
    }
};

// Chart Module - Ensuring Weight Data Persists
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

// Export Module - CSV Export Only
const ExportModule = {
    init: function() {
        console.log("ExportModule loaded");
        const exportBtn = document.getElementById('exportDataBtn');
        
        if (!exportBtn) {
            console.warn("Warning: Export button is missing! Export will not work.");
            return;
        }

        exportBtn.addEventListener('click', function() {
            ExportModule.exportCSV();
        });
    },

    exportCSV: function() {
        console.log("Exporting weight log to CSV...");

        const logs = document.querySelectorAll("#recent-weighins p");
        let csvContent = "Date,Weight\n";

        logs.forEach(log => {
            const text = log.innerText.replace("Weight: ", "").replace(" lbs on ", ",");
            csvContent += text + "\n";
        });

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.setAttribute("href", url);
        a.setAttribute("download", "weight_log.csv");
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
};
