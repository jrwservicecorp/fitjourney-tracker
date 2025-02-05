// ============================================================
// FitJourney Tracker - Version v8.8.3
// ============================================================

// This file contains all modules required for the FitJourney Tracker app.
// It handles charting, weight logging, photo upload and comparison,
// export overlays (with Fabric.js editing support), and several dummy modules.
// Extensive comments and spacing have been added to make the file
// more verbose and easier to follow, similar to previous versions.

console.log("FitJourney Tracker v8.8.3 initializing...");

// ------------------------------------------------------------
// Global Initialization
// ------------------------------------------------------------
window.onload = function() {
    try {
        console.log("Checking required elements before initializing modules...");

        // Define required elements by their IDs.
        // These elements are expected to be present in the HTML.
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
            prepareExportBtn: document.getElementById('prepare-export-btn'),
            exportStartDate: document.getElementById('export-start-date'),
            exportEndDate: document.getElementById('export-end-date')
        };

        // Log warnings if any required element is missing.
        for (const [key, value] of Object.entries(requiredElements)) {
            if (!value) {
                console.warn(`Warning: Element with ID '${key}' is missing!`);
            }
        }

        // Update the version display element.
        if (requiredElements.versionDisplay) {
            requiredElements.versionDisplay.innerText = "v8.8.3";
        }

        // ------------------------------------------------------------
        // Module Initializations
        // ------------------------------------------------------------
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

        // ------------------------------------------------------------
        // Global Click-Outside Handler for Overlay
        // ------------------------------------------------------------
        // This handler will close the overlay when clicking outside of it,
        // except when clicking within elements that are part of the overlay controls.
        document.addEventListener('click', function(e) {
            const overlay = document.getElementById('overlay-preview');
            if (overlay.style.display === "block" && !overlay.contains(e.target) &&
                !e.target.closest('#overlay-controls')) {
                overlay.style.display = "none";
            }
        });

        console.log("All modules initialized successfully in FitJourney Tracker v8.8.3.");
    } catch (error) {
        console.error("Error initializing modules:", error);
    }
};

// ============================================================
// Data Persistence Module
// ============================================================
const DataPersistenceModule = {
    MAX_PHOTOS: 20,
    // Get weight logs from localStorage
    getWeightLogs: function() {
        let logs = localStorage.getItem("weightLogs");
        return logs ? JSON.parse(logs) : [];
    },
    // Save weight logs to localStorage
    saveWeightLogs: function(logs) {
        localStorage.setItem("weightLogs", JSON.stringify(logs));
    },
    // Add a new weight log and save it
    addWeightLog: function(log) {
        let logs = this.getWeightLogs();
        logs.push(log);
        this.saveWeightLogs(logs);
    },
    // Get photos from localStorage
    getPhotos: function() {
        let photos = localStorage.getItem("photos");
        return photos ? JSON.parse(photos) : [];
    },
    // Save photos to localStorage
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
    // Add a new photo and save it
    addPhoto: function(photo) {
        let photos = this.getPhotos();
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

// ============================================================
// Chart Module
// ============================================================
const ChartModule = {
    chartInstance: null,
    sampleDataEnabled: true,
    sampleWeights: [200, 195, 190, 185],
    userWeights: [],
    labels: ["Day 1", "Day 2", "Day 3", "Day 4"],
    goalWeight: null,
    // Initialize the Chart.js chart
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
            options: {
                responsive: true,
                scales: {
                    x: {
                        ticks: { color: '#ffffff', font: { size: 14 } },
                        grid: { color: 'rgba(255,255,255,0.2)' }
                    },
                    y: {
                        ticks: { color: '#ffffff', font: { size: 14 } },
                        grid: { color: 'rgba(255,255,255,0.2)' }
                    }
                }
            }
        });
    },
    // Update the chart with new weight and date data
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

