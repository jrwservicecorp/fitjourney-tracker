// FitJourney Tracker - Version v7.97

console.log("FitJourney Tracker v7.97 initializing...");

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
            requiredElements.versionDisplay.innerText = "v7.97";
        }

        // Initialize modules in order:
        ChartModule.init();
        WeightLoggingModule.init();
        PhotoUploadModule.init();
        PhotoComparisonModule.init();
        ExportModule.init();
        PhotoOverlayModule.init();
        StreakTrackerModule.init();
        UserProfileModule.init();
        CommunityEngagementModule.init();
        DarkModeModule.init();
        CsvExportModule.init();

        console.log("All modules initialized successfully in FitJourney Tracker v7.97.");
    } catch (error) {
        console.error("Error initializing modules:", error);
    }
};

/* -------------------------------
   Data Persistence Module
   -------------------------------
Provides helper functions to get, save, and update data in localStorage.
*/
const DataPersistenceModule = {
    // Maximum number of photos to store
    MAX_PHOTOS: 20,

    // Weight Logs
    getWeightLogs: function() {
        let logs = localStorage.getItem("weightLogs");
        return logs ? JSON.parse(logs) : [];
    },
    saveWeightLogs: function(logs) {
        localStorage.setItem("weightLogs", JSON.stringify(logs));
    },
    addWeightLog: function(log) {
        let logs = this.getWeightLogs();
        logs.push(log);
        this.saveWeightLogs(logs);
    },

    // Photo Gallery
    getPhotos: function() {
        let photos = localStorage.getItem("photos");
        return photos ? JSON.parse(photos) : [];
    },
    savePhotos: function(photos) {
        try {
            localStorage.setItem("photos", JSON.stringify(photos));
        } catch (e) {
            if (e.name === 'QuotaExceededError') {
                console.error("LocalStorage quota exceeded. Consider clearing old photos or switching to IndexedDB.");
                throw e;
            } else {
                throw e;
            }
        }
    },
    addPhoto: function(photo) {
        let photos = this.getPhotos();
        // If maximum number of photos reached, remove the oldest before adding new one.
        if (photos.length >= this.MAX_PHOTOS) {
            console.log(`Max photo limit reached (${this.MAX_PHOTOS}). Removing oldest photo.`);
            photos.shift();
        }
        photos.push(photo);
        try {
            this.savePhotos(photos);
        } catch (e) {
            if (e.name === 'QuotaExceededError') {
                console.error("Quota exceeded even after removing the oldest photo.");
            }
        }
    }
};

/* -------------------------------
   Chart Module
   ------------------------------- */
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
            ChartModule.goalWeight = weight - 10;
        }

        ChartModule.chartInstance.data.labels = [...ChartModule.labels];
        ChartModule.chartInstance.data.datasets[1].data = [...ChartModule.userWeights];
        ChartModule.chartInstance.data.datasets[2].data = Array(ChartModule.labels.length).fill(ChartModule.goalWeight);
        ChartModule.chartInstance.update();

        console.log(`Chart updated: ${weight} lbs on ${date}`);
    }
};

