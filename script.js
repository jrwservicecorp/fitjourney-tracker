// FitJourney Tracker - Version v7.52 (Restoring Sample Data & Fixing Features)

console.log("FitJourney Tracker v7.52 initializing...");

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
            clearPhotosButton: document.getElementById('clear-photos-btn'),
            comparePhotosButton: document.getElementById('comparePhotosBtn'),
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

        console.log("All modules initialized successfully in FitJourney Tracker v7.52.");
    } catch (error) {
        console.error("Error initializing modules:", error);
    }
};

// Chart Module - Restoring Sample Data & Toggle Feature
const ChartModule = {
    chartInstance: null,
    sampleDataEnabled: true,
    sampleWeights: [200, 195, 190, 185],
    userWeights: [],
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],

    init: function() {
        console.log("ChartModule loaded");
        const canvas = document.getElementById('weightChart');
        const toggleDemo = document.createElement('input');
        toggleDemo.type = "checkbox";
        toggleDemo.checked = ChartModule.sampleDataEnabled;
        toggleDemo.id = "toggle-demo-data";
        toggleDemo.addEventListener("change", () => {
            ChartModule.sampleDataEnabled = toggleDemo.checked;
            ChartModule.chartInstance.data.datasets[0].hidden = !ChartModule.sampleDataEnabled;
            ChartModule.chartInstance.update();
        });

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
                    { label: 'Sample Data', data: ChartModule.sampleWeights, borderColor: 'pink', borderWidth: 2 },
                    { label: 'Your Progress', data: ChartModule.userWeights, borderColor: 'blue', borderWidth: 2 }
                ]
            },
            options: { responsive: true }
        });

        console.log("Chart initialized successfully.");
    },

    updateChart: function(weight, date) {
        if (ChartModule.chartInstance) {
            ChartModule.labels.push(date);
            ChartModule.userWeights.push(weight);

            if (ChartModule.labels.length > 4) {
                ChartModule.labels.shift();
                ChartModule.userWeights.shift();
            }

            ChartModule.chartInstance.data.labels = ChartModule.labels;
            ChartModule.chartInstance.data.datasets[1].data = ChartModule.userWeights;
            ChartModule.chartInstance.update();
            console.log(`Chart updated: ${weight} lbs on ${date}`);
        } else {
            console.warn("Chart instance not initialized!");
        }
    }
};

// Weight Logging Module - Ensuring UI Updates
const WeightLoggingModule = {
    init: function() {
        console.log("WeightLoggingModule loaded");
        const form = document.getElementById('weight-form');
        const input = document.getElementById('weight-input');
        const dateInput = document.getElementById('date-input');
        const recentWeighIns = document.getElementById('recent-weighins');

        if (!form || !input || !dateInput || !recentWeighIns) {
            console.warn("Warning: Weight logging elements are missing! Weight logging will not work.");
            return;
        }

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const weight = parseFloat(input.value.trim());
            const date = dateInput.value.trim();

            if (weight && date) {
                console.log(`Weight logged: ${weight} lbs on ${date}`);

                const placeholder = recentWeighIns.querySelector('.placeholder');
                if (placeholder) placeholder.remove();

                const entry = document.createElement('p');
                entry.textContent = `Weight: ${weight} lbs on ${date}`;
                recentWeighIns.appendChild(entry);

                ChartModule.updateChart(weight, date);

                input.value = '';
                dateInput.value = '';
            } else {
                console.warn("No weight or date entered.");
            }
        });
    }
};

// Photo Upload Module - Ensuring Photos Save in Gallery
const PhotoUploadModule = {
    init: function() {
        console.log("PhotoUploadModule loaded");
        const form = document.getElementById('photo-upload-form');
        const input = document.getElementById('uploadPhoto');
        const gallery = document.getElementById('photo-gallery');
        const clearPhotosButton = document.getElementById('clear-photos-btn');

        if (!form || !input || !gallery || !clearPhotosButton) {
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
                gallery.appendChild(img);

                input.value = '';
            } else {
                console.warn("No photo selected.");
            }
        });

        clearPhotosButton.addEventListener('click', () => {
            gallery.innerHTML = '<p class="placeholder">No photos uploaded yet.</p>';
            console.log("Photo gallery cleared.");
        });
    }
};
