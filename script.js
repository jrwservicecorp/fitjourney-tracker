// FitJourney Tracker - Version v7.67 (FULL RESTORATION - STABILITY FIRST)

console.log("FitJourney Tracker v7.67 initializing...");

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
            requiredElements.versionDisplay.innerText = "v7.67";
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

        console.log("All modules initialized successfully in FitJourney Tracker v7.67.");
    } catch (error) {
        console.error("Error initializing modules:", error);
    }
};

// Chart Module - FULL RESTORATION
const ChartModule = {
    chartInstance: null,
    sampleDataEnabled: true,
    sampleWeights: [200, 195, 190, 185],
    userWeights: [],
    labels: ["Day 1", "Day 2", "Day 3", "Day 4"],

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
                    { label: 'Sample Data', data: ChartModule.sampleWeights, borderColor: 'pink', borderWidth: 2, hidden: false },
                    { label: 'Your Progress', data: ChartModule.userWeights, borderColor: 'blue', borderWidth: 2 }
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

        ChartModule.chartInstance.data.labels = [...ChartModule.labels];
        ChartModule.chartInstance.data.datasets[1].data = [...ChartModule.userWeights];
        ChartModule.chartInstance.update();
        console.log(`Chart updated: ${weight} lbs on ${date}`);
    }
};

// Weight Logging Module - FULL RESTORATION
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

// Photo Upload Module - FULL RESTORATION
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
