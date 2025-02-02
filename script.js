// FitJourney Tracker - Version v8.3a

console.log("FitJourney Tracker v8.3 initializing...");

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
            prepareExportBtn: document.getElementById('prepare-export-btn'),
            exportStartDate: document.getElementById('export-start-date'),
            exportEndDate: document.getElementById('export-end-date')
        };

        for (const [key, value] of Object.entries(requiredElements)) {
            if (!value) {
                console.warn(`Warning: Element with ID '${key}' is missing!`);
            }
        }

        if (requiredElements.versionDisplay) {
            requiredElements.versionDisplay.innerText = "v8.3";
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

        console.log("All modules initialized successfully in FitJourney Tracker v8.3.");
    } catch (error) {
        console.error("Error initializing modules:", error);
    }
};

/* -------------------------------
   Data Persistence Module
   ------------------------------- */
const DataPersistenceModule = {
    MAX_PHOTOS: 20,
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

/* -------------------------------
   Photo Upload Module
   ------------------------------- */
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

/* -------------------------------
   Photo Comparison Module
   ------------------------------- */
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

/* -------------------------------
   Export Module
   ------------------------------- */
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
            const exportType = document.querySelector('input[name="export-type"]:checked').value;
            if (exportType === "single-photo") {
                ExportModule.prepareSinglePhotoExport();
            } else if (exportType === "photo-comparison") {
                ExportModule.preparePhotoComparisonExport();
            } else if (exportType === "data-only") {
                overlayPreview.innerHTML = "Data Only export not implemented yet.";
                overlayPreview.style.display = "block";
            } else if (exportType === "custom-progress") {
                ExportModule.prepareCustomProgressExport();
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
    
        const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        bgGradient.addColorStop(0, "#1a1a1a");
        bgGradient.addColorStop(1, "#333333");
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    
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
    
            ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
            ctx.fillRect(100, 630, 1000, 100);
    
            ctx.fillStyle = "#ffffff";
            ctx.font = "40px Helvetica, Arial, sans-serif";
            ctx.textAlign = "left";
            ctx.fillText(`Latest Weight: ${latestWeight} lbs`, 120, 680);
            ctx.fillText(`Date: ${latestDate}`, 120, 730);
    
            ctx.font = "50px Helvetica, Arial, sans-serif";
            ctx.fillStyle = "#00aced";
            ctx.textAlign = "center";
            ctx.fillText("My Progress", canvas.width / 2, 70);
    
            ExportModule.exportCanvas = canvas;
            const overlayPreview = document.getElementById('overlay-preview');
            overlayPreview.innerHTML = "";
            overlayPreview.appendChild(canvas);
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
    
        const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        bgGradient.addColorStop(0, "#222222");
        bgGradient.addColorStop(1, "#444444");
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    
        const margin = 25;
        const panelWidth = 650;
        const panelHeight = 650;
    
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
                ctx.font = "30px Helvetica, Arial, sans-serif";
                ctx.textAlign = "center";
                ctx.fillText(`Date: ${photo1.date || "N/A"}`, leftX + panelWidth/2, leftY + panelHeight + 40);
                ctx.fillText(`Date: ${photo2.date || "N/A"}`, rightX + panelWidth/2, rightY + panelHeight + 40);
    
                ctx.font = "50px Helvetica, Arial, sans-serif";
                ctx.fillStyle = "#00aced";
                ctx.textAlign = "center";
                ctx.fillText("Photo Comparison Export", canvas.width / 2, 60);
    
                ExportModule.exportCanvas = canvas;
                overlayPreview.innerHTML = "";
                overlayPreview.appendChild(canvas);
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
        const chartMargin = 100;
        const chartWidth = canvas.width - chartMargin * 2;
        const chartHeight = canvas.height - chartMargin * 2;
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(chartMargin, chartMargin);
        ctx.lineTo(chartMargin, canvas.height - chartMargin);
        ctx.moveTo(chartMargin, canvas.height - chartMargin);
        ctx.lineTo(canvas.width - chartMargin, canvas.height - chartMargin);
        ctx.stroke();
        const timeSpan = endDate.getTime() - startDate.getTime();
        const weightSpan = maxWeight - minWeight;
        ctx.strokeStyle = "#00aced";
        ctx.lineWidth = 4;
        ctx.beginPath();
        logs.forEach((log, index) => {
            const logDate = new Date(log.date);
            const x = chartMargin + ((logDate.getTime() - startDate.getTime()) / timeSpan) * chartWidth;
            const y = canvas.height - chartMargin - ((log.weight - minWeight) / weightSpan) * chartHeight;
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
            const x = chartMargin + ((logDate.getTime() - startDate.getTime()) / timeSpan) * chartWidth;
            const y = canvas.height - chartMargin - ((log.weight - minWeight) / weightSpan) * chartHeight;
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(50, 50, 500, 100);
        ctx.fillStyle = "#00aced";
        ctx.font = "40px Helvetica, Arial, sans-serif";
        ctx.textAlign = "left";
        const weightChange = logs[logs.length - 1].weight - logs[0].weight;
        ctx.fillText(`Progress from ${startDateStr} to ${endDateStr}:`, 70, 90);
        ctx.fillText(`Change: ${weightChange > 0 ? "+" : ""}${weightChange} lbs`, 70, 140);
        ctx.font = "60px Helvetica, Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.fillStyle = "#ffffff";
        ctx.fillText("Custom Progress Export", canvas.width / 2, 80);
        ExportModule.exportCanvas = canvas;
        overlayPreview.innerHTML = "";
        overlayPreview.appendChild(canvas);
        overlayPreview.style.display = "block";
        console.log("Custom progress export prepared with modern styling.");
    }
};

/* -------------------------------
   Photo Overlay Module (Dummy)
   ------------------------------- */
const PhotoOverlayModule = {
    init: function() {
        console.log("PhotoOverlayModule loaded (dummy implementation).");
    }
};

/* -------------------------------
   Streak Tracker Module (Dummy)
   ------------------------------- */
const StreakTrackerModule = {
    init: function() {
        console.log("StreakTrackerModule loaded (dummy implementation).");
    }
};

/* -------------------------------
   User Profile Module (Dummy)
   ------------------------------- */
const UserProfileModule = {
    init: function() {
        console.log("UserProfileModule loaded (dummy implementation).");
    }
};

/* -------------------------------
   Community Engagement Module (Dummy)
   ------------------------------- */
const CommunityEngagementModule = {
    init: function() {
        console.log("CommunityEngagementModule loaded (dummy implementation).");
    }
};

/* -------------------------------
   Dark Mode Module (Dummy)
   ------------------------------- */
const DarkModeModule = {
    init: function() {
        console.log("DarkModeModule loaded (dummy implementation).");
    }
};

/* -------------------------------
   CSV Export Module (Dummy)
   ------------------------------- */
const CsvExportModule = {
    init: function() {
        console.log("CsvExportModule loaded (dummy implementation).");
    }
};