/* -------------------------------
   Weight Logging Module
   ------------------------------- */
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

        // Load existing weight logs from localStorage
        const existingLogs = DataPersistenceModule.getWeightLogs();
        if (existingLogs.length > 0) {
            recentWeighIns.innerHTML = "";
            existingLogs.forEach(log => {
                recentWeighIns.innerHTML += `<p>Weight: ${log.weight} lbs on ${log.date}</p>`;
                ChartModule.labels.push(log.date);
                ChartModule.userWeights.push(log.weight);
            });
            const lastLog = existingLogs[existingLogs.length - 1];
            weightSummary.innerHTML = `<p>Latest weight: ${lastLog.weight} lbs on ${lastLog.date}</p>`;
            // Update Chart if it exists
            if (ChartModule.chartInstance) {
                ChartModule.chartInstance.data.labels = [...ChartModule.labels];
                ChartModule.chartInstance.data.datasets[1].data = [...ChartModule.userWeights];
                if (!ChartModule.goalWeight && lastLog.weight) {
                    ChartModule.goalWeight = lastLog.weight - 10;
                }
                ChartModule.chartInstance.data.datasets[2].data = Array(ChartModule.labels.length).fill(ChartModule.goalWeight);
                ChartModule.chartInstance.update();
            }
        }

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const weight = parseFloat(input.value.trim());
            const date = dateInput.value.trim();

            if (weight && date) {
                console.log(`Weight logged: ${weight} lbs on ${date}`);

                // Update UI
                if (recentWeighIns.querySelector('.placeholder')) {
                    recentWeighIns.innerHTML = "";
                }
                recentWeighIns.innerHTML += `<p>Weight: ${weight} lbs on ${date}</p>`;
                weightSummary.innerHTML = `<p>Latest weight: ${weight} lbs on ${date}</p>`;

                // Save the log in localStorage
                DataPersistenceModule.addWeightLog({ weight: weight, date: date });

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

/* -------------------------------
   Photo Upload Module
   ------------------------------- */
const PhotoUploadModule = {
    // Maximum dimensions for stored images
    MAX_WIDTH: 800,
    MAX_HEIGHT: 800,

    init: function() {
        console.log("PhotoUploadModule loaded (updated implementation).");
        const form = document.getElementById('photo-upload-form');
        const photoInput = document.getElementById('photo-upload');
        const photoDateInput = document.getElementById('photo-date');
        const gallery = document.getElementById('photo-gallery');

        if (!form || !photoInput || !gallery) {
            console.warn("Warning: Photo upload elements are missing! Photo upload will not work.");
            return;
        }

        // Load existing photos from localStorage
        const existingPhotos = DataPersistenceModule.getPhotos();
        if (existingPhotos.length > 0) {
            gallery.innerHTML = "";
            existingPhotos.forEach(photo => {
                // Support both "dataUrl" and legacy "src" properties.
                let src = photo.dataUrl || photo.src;
                if (src) {
                    const img = document.createElement('img');
                    img.src = src;
                    img.alt = photo.date ? `Photo from ${photo.date}` : "Uploaded Photo";
                    gallery.appendChild(img);
                } else {
                    console.warn("Skipping photo with undefined dataUrl/src", photo);
                }
            });
        }

        form.addEventListener('submit', function(event) {
            event.preventDefault();
            const file = photoInput.files[0];
            const photoDate = photoDateInput.value;

            if (!file) {
                console.warn("No file selected for upload.");
                return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                // e.target.result is the original dataURL.
                PhotoUploadModule.compressAndSave(e.target.result, photoDate, gallery);
            };

            reader.readAsDataURL(file);

            // Reset the form inputs after upload
            photoInput.value = "";
            photoDateInput.value = "";
        });
    },

    /**
     * Compress (resize) the image if needed, then update the gallery and save the photo.
     */
    compressAndSave: function(dataUrl, photoDate, gallery) {
        const img = new Image();
        img.onload = function() {
            // Determine new dimensions while preserving aspect ratio
            let width = img.width;
            let height = img.height;
            const maxWidth = PhotoUploadModule.MAX_WIDTH;
            const maxHeight = PhotoUploadModule.MAX_HEIGHT;

            if (width > maxWidth || height > maxHeight) {
                const aspectRatio = width / height;
                if (width > height) {
                    width = maxWidth;
                    height = Math.round(maxWidth / aspectRatio);
                } else {
                    height = maxHeight;
                    width = Math.round(maxHeight * aspectRatio);
                }
            }

            // Create an offscreen canvas and draw the image into it
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            // Get the compressed data URL
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7); // adjust quality if needed

            // Create and display a new image element in the gallery
            const newImg = document.createElement('img');
            newImg.src = compressedDataUrl;
            newImg.alt = photoDate ? `Photo from ${photoDate}` : "Uploaded Photo";

            // Remove the placeholder if it exists and append the new image
            if (gallery.querySelector('.placeholder')) {
                gallery.innerHTML = "";
            }
            gallery.appendChild(newImg);
            console.log("Photo uploaded, compressed, and displayed in gallery.");

            // Save the compressed photo in localStorage
            DataPersistenceModule.addPhoto({ dataUrl: compressedDataUrl, date: photoDate });
        };
        img.onerror = function() {
            console.error("Error loading image for compression.");
        };
        img.src = dataUrl;
    }
};

/* -------------------------------
   Other Modules (Dummy Implementations)
   ------------------------------- */
const PhotoComparisonModule = {
    init: function() {
        console.log("PhotoComparisonModule loaded (dummy implementation).");
        // Placeholder for photo comparison functionality.
    }
};

const ExportModule = {
    init: function() {
        console.log("ExportModule loaded (dummy implementation).");
        // Placeholder for export functionality.
    }
};

const PhotoOverlayModule = {
    init: function() {
        console.log("PhotoOverlayModule loaded (dummy implementation).");
        // Placeholder for photo overlay functionality.
    }
};

const StreakTrackerModule = {
    init: function() {
        console.log("StreakTrackerModule loaded (dummy implementation).");
        // Placeholder for streak tracking functionality.
    }
};

const UserProfileModule = {
    init: function() {
        console.log("UserProfileModule loaded (dummy implementation).");
        // Placeholder for user profile functionality.
    }
};

const CommunityEngagementModule = {
    init: function() {
        console.log("CommunityEngagementModule loaded (dummy implementation).");
        // Placeholder for community engagement functionality.
    }
};

const DarkModeModule = {
    init: function() {
        console.log("DarkModeModule loaded (dummy implementation).");
        // Placeholder for dark mode functionality.
    }
};

const CsvExportModule = {
    init: function() {
        console.log("CsvExportModule loaded (dummy implementation).");
        // Placeholder for CSV export functionality.
    }
};