// ============================================================
// Weight Logging Module
// ============================================================
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
        // Load existing logs from localStorage
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
        // Listen for form submission to log new weight data
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
                DataPersistenceModule.addWeightLog({ weight: weight, date: date });
                ChartModule.updateChart(weight, date);
                input.value = '';
                dateInput.value = '';
            } else {
                console.warn("No weight or date entered.");
            }
        });
    }
};

// ============================================================
// Photo Upload Module
// ============================================================
const PhotoUploadModule = {
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
        // Listen for form submission for photo upload
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
                PhotoUploadModule.compressAndSave(e.target.result, photoDate, gallery);
            };
            reader.readAsDataURL(file);
            photoInput.value = "";
            photoDateInput.value = "";
        });
    },
    compressAndSave: function(dataUrl, photoDate, gallery) {
        const img = new Image();
        img.onload = function() {
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
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
            const newImg = document.createElement('img');
            newImg.src = compressedDataUrl;
            newImg.alt = photoDate ? `Photo from ${photoDate}` : "Uploaded Photo";
            if (gallery.querySelector('.placeholder')) {
                gallery.innerHTML = "";
            }
            gallery.appendChild(newImg);
            console.log("Photo uploaded, compressed, and displayed in gallery.");
            DataPersistenceModule.addPhoto({ dataUrl: compressedDataUrl, date: photoDate });
        };
        img.onerror = function() {
            console.error("Error loading image for compression.");
        };
        img.src = dataUrl;
    }
};

// ============================================================
// Photo Comparison Module
// ============================================================
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
        // Populate the photo selectors with available photos
        const populateSelects = function() {
            const photos = DataPersistenceModule.getPhotos();
            select1.innerHTML = "";
            select2.innerHTML = "";
            photos.forEach((photo, index) => {
                const label = photo.date ? `Photo (${photo.date})` : `Photo ${index + 1}`;
                const option1 = document.createElement('option');
                option1.value = index;
                option1.text = label;
                select1.appendChild(option1);
                const option2 = document.createElement('option');
                option2.value = index;
                option2.text = label;
                select2.appendChild(option2);
            });
        };
        populateSelects();
        // Listen for the Compare Photos button click
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
            const photo1 = photos[idx1];
            const photo2 = photos[idx2];
            if (!photo1 || !photo2) {
                alert("Selected photos not found.");
                return;
            }
            comparisonArea.innerHTML = "";
            const container1 = document.createElement('div');
            container1.style.display = "inline-block";
            container1.style.margin = "10px";
            const container2 = document.createElement('div');
            container2.style.display = "inline-block";
            container2.style.margin = "10px";
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
            comparisonArea.appendChild(container1);
            comparisonArea.appendChild(container2);
        });
    }
};

