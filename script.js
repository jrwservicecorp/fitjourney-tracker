// FitJourney Tracker - Version v7.51 (Fixing Chart, Weight Logging & Photo Uploads)

console.log("FitJourney Tracker v7.51 initializing...");

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
            photoGallery: document.getElementById('photo-gallery')
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

        console.log("All modules initialized successfully in FitJourney Tracker v7.51.");
    } catch (error) {
        console.error("Error initializing modules:", error);
    }
};

// Chart Module - Fixes Display Issue
const ChartModule = {
    chartInstance: null,

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
                labels: [],
                datasets: [{ label: 'Your Progress', data: [], borderColor: 'blue', borderWidth: 2 }]
            },
            options: { responsive: true }
        });

        console.log("Chart initialized successfully.");
    },

    updateChart: function(weight, date) {
        if (ChartModule.chartInstance) {
            ChartModule.chartInstance.data.labels.push(date);
            ChartModule.chartInstance.data.datasets[0].data.push(weight);
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
                gallery.appendChild(img);

                input.value = '';
            } else {
                console.warn("No photo selected.");
            }
        });
    }
};

// Photo Comparison Module - Debugging Initialization
const PhotoComparisonModule = {
    init: function() {
        console.log("PhotoComparisonModule loaded");
    }
};

// Export Module - Debugging Initialization
const ExportModule = {
    init: function() {
        console.log("ExportModule loaded");
    }
};

// Streak Tracker Module - Debugging Initialization
const StreakTrackerModule = {
    init: function() {
        console.log("StreakTrackerModule loaded");
    }
};

// User Profile Module - Debugging Initialization
const UserProfileModule = {
    init: function() {
        console.log("UserProfileModule loaded");
    }
};

// Community Engagement Module - Debugging Initialization
const CommunityEngagementModule = {
    init: function() {
        console.log("CommunityEngagementModule loaded");
    }
};

// Dark Mode Module - Debugging Initialization
const DarkModeModule = {
    init: function() {
        console.log("DarkModeModule loaded");
    }
};

// CSV Export Module - Debugging Initialization
const CsvExportModule = {
    init: function() {
        console.log("CsvExportModule loaded");
    }
};
