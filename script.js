// FitJourney Tracker - Version v8.1

console.log("FitJourney Tracker v8.1 initializing...");

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
            versionDisplay: document.getElementById('app-version'),
            photoSelect1: document.getElementById('photo-select-1'),
            photoSelect2: document.getElementById('photo-select-2'),
            sideBySideComparison: document.getElementById('side-by-side-comparison'),
            prepareExportBtn: document.getElementById('prepare-export-btn')
        };

        for (const [key, value] of Object.entries(requiredElements)) {
            if (!value) {
                console.warn(`Warning: Element with ID '${key}' is missing!`);
            }
        }

        if (requiredElements.versionDisplay) {
            requiredElements.versionDisplay.innerText = "v8.1";
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

        console.log("All modules initialized successfully in FitJourney Tracker v8.1.");
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
   Photo Comparison Module
   -------------------------------
This module populates the photo selection dropdowns and displays a side-by-side comparison.
*/
const PhotoComparisonModule = {
    init: function() {
        console.log("PhotoComparisonModule loaded (enhanced implementation).");
        const select1 = document.getElementById('photo-select-1');
        const select2 = document.getElementById('photo-select-2');
        const compareBtn = document.getElementById('compare-photos-btn');
        const comparisonArea = document.getElementById('side-by-side-comparison');

        if (!select1 || !select2 || !compareBtn || !comparisonArea) {
            console.warn("Warning: Photo comparison elements are missing! Photo comparison will not work.");
            return;
        }

        // Function to populate the selects with stored photos.
        const populateSelects = function() {
            const photos = DataPersistenceModule.getPhotos();
            // Clear existing options
            select1.innerHTML = "";
            select2.innerHTML = "";

            photos.forEach((photo, index) => {
                // Use photo.date if available; otherwise use a default label.
                const label = photo.date ? `Photo (${photo.date})` : `Photo ${index + 1}`;
                const option1 = document.createElement('option');
                option1.value = index;
                option1.text = label;
                select1.appendChild(option1);

                // Clone option for second select
                const option2 = document.createElement('option');
                option2.value = index;
                option2.text = label;
                select2.appendChild(option2);
            });
        };

        // Initially populate the selects.
        populateSelects();

        // When user clicks the compare button, display the selected photos side-by-side.
        compareBtn.addEventListener('click', function() {
            const photos = DataPersistenceModule.getPhotos();
            const idx1 = parseInt(select1.value);
            const idx2 = parseInt(select2.value);

            if (isNaN(idx1) || isNaN(idx2)) {
                console.warn("Please select valid photos for comparison.");
                return;
            }
            if (idx1 === idx2) {
                console.warn("Please select two different photos for comparison.");
                return;
            }

            // Retrieve the selected photo objects.
            const photo1 = photos[idx1];
            const photo2 = photos[idx2];

            // Clear previous comparison content.
            comparisonArea.innerHTML = "";

            // Create container elements for each photo.
            const container1 = document.createElement('div');
            container1.style.display = "inline-block";
            container1.style.margin = "10px";
            const container2 = document.createElement('div');
            container2.style.display = "inline-block";
            container2.style.margin = "10px";

            // Create image elements for each photo.
            const img1 = document.createElement('img');
            img1.src = photo1.dataUrl || photo1.src || "";
            img1.alt = photo1.date ? `Photo from ${photo1.date}` : "Uploaded Photo";
            img1.style.maxWidth = "300px";
            img1.style.display = "block";
            const info1 = document.createElement('p');
            info1.innerText = photo1.date ? `Date: ${photo1.date}` : "";
            info1.style.margin = "0";

            const img2 = document.createElement('img');
            img2.src = photo2.dataUrl || photo2.src || "";
            img2.alt = photo2.date ? `Photo from ${photo2.date}` : "Uploaded Photo";
            img2.style.maxWidth = "300px";
            img2.style.display = "block";
            const info2 = document.createElement('p');
            info2.innerText = photo2.date ? `Date: ${photo2.date}` : "";
            info2.style.margin = "0";

            container1.appendChild(img1);
            container1.appendChild(info1);
            container2.appendChild(img2);
            container2.appendChild(info2);

            // Append both containers to the comparison area.
            comparisonArea.appendChild(container1);
            comparisonArea.appendChild(container2);
        });
    }
};

/* -------------------------------
   Export Module
   -------------------------------
This module now provides two export templates:
1. "Single Photo with Overlay" (existing)
2. "Photo Comparison Export" (new in v8.1)
It creates a canvas with the selected export, displays it in the overlay preview, and allows the user to download the final image.
*/
const ExportModule = {
    exportCanvas: null,
    init: function() {
        console.log("ExportModule loaded (enhanced implementation).");
        const prepareBtn = document.getElementById('prepare-export-btn');
        const downloadBtn = document.getElementById('exportDataBtn');
        const overlayPreview = document.getElementById('overlay-preview');

        if (!prepareBtn || !downloadBtn || !overlayPreview) {
            console.warn("Warning: Export elements are missing.");
            return;
        }

        prepareBtn.addEventListener('click', () => {
            // Get selected export type from radio buttons.
            const exportType = document.querySelector('input[name="export-type"]:checked').value;
            if (exportType === "single-photo") {
                ExportModule.prepareSinglePhotoExport();
            } else if (exportType === "photo-comparison") {
                ExportModule.preparePhotoComparisonExport();
            } else if (exportType === "data-only") {
                overlayPreview.innerHTML = "Data Only export not implemented yet.";
                overlayPreview.style.display = "block";
            }
        });

        downloadBtn.addEventListener('click', () => {
            if (ExportModule.exportCanvas) {
                const dataURL = ExportModule.exportCanvas.toDataURL("image/png");
                const link = document.createElement('a');
                link.href = dataURL;
                link.download = "export.png";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                console.warn("No export available. Please prepare export first.");
            }
        });
    },
    prepareSinglePhotoExport: function() {
        // Get the last uploaded photo and the latest weight log.
        const photos = DataPersistenceModule.getPhotos();
        const logs = DataPersistenceModule.getWeightLogs();
        if (photos.length === 0) {
            alert("No photo available for export.");
            return;
        }
        const lastPhoto = photos[photos.length - 1];
        let latestWeight = "N/A", latestDate = "";
        if (logs.length > 0) {
            const lastLog = logs[logs.length - 1];
            latestWeight = lastLog.weight;
            latestDate = lastLog.date;
        }

        // Create a canvas for export (800x600)
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 600;
        const ctx = canvas.getContext('2d');

        // Fill background with white.
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw the photo: scale it to fit within a 600x400 area (centered at (100,50)).
        const photoImg = new Image();
        photoImg.onload = function() {
            const drawWidth = 600, drawHeight = 400;
            const x = 100, y = 50;
            ctx.drawImage(photoImg, x, y, drawWidth, drawHeight);

            // Overlay text for latest weight and date.
            ctx.fillStyle = "#000000";
            ctx.font = "30px Arial";
            ctx.fillText(`Latest Weight: ${latestWeight} lbs`, 100, 500);
            ctx.fillText(`Date: ${latestDate}`, 100, 540);

            // Draw a border around the photo.
            ctx.strokeStyle = "#007bff";
            ctx.lineWidth = 5;
            ctx.strokeRect(x, y, drawWidth, drawHeight);

            // Save and display the export.
            ExportModule.exportCanvas = canvas;
            const overlayPreview = document.getElementById('overlay-preview');
            overlayPreview.innerHTML = "";
            overlayPreview.appendChild(canvas);
            overlayPreview.style.display = "block";
            console.log("Single photo export prepared.");
        };
        photoImg.onerror = function() {
            console.error("Failed to load photo for export.");
        };
        photoImg.src = lastPhoto.dataUrl || lastPhoto.src || "";
    },
    preparePhotoComparisonExport: function() {
        // Retrieve the selected photos from the dropdowns.
        const select1 = document.getElementById('photo-select-1');
        const select2 = document.getElementById('photo-select-2');
        const overlayPreview = document.getElementById('overlay-preview');
        if (!select1 || !select2) {
            alert("Photo selectors not found.");
            return;
        }
        const idx1 = parseInt(select1.value);
        const idx2 = parseInt(select2.value);
        if (isNaN(idx1) || isNaN(idx2)) {
            alert("Please select valid photos for export.");
            return;
        }
        if (idx1 === idx2) {
            alert("Please select two different photos for export.");
            return;
        }
        const photos = DataPersistenceModule.getPhotos();
        const photo1 = photos[idx1];
        const photo2 = photos[idx2];
        if (!photo1 || !photo2) {
            alert("Selected photos not found.");
            return;
        }

        // Create a canvas for export (1200x600: two panels of 600x600)
        const canvas = document.createElement('canvas');
        canvas.width = 1200;
        canvas.height = 600;
        const ctx = canvas.getContext('2d');

        // Fill background with white.
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Load both images.
        const img1 = new Image();
        const img2 = new Image();
        let imagesLoaded = 0;
        const onImageLoad = function() {
            imagesLoaded++;
            if (imagesLoaded === 2) {
                // Draw the first image scaled to a 600x600 area in the left panel.
                ctx.drawImage(img1, 0, 0, 600, 600);
                // Draw the second image scaled to a 600x600 area in the right panel.
                ctx.drawImage(img2, 600, 0, 600, 600);

                // Overlay text for each photo.
                ctx.fillStyle = "#000000";
                ctx.font = "30px Arial";
                ctx.fillText(`Date: ${photo1.date || "N/A"}`, 20, 580);
                ctx.fillText(`Date: ${photo2.date || "N/A"}`, 620, 580);

                // Draw a title across the top.
                ctx.font = "40px Arial";
                ctx.fillStyle = "#007bff";
                ctx.fillText("Photo Comparison Export", 300, 50);

                // Save and display the export.
                ExportModule.exportCanvas = canvas;
                overlayPreview.innerHTML = "";
                overlayPreview.appendChild(canvas);
                overlayPreview.style.display = "block";
                console.log("Photo comparison export prepared.");
            }
        };
        img1.onload = onImageLoad;
        img2.onload = onImageLoad;
        img1.onerror = function() { console.error("Failed to load photo 1 for export."); };
        img2.onerror = function() { console.error("Failed to load photo 2 for export."); };
        img1.src = photo1.dataUrl || photo1.src || "";
        img2.src = photo2.dataUrl || photo2.src || "";
    }
};

/* -------------------------------
   Photo Overlay Module (Dummy)
   ------------------------------- */
const PhotoOverlayModule = {
    init: function() {
        console.log("PhotoOverlayModule loaded (dummy implementation).");
        // Placeholder for photo overlay functionality.
    }
};

/* -------------------------------
   Streak Tracker Module (Dummy)
   ------------------------------- */
const StreakTrackerModule = {
    init: function() {
        console.log("StreakTrackerModule loaded (dummy implementation).");
        // Placeholder for streak tracking functionality.
    }
};

/* -------------------------------
   User Profile Module (Dummy)
   ------------------------------- */
const UserProfileModule = {
    init: function() {
        console.log("UserProfileModule loaded (dummy implementation).");
        // Placeholder for user profile functionality.
    }
};

/* -------------------------------
   Community Engagement Module (Dummy)
   ------------------------------- */
const CommunityEngagementModule = {
    init: function() {
        console.log("CommunityEngagementModule loaded (dummy implementation).");
        // Placeholder for community engagement functionality.
    }
};

/* -------------------------------
   Dark Mode Module (Dummy)
   ------------------------------- */
const DarkModeModule = {
    init: function() {
        console.log("DarkModeModule loaded (dummy implementation).");
        // Placeholder for dark mode functionality.
    }
};

/* -------------------------------
   CSV Export Module (Dummy)
   ------------------------------- */
const CsvExportModule = {
    init: function() {
        console.log("CsvExportModule loaded (dummy implementation).");
        // Placeholder for CSV export functionality.
    }
};