// ============================================================
// Export Module with Fabric.js Integration
// ============================================================
const ExportModule = {
    exportCanvas: null,
    fabricCanvas: null, // This will hold the Fabric.js canvas instance
    init: function() {
        console.log("ExportModule loaded (enhanced implementation).");
        const prepareBtn = document.getElementById('prepare-export-btn');
        const downloadBtn = document.getElementById('exportDataBtn');
        const overlayPreview = document.getElementById('overlay-preview');
        if (!prepareBtn || !downloadBtn || !overlayPreview) {
            console.warn("Warning: Export elements are missing.");
            return;
        }
        // Listen for Prepare Export button clicks
        prepareBtn.addEventListener('click', () => {
            const exportType = document.querySelector('input[name="export-type"]:checked').value;
            if (exportType === "single-photo") {
                ExportModule.prepareSinglePhotoExport();
            } else if (exportType === "photo-comparison") {
                ExportModule.preparePhotoComparisonExport();
            } else if (exportType === "data-only") {
                ExportModule.prepareDataOnlyExport();
            } else if (exportType === "custom-progress") {
                ExportModule.prepareCustomProgressExport();
            }
        });
        // Listen for Download Export button clicks
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
    addOverlayControls: function() {
        const overlayPreview = document.getElementById('overlay-preview');
        let controls = document.getElementById('overlay-controls');
        if (controls) {
            controls.remove();
        }
        controls = document.createElement('div');
        controls.id = "overlay-controls";
        controls.style.textAlign = "center";
        controls.style.marginTop = "10px";
        controls.style.padding = "10px";
        controls.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
        controls.style.borderRadius = "5px";
        controls.style.display = "inline-block";
    
        // Create a Close button
        const closeBtn = document.createElement('button');
        closeBtn.textContent = "Close";
        closeBtn.style.marginRight = "10px";
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            overlayPreview.style.display = "none";
        });
    
        // Create a Share button
        const shareBtn = document.createElement('button');
        shareBtn.textContent = "Share";
        shareBtn.style.marginRight = "10px";
        shareBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (navigator.share) {
                navigator.share({
                    title: 'My Progress Export',
                    text: 'Check out my progress!',
                    url: ExportModule.exportCanvas.toDataURL("image/png")
                }).catch(err => console.error("Error sharing:", err));
            } else {
                alert("Share functionality is not supported on this device.");
            }
        });
    
        // Create an Edit button to launch the Fabric.js editor
        const editBtn = document.createElement('button');
        editBtn.textContent = "Edit";
        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log("Edit button clicked");
            ExportModule.openFabricEditor();
        });
    
        // Append buttons to the controls container
        controls.appendChild(closeBtn);
        controls.appendChild(editBtn);
        controls.appendChild(shareBtn);
        overlayPreview.appendChild(controls);
    },
    openFabricEditor: function() {
        console.log("openFabricEditor called");
        console.log("fabric type:", typeof fabric); // This should log "object" or "function"
        
        // Remove any previous Fabric instance if exists
        if (ExportModule.fabricCanvas) {
            ExportModule.fabricCanvas.dispose();
            ExportModule.fabricCanvas = null;
        }
        const overlayPreview = document.getElementById('overlay-preview');
        // Convert current exportCanvas to a data URL
        const dataURL = ExportModule.exportCanvas.toDataURL("image/png");
        // Clear overlay and create a container for the Fabric canvas
        overlayPreview.innerHTML = "";
        const editorContainer = document.createElement('div');
        editorContainer.id = "fabric-editor-container";
        editorContainer.style.position = "relative";
        editorContainer.style.display = "inline-block";
        overlayPreview.appendChild(editorContainer);
    
        // Create a new canvas element for Fabric and append it to the container
        const fabricEl = document.createElement('canvas');
        fabricEl.id = "fabric-canvas";
        fabricEl.width = ExportModule.exportCanvas.width;
        fabricEl.height = ExportModule.exportCanvas.height;
        editorContainer.appendChild(fabricEl);
    
        // Initialize Fabric on the new canvas element
        ExportModule.fabricCanvas = new fabric.Canvas(fabricEl, {
            backgroundColor: '#121212'
        });
    
        // Load the export image into the fabric canvas as its background image
        fabric.Image.fromURL(dataURL, function(img) {
            ExportModule.fabricCanvas.setBackgroundImage(img, ExportModule.fabricCanvas.renderAll.bind(ExportModule.fabricCanvas), {
                scaleX: ExportModule.fabricCanvas.width / img.width,
                scaleY: ExportModule.fabricCanvas.height / img.height
            });
        });
    
        // Add a sample editable text object (caption)
        const caption = new fabric.Text("My Progress", {
            left: 400,
            top: 50,
            fontSize: 50,
            fill: "#00aced",
            fontFamily: "Roboto",
            editable: true
        });
        ExportModule.fabricCanvas.add(caption);
    
        // Create and add a "Save Changes" button below the Fabric canvas
        const saveBtn = document.createElement('button');
        saveBtn.textContent = "Save Changes";
        saveBtn.style.marginTop = "10px";
        saveBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = ExportModule.fabricCanvas.getWidth();
            tempCanvas.height = ExportModule.fabricCanvas.getHeight();
            ExportModule.fabricCanvas.renderAll();
            tempCanvas.getContext('2d').drawImage(ExportModule.fabricCanvas.lowerCanvasEl, 0, 0);
            ExportModule.exportCanvas = tempCanvas;
            ExportModule.fabricCanvas.dispose();
            ExportModule.fabricCanvas = null;
            overlayPreview.innerHTML = "";
            overlayPreview.appendChild(tempCanvas);
            ExportModule.addOverlayControls();
            overlayPreview.style.display = "block";
        });
        overlayPreview.appendChild(saveBtn);
    },
    // ========================================================
    // Export Functions
    // ========================================================
    prepareSinglePhotoExport: function() {
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
    
        const canvas = document.createElement('canvas');
        canvas.width = 1200;
        canvas.height = 800;
        const ctx = canvas.getContext('2d');
    
        // Create a linear gradient background
        const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        bgGradient.addColorStop(0, "#1a1a1a");
        bgGradient.addColorStop(1, "#333333");
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    
        // Draw photo container with rounded corners and drop shadow
        const photoX = 100, photoY = 100, photoW = 1000, photoH = 500, radius = 20;
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "rgba(0,0,0,0.4)";
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 5;
        ctx.beginPath();
        ctx.moveTo(photoX + radius, photoY);
        ctx.lineTo(photoX + photoW - radius, photoY);
        ctx.quadraticCurveTo(photoX + photoW, photoY, photoX + photoW, photoY + radius);
        ctx.lineTo(photoX + photoW, photoY + photoH - radius);
        ctx.quadraticCurveTo(photoX + photoW, photoY + photoH, photoX + photoW - radius, photoY + photoH);
        ctx.lineTo(photoX + radius, photoY + photoH);
        ctx.quadraticCurveTo(photoX, photoY + photoH, photoX, photoY + photoH - radius);
        ctx.lineTo(photoX, photoY + radius);
        ctx.quadraticCurveTo(photoX, photoY, photoX + radius, photoY);
        ctx.closePath();
        ctx.fill();
        ctx.shadowColor = "transparent";
    
        // Load and draw the photo image
        const photoImg = new Image();
        photoImg.onload = function() {
            const margin = 20;
            const drawX = photoX + margin;
            const drawY = photoY + margin;
            const drawW = photoW - margin * 2;
            const drawH = photoH - margin * 2;
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(photoX + radius, photoY);
            ctx.lineTo(photoX + photoW - radius, photoY);
            ctx.quadraticCurveTo(photoX + photoW, photoY, photoX + photoW, photoY + radius);
            ctx.lineTo(photoX + photoW, photoY + photoH - radius);
            ctx.quadraticCurveTo(photoX + photoW, photoY + photoH, photoX + photoW - radius, photoY + photoH);
            ctx.lineTo(photoX + radius, photoY + photoH);
            ctx.quadraticCurveTo(photoX, photoY + photoH, photoX, photoY + photoH - radius);
            ctx.lineTo(photoX, photoY + radius);
            ctx.quadraticCurveTo(photoX, photoY, photoX + radius, photoY);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(photoImg, drawX, drawY, drawW, drawH);
            ctx.restore();
    
            // Overlay a semi-transparent box for data overlay
            ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
            ctx.fillRect(100, 630, 1000, 100);
    
            // Draw text for latest weight and date
            ctx.fillStyle = "#ffffff";
            ctx.font = "40px Roboto";
            ctx.textAlign = "left";
            ctx.fillText(`Latest Weight: ${latestWeight} lbs`, 120, 680);
            ctx.fillText(`Date: ${latestDate}`, 120, 730);
    
            // Draw a title at the top of the export
            ctx.font = "50px Roboto";
            ctx.fillStyle = "#00aced";
            ctx.textAlign = "center";
            ctx.fillText("My Progress", canvas.width / 2, 70);
    
            ExportModule.exportCanvas = canvas;
            const overlayPreview = document.getElementById('overlay-preview');
            overlayPreview.innerHTML = "";
            overlayPreview.appendChild(canvas);
            ExportModule.addOverlayControls();
            overlayPreview.style.display = "block";
            console.log("Single photo export prepared with modern styling.");
        };
        photoImg.onerror = function() {
            console.error("Failed to load photo for export.");
        };
        photoImg.src = lastPhoto.dataUrl || lastPhoto.src || "";
    },
    preparePhotoComparisonExport: function() {
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
    
        const canvas = document.createElement('canvas');
        canvas.width = 1400;
        canvas.height = 700;
        const ctx = canvas.getContext('2d');
    
        // Create a linear gradient background for the comparison export
        const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        bgGradient.addColorStop(0, "#222222");
        bgGradient.addColorStop(1, "#444444");
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    
        // Define margins and panel dimensions for photo comparison
        const margin = 25;
        const panelWidth = 650;
        const panelHeight = 650;
    
        // Helper function: draw a panel with rounded corners
        const drawPanel = function(x, y) {
            ctx.save();
            ctx.shadowColor = "rgba(0,0,0,0.5)";
            ctx.shadowBlur = 20;
            ctx.shadowOffsetX = 5;
            ctx.shadowOffsetY = 5;
            ctx.fillStyle = "#ffffff";
            const radius = 20;
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + panelWidth - radius, y);
            ctx.quadraticCurveTo(x + panelWidth, y, x + panelWidth, y + radius);
            ctx.lineTo(x + panelWidth, y + panelHeight - radius);
            ctx.quadraticCurveTo(x + panelWidth, y + panelHeight, x + panelWidth - radius, y + panelHeight);
            ctx.lineTo(x + radius, y + panelHeight);
            ctx.quadraticCurveTo(x, y + panelHeight, x, y + panelHeight - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        };
    
        const leftX = margin;
        const leftY = (canvas.height - panelHeight) / 2;
        const rightX = leftX + panelWidth + margin;
        const rightY = leftY;
        drawPanel(leftX, leftY);
        drawPanel(rightX, rightY);
    
        // Load both photos and draw them side-by-side
        const img1 = new Image();
        const img2 = new Image();
        let imagesLoaded = 0;
        const onImageLoad = function() {
            imagesLoaded++;
            if (imagesLoaded === 2) {
                const innerMargin = 20;
                ctx.save();
                ctx.beginPath();
                ctx.rect(leftX + innerMargin, leftY + innerMargin, panelWidth - innerMargin * 2, panelHeight - innerMargin * 2);
                ctx.clip();
                ctx.drawImage(img1, leftX + innerMargin, leftY + innerMargin, panelWidth - innerMargin * 2, panelHeight - innerMargin * 2);
                ctx.restore();
    
                ctx.save();
                ctx.beginPath();
                ctx.rect(rightX + innerMargin, rightY + innerMargin, panelWidth - innerMargin * 2, panelHeight - innerMargin * 2);
                ctx.clip();
                ctx.drawImage(img2, rightX + innerMargin, rightY + innerMargin, panelWidth - innerMargin * 2, panelHeight - innerMargin * 2);
                ctx.restore();
    
                ctx.fillStyle = "#ffffff";
                ctx.font = "30px Roboto";
                ctx.textAlign = "center";
                ctx.fillText(`Date: ${photo1.date || "N/A"}`, leftX + panelWidth/2, leftY + panelHeight + 40);
                ctx.fillText(`Date: ${photo2.date || "N/A"}`, rightX + panelWidth/2, rightY + panelHeight + 40);
    
                ctx.font = "50px Roboto";
                ctx.fillStyle = "#00aced";
                ctx.textAlign = "center";
                ctx.fillText("Photo Comparison Export", canvas.width / 2, 60);
    
                ExportModule.exportCanvas = canvas;
                const overlayPreview = document.getElementById('overlay-preview');
                overlayPreview.innerHTML = "";
                overlayPreview.appendChild(canvas);
                ExportModule.addOverlayControls();
                overlayPreview.style.display = "block";
                console.log("Photo comparison export prepared with modern styling.");
            }
        };
        img1.onload = onImageLoad;
        img2.onload = onImageLoad;
        img1.onerror = function() { console.error("Failed to load photo 1 for export."); };
        img2.onerror = function() { console.error("Failed to load photo 2 for export."); };
        img1.src = photo1.dataUrl || photo1.src || "";
        img2.src = photo2.dataUrl || photo2.src || "";
    },
    prepareCustomProgressExport: function() {
        const overlayPreview = document.getElementById('overlay-preview');
        const startDateInput = document.getElementById('export-start-date');
        const endDateInput = document.getElementById('export-end-date');
        const startDateStr = startDateInput.value;
        const endDateStr = endDateInput.value;
        if (!startDateStr || !endDateStr) {
            alert("Please select both start and end dates.");
            return;
        }
        const startDate = new Date(startDateStr);
        const endDate = new Date(endDateStr);
        if (startDate > endDate) {
            alert("Start date must be before end date.");
            return;
        }
        const logs = DataPersistenceModule.getWeightLogs().filter(log => {
            const logDate = new Date(log.date);
            return logDate >= startDate && logDate <= endDate;
        });
        if (logs.length === 0) {
            alert("No weight logs found for the selected date range.");
            return;
        }
        let minWeight = Number.MAX_VALUE, maxWeight = Number.MIN_VALUE;
        logs.forEach(log => {
            const weight = log.weight;
            if (weight < minWeight) minWeight = weight;
            if (weight > maxWeight) maxWeight = weight;
        });
        const canvas = document.createElement('canvas');
        canvas.width = 1200;
        canvas.height = 800;
        const ctx = canvas.getContext('2d');
    
        const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        bgGradient.addColorStop(0, "#0d0d0d");
        bgGradient.addColorStop(1, "#333333");
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    
        // Header Section with bottom border
        ctx.fillStyle = "#00aced";
        ctx.fillRect(0, 0, canvas.width, 100);
        ctx.strokeStyle = "#007bb5";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 100);
        ctx.lineTo(canvas.width, 100);
        ctx.stroke();
        ctx.font = "bold 50px Roboto";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.fillText("Custom Progress Export", canvas.width / 2, 65);
    
        // Footer Section with top border
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, canvas.height - 50, canvas.width, 50);
        ctx.strokeStyle = "#333";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height - 50);
        ctx.lineTo(canvas.width, canvas.height - 50);
        ctx.stroke();
        ctx.font = "bold 30px Roboto";
        ctx.fillStyle = "#ffffff";
        ctx.fillText("Keep pushing your limits!", canvas.width / 2, canvas.height - 15);
    
        // Chart Frame (Rounded)
        const chartFrameX = 90, chartFrameY = 120, chartFrameW = canvas.width - 180, chartFrameH = canvas.height - 240;
        ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
        ctx.strokeStyle = "rgba(255,255,255,0.2)";
        ctx.lineWidth = 3;
        ExportModule.drawRoundedRect(ctx, chartFrameX, chartFrameY, chartFrameW, chartFrameH, 15, true, true);
    
        // Chart Area inside frame
        const chartX = chartFrameX + 10, chartY = chartFrameY + 10;
        const chartWidth = chartFrameW - 20, chartHeight = chartFrameH - 20;
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(chartX, chartY + chartHeight);
        ctx.lineTo(chartX, chartY);
        ctx.lineTo(chartX + chartWidth, chartY);
        ctx.stroke();
    
        const startDateTime = startDate.getTime();
        const endDateTime = endDate.getTime();
        const timeSpan = endDateTime - startDateTime;
        const weightSpan = maxWeight - minWeight || 1;
        ctx.strokeStyle = "#00aced";
        ctx.lineWidth = 4;
        ctx.beginPath();
        logs.forEach((log, index) => {
            const logDate = new Date(log.date);
            const x = chartX + ((logDate.getTime() - startDateTime) / timeSpan) * chartWidth;
            const y = chartY + chartHeight - ((log.weight - minWeight) / weightSpan) * chartHeight;
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();
    
        ctx.fillStyle = "#ffffff";
        logs.forEach(log => {
            const logDate = new Date(log.date);
            const x = chartX + ((logDate.getTime() - startDateTime) / timeSpan) * chartWidth;
            const y = chartY + chartHeight - ((log.weight - minWeight) / weightSpan) * chartHeight;
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fill();
        });
    
        // Summary Box with rounded corners
        ExportModule.drawRoundedRect(ctx, 50, 110, 300, 150, 10, true, false);
        ctx.fillStyle = "#00aced";
        ctx.font = "bold 30px Roboto";
        ctx.textAlign = "left";
        ctx.fillText(`Min: ${minWeight} lbs`, 60, 150);
        ctx.fillText(`Max: ${maxWeight} lbs`, 60, 190);
        ctx.fillText(`Avg: ${(logs.reduce((acc, log) => acc + log.weight, 0) / logs.length).toFixed(1)} lbs`, 60, 230);
        ctx.fillText(`Change: ${weightChange > 0 ? "+" : ""}${weightChange} lbs`, 60, 270);
    
        ExportModule.exportCanvas = canvas;
        const overlayPreview = document.getElementById('overlay-preview');
        overlayPreview.innerHTML = "";
        overlayPreview.appendChild(canvas);
        ExportModule.addOverlayControls();
        overlayPreview.style.display = "block";
        console.log("Custom progress export prepared with modern styling.");
    },
    // Helper function to draw rounded rectangles
    drawRoundedRect: function(ctx, x, y, width, height, radius, fill, stroke) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        if (fill) ctx.fill();
        if (stroke) ctx.stroke();
    },
    prepareCustomProgressExport: function() {
        const overlayPreview = document.getElementById('overlay-preview');
        const startDateInput = document.getElementById('export-start-date');
        const endDateInput = document.getElementById('export-end-date');
        const startDateStr = startDateInput.value;
        const endDateStr = endDateInput.value;
        if (!startDateStr || !endDateStr) {
            alert("Please select both start and end dates.");
            return;
        }
        const startDate = new Date(startDateStr);
        const endDate = new Date(endDateStr);
        if (startDate > endDate) {
            alert("Start date must be before end date.");
            return;
        }
        const logs = DataPersistenceModule.getWeightLogs().filter(log => {
            const logDate = new Date(log.date);
            return logDate >= startDate && logDate <= endDate;
        });
        if (logs.length === 0) {
            alert("No weight logs found for the selected date range.");
            return;
        }
        let minWeight = Number.MAX_VALUE, maxWeight = Number.MIN_VALUE;
        logs.forEach(log => {
            const weight = log.weight;
            if (weight < minWeight) minWeight = weight;
            if (weight > maxWeight) maxWeight = weight;
        });
        const canvas = document.createElement('canvas');
        canvas.width = 1200;
        canvas.height = 800;
        const ctx = canvas.getContext('2d');
    
        const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        bgGradient.addColorStop(0, "#0d0d0d");
        bgGradient.addColorStop(1, "#333333");
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    
        // Header section
        ctx.fillStyle = "#00aced";
        ctx.fillRect(0, 0, canvas.width, 100);
        ctx.font = "bold 50px Roboto";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.fillText("Custom Progress Export", canvas.width / 2, 65);
    
        // Footer section
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, canvas.height - 50, canvas.width, 50);
        ctx.font = "bold 30px Roboto";
        ctx.fillStyle = "#ffffff";
        ctx.fillText("Keep pushing your limits!", canvas.width / 2, canvas.height - 15);
    
        // Chart Frame (Rounded)
        const chartFrameX = 90, chartFrameY = 120, chartFrameW = canvas.width - 180, chartFrameH = canvas.height - 240;
        ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
        ctx.strokeStyle = "rgba(255,255,255,0.2)";
        ctx.lineWidth = 3;
        ExportModule.drawRoundedRect(ctx, chartFrameX, chartFrameY, chartFrameW, chartFrameH, 15, true, true);
    
        // Chart Area inside frame
        const chartX = chartFrameX + 10, chartY = chartFrameY + 10;
        const chartWidth = chartFrameW - 20, chartHeight = chartFrameH - 20;
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(chartX, chartY + chartHeight);
        ctx.lineTo(chartX, chartY);
        ctx.lineTo(chartX + chartWidth, chartY);
        ctx.stroke();
    
        const startDateTime = startDate.getTime();
        const endDateTime = endDate.getTime();
        const timeSpan = endDateTime - startDateTime;
        const weightSpan = maxWeight - minWeight || 1;
        ctx.strokeStyle = "#00aced";
        ctx.lineWidth = 4;
        ctx.beginPath();
        logs.forEach((log, index) => {
            const logDate = new Date(log.date);
            const x = chartX + ((logDate.getTime() - startDateTime) / timeSpan) * chartWidth;
            const y = chartY + chartHeight - ((log.weight - minWeight) / weightSpan) * chartHeight;
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();
    
        ctx.fillStyle = "#ffffff";
        logs.forEach(log => {
            const logDate = new Date(log.date);
            const x = chartX + ((logDate.getTime() - startDateTime) / timeSpan) * chartWidth;
            const y = chartY + chartHeight - ((log.weight - minWeight) / weightSpan) * chartHeight;
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fill();
        });
    
        // Summary Box with rounded corners
        ExportModule.drawRoundedRect(ctx, 50, 110, 300, 150, 10, true, false);
        ctx.fillStyle = "#00aced";
        ctx.font = "bold 30px Roboto";
        ctx.textAlign = "left";
        ctx.fillText(`Min: ${minWeight} lbs`, 60, 150);
        ctx.fillText(`Max: ${maxWeight} lbs`, 60, 190);
        ctx.fillText(`Avg: ${(logs.reduce((acc, log) => acc + log.weight, 0) / logs.length).toFixed(1)} lbs`, 60, 230);
        ctx.fillText(`Change: ${weightChange > 0 ? "+" : ""}${weightChange} lbs`, 60, 270);
    
        ExportModule.exportCanvas = canvas;
        const overlayPreview = document.getElementById('overlay-preview');
        overlayPreview.innerHTML = "";
        overlayPreview.appendChild(canvas);
        ExportModule.addOverlayControls();
        overlayPreview.style.display = "block";
        console.log("Custom progress export prepared with modern styling.");
    }
};

/* =========================
   Photo Overlay Module (Dummy)
   ========================= */
const PhotoOverlayModule = {
    init: function() {
        console.log("PhotoOverlayModule loaded (dummy implementation).");
    }
};

/* =========================
   Streak Tracker Module (Dummy)
   ========================= */
const StreakTrackerModule = {
    init: function() {
        console.log("StreakTrackerModule loaded (dummy implementation).");
    }
};

/* =========================
   User Profile Module (Dummy)
   ========================= */
const UserProfileModule = {
    init: function() {
        console.log("UserProfileModule loaded (dummy implementation).");
    }
};

/* =========================
   Community Engagement Module (Dummy)
   ========================= */
const CommunityEngagementModule = {
    init: function() {
        console.log("CommunityEngagementModule loaded (dummy implementation).");
    }
};

/* =========================
   Dark Mode Module (Dummy)
   ========================= */
const DarkModeModule = {
    init: function() {
        console.log("DarkModeModule loaded (dummy implementation).");
    }
};

/* =========================
   CSV Export Module (Dummy)
   ========================= */
const CsvExportModule = {
    init: function() {
        console.log("CsvExportModule loaded (dummy implementation).");
    }
};
