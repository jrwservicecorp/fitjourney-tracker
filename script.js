// FitJourney Tracker - Version v7.80 (FULL ROLLBACK - EVERYTHING RESTORED)

console.log("FitJourney Tracker v7.80 initializing...");

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
            requiredElements.versionDisplay.innerText = "v7.80";
        }

        ChartModule.init();  
        WeightLoggingModule.init();
        PhotoUploadModule.init();
        PhotoComparisonModule.init();  // Ensuring this works now
        ExportModule.init();
        StreakTrackerModule.init();
        UserProfileModule.init();
        CommunityEngagementModule.init();
        DarkModeModule.init();
        CsvExportModule.init();

        console.log("All modules initialized successfully in FitJourney Tracker v7.80.");
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
    }
};

// Weight Logging Module - FULL ROLLBACK
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

// Photo Upload Module - FULL ROLLBACK
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

// Photo Comparison Module - FULL RESTORE
const PhotoComparisonModule = {
    init: function() {
        console.log("PhotoComparisonModule loaded");
        const compareBtn = document.getElementById('compare-photos-btn');
        const photoSelect1 = document.getElementById('photo-select-1');
        const photoSelect2 = document.getElementById('photo-select-2');
        const comparisonDisplay = document.getElementById('side-by-side-comparison');

        if (!compareBtn || !photoSelect1 || !photoSelect2 || !comparisonDisplay) {
            console.warn("Warning: Photo comparison elements are missing! Photo comparison will not work.");
            return;
        }

        compareBtn.addEventListener('click', function() {
            const selectedPhoto1 = photoSelect1.value;
            const selectedPhoto2 = photoSelect2.value;

            if (!selectedPhoto1 || !selectedPhoto2) {
                console.warn("No photos selected for comparison.");
                return;
            }

            comparisonDisplay.innerHTML = `
                <div class="comparison-image"><img src="${selectedPhoto1}" alt="Photo 1"></div>
                <div class="comparison-image"><img src="${selectedPhoto2}" alt="Photo 2"></div>
            `;
            console.log("Photo comparison triggered");
        });
    }
};
