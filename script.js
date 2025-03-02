// FitJourney Tracker - JS v1.4.1

document.addEventListener("DOMContentLoaded", function() {
    // Set App Version
    const appVersion = "v1.4.1";
    document.getElementById("app-version").textContent = appVersion;

    /***********************
     * Chart Functionality *
     ***********************/
    const ctx = document.getElementById("weightChart").getContext("2d");
    let weightChart;
    let demoData = {
        labels: ["Jan", "Feb", "Mar", "Apr"],
        datasets: [{
            label: "Weight",
            data: [200, 195, 190, 185],
            borderColor: "rgba(75, 192, 192, 1)",
            fill: false
        }]
    };

    function initChart(data) {
        if (weightChart) weightChart.destroy();
        weightChart = new Chart(ctx, {
            type: "line",
            data: data,
            options: { responsive: true, maintainAspectRatio: false }
        });
    }

    const toggleDemoData = document.getElementById("toggle-demo-data");
    toggleDemoData.addEventListener("change", function() {
        if (this.checked) {
            initChart(demoData);
            document.getElementById("chart-placeholder").style.display = "none";
        } else {
            if (weightChart) weightChart.destroy();
            document.getElementById("chart-placeholder").style.display = "block";
        }
    });
    if (toggleDemoData.checked) initChart(demoData);

    /*******************************
     * Weight Logging Functionality *
     *******************************/
    const weightForm = document.getElementById("weight-form");
    const recentWeighinsContainer = document.getElementById("recent-weighins");
    const weightSummaryContainer = document.getElementById("weight-summary");
    let weighIns = [];

    weightForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const weightInput = document.getElementById("weight-input");
        const dateInput = document.getElementById("date-input");
        const weight = parseFloat(weightInput.value);
        const date = dateInput.value;
        if (!isNaN(weight) && date) {
            weighIns.push({ weight: weight, date: date });
            updateWeighIns();
            demoData.labels.push(date);
            demoData.datasets[0].data.push(weight);
            if (toggleDemoData.checked) initChart(demoData);
            weightInput.value = "";
            dateInput.value = "";
        }
    });

    function updateWeighIns() {
        recentWeighinsContainer.innerHTML = "";
        if (weighIns.length === 0) {
            recentWeighinsContainer.innerHTML = "<p class='placeholder'>No weigh-ins recorded yet.</p>";
        } else {
            weighIns.slice(-5).forEach(item => {
                const p = document.createElement("p");
                p.textContent = `Weight: ${item.weight} lbs on ${item.date}`;
                recentWeighinsContainer.appendChild(p);
            });
            const total = weighIns.reduce((acc, item) => acc + item.weight, 0);
            const avg = (total / weighIns.length).toFixed(1);
            weightSummaryContainer.innerHTML = `<p>Average Weight: ${avg} lbs</p>`;
        }
    }

    /*******************************
     * Photo Upload & Gallery      *
     *******************************/
    const photoUploadForm = document.getElementById("photo-upload-form");
    const photoGallery = document.getElementById("photo-gallery");
    let photos = [];

    photoUploadForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const photoInput = document.getElementById("photo-upload");
        const photoDateInput = document.getElementById("photo-date");
        if (photoInput.files && photoInput.files[0]) {
            const file = photoInput.files[0];
            const reader = new FileReader();
            reader.onload = function(event) {
                photos.push({ src: event.target.result, date: photoDateInput.value });
                updateGallery();
                updatePhotoSelectors();
            };
            reader.readAsDataURL(file);
            photoUploadForm.reset();
        }
    });

    function updateGallery() {
        photoGallery.innerHTML = "";
        if (photos.length === 0) {
            photoGallery.innerHTML = "<p class='placeholder'>No photos uploaded yet.</p>";
        } else {
            photos.forEach((photo, index) => {
                const img = document.createElement("img");
                img.src = photo.src;
                img.alt = `Progress Photo ${index + 1}`;
                img.addEventListener("click", function() {
                    alert(`Photo taken on: ${photo.date}`);
                });
                photoGallery.appendChild(img);
            });
        }
    }

    /**************************************
     * Filter Gallery by Date Range       *
     **************************************/
    const filterPhotosBtn = document.getElementById("filter-photos-btn");
    const clearFilterBtn = document.getElementById("clear-filter-btn");
    filterPhotosBtn.addEventListener("click", function() {
        const startDate = document.getElementById("filter-start-date").value;
        const endDate = document.getElementById("filter-end-date").value;
        if (startDate && endDate) {
            const filtered = photos.filter(photo => photo.date >= startDate && photo.date <= endDate);
            updateGalleryFiltered(filtered);
            updatePhotoSelectors(filtered);
        }
    });
    clearFilterBtn.addEventListener("click", function() {
        document.getElementById("filter-start-date").value = "";
        document.getElementById("filter-end-date").value = "";
        updateGallery();
        updatePhotoSelectors();
    });

    function updateGalleryFiltered(filteredPhotos) {
        photoGallery.innerHTML = "";
        if (filteredPhotos.length === 0) {
            photoGallery.innerHTML = "<p class='placeholder'>No photos in this date range.</p>";
        } else {
            filteredPhotos.forEach((photo, index) => {
                const img = document.createElement("img");
                img.src = photo.src;
                img.alt = `Progress Photo ${index + 1}`;
                img.addEventListener("click", function() {
                    alert(`Photo taken on: ${photo.date}`);
                });
                photoGallery.appendChild(img);
            });
        }
    }

    // Update drop-down selectors for JuxtaposeJS and TwentyTwenty
    function updatePhotoSelectors(filteredArray) {
        const arr = filteredArray || photos;
        const selectors = [
            document.getElementById("juxta-before"),
            document.getElementById("juxta-after"),
            document.getElementById("tt-before"),
            document.getElementById("tt-after")
        ];
        selectors.forEach(select => { select.innerHTML = ""; });
        arr.forEach((photo, index) => {
            const optionText = `Photo ${index + 1} (${photo.date || "No Date"})`;
            selectors.forEach(select => {
                const option = document.createElement("option");
                option.value = index;
                option.textContent = optionText;
                select.appendChild(option);
            });
        });
    }
    // Initial update of selectors
    updatePhotoSelectors();

    /****************************************
     * JuxtaposeJS & TwentyTwenty Comparison *
     ****************************************/
    // JuxtaposeJS Comparison
    const juxtaBeforeSelect = document.getElementById("juxta-before");
    const juxtaAfterSelect = document.getElementById("juxta-after");
    const juxtaUpdateBtn = document.getElementById("juxta-update");
    const juxtaposeContainer = document.getElementById("juxtapose-container");

    juxtaUpdateBtn.addEventListener("click", function() {
        const idx1 = parseInt(juxtaBeforeSelect.value) || 0;
        const idx2 = parseInt(juxtaAfterSelect.value) || 1;
        const photo1 = photos[idx1] ? photos[idx1] : { src: "https://placehold.co/300x400?text=Before", date: "" };
        const photo2 = photos[idx2] ? photos[idx2] : { src: "https://placehold.co/300x400?text=After", date: "" };

        // Check aspect ratios
        checkAspectRatio(photo1.src, photo2.src);

        if (!juxtaposeContainer) {
            console.error("Juxtapose container not found!");
            return;
        }
        juxtaposeContainer.innerHTML = "";
        new juxtapose.JXSlider("#juxtapose-container", [
            { src: photo1.src, label: "Before" + (photo1.date ? `: ${photo1.date}` : "") },
            { src: photo2.src, label: "After" + (photo2.date ? `: ${photo2.date}` : "") }
        ], { showLabels: false, startingPosition: "50%", makeResponsive: true });
    });

    // TwentyTwenty Comparison (if plugin is loaded)
    const ttBeforeSelect = document.getElementById("tt-before");
    const ttAfterSelect = document.getElementById("tt-after");
    const ttUpdateBtn = document.getElementById("tt-update");
    const ttContainer = document.getElementById("twentytwenty-container");

    ttUpdateBtn.addEventListener("click", function() {
        const idx1 = parseInt(ttBeforeSelect.value) || 0;
        const idx2 = parseInt(ttAfterSelect.value) || 1;
        const photo1 = photos[idx1] ? photos[idx1] : { src: "https://placehold.co/300x400?text=Before" };
        const photo2 = photos[idx2] ? photos[idx2] : { src: "https://placehold.co/300x400?text=After" };
        ttContainer.innerHTML = `<img src="${photo1.src}" alt="Before"><img src="${photo2.src}" alt="After">`;
        if (typeof $(ttContainer).twentytwenty === "function") {
            $(ttContainer).twentytwenty({ default_offset_pct: 0.5, orientation: 'horizontal' });
        } else {
            console.warn("TwentyTwenty plugin not loaded.");
        }
    });

    // Export functions for comparisons
    const exportJuxtaBtn = document.getElementById("export-juxtapose-btn");
    exportJuxtaBtn.addEventListener("click", function() {
        if (!juxtaposeContainer) return;
        html2canvas(juxtaposeContainer, { useCORS: true }).then(function(canvas) {
            const ctx = canvas.getContext("2d", { willReadFrequently: true });
            const link = document.createElement("a");
            link.download = "juxtapose_comparison.png";
            link.href = canvas.toDataURL();
            link.click();
        }).catch(err => console.error(err));
    });

    const exportTTBtn = document.getElementById("export-twentytwenty-btn");
    exportTTBtn.addEventListener("click", function() {
        if (!ttContainer) return;
        html2canvas(ttContainer, { useCORS: true }).then(function(canvas) {
            const ctx = canvas.getContext("2d", { willReadFrequently: true });
            const link = document.createElement("a");
            link.download = "twentytwenty_comparison.png";
            link.href = canvas.toDataURL();
            link.click();
        }).catch(err => console.error(err));
    });

    const exportInstagramJuxtaBtn = document.getElementById("export-instagram-juxta-btn");
    exportInstagramJuxtaBtn.addEventListener("click", function() {
        exportInstagramImage(juxtaposeContainer, "instagram_juxtapose.png");
    });

    const exportInstagramTTBtn = document.getElementById("export-instagram-tt-btn");
    exportInstagramTTBtn.addEventListener("click", function() {
        exportInstagramImage(ttContainer, "instagram_twentytwenty.png");
    });

    function exportInstagramImage(container, fileName) {
        if (!container) {
            console.error("Invalid element for export.");
            return;
        }
        html2canvas(container, { useCORS: true }).then(function(canvas) {
            const instaCanvas = document.createElement("canvas");
            instaCanvas.width = 1080;
            instaCanvas.height = 1080;
            const ctx = instaCanvas.getContext("2d", { willReadFrequently: true });
            const cw = canvas.width;
            const ch = canvas.height;
            const squareSize = Math.min(cw, ch);
            const sx = (cw - squareSize) / 2;
            const sy = (ch - squareSize) / 2;
            ctx.drawImage(canvas, sx, sy, squareSize, squareSize, 0, 0, 1080, 1080);
            ctx.font = "bold 36px Roboto";
            ctx.fillStyle = "rgba(255,255,255,0.8)";
            ctx.textAlign = "right";
            ctx.fillText("FitJourney Tracker", 1070, 1060);
            const link = document.createElement("a");
            link.download = fileName;
            link.href = instaCanvas.toDataURL();
            link.click();
        }).catch(err => console.error(err));
    }

    // Check that two images have the same aspect ratio
    function checkAspectRatio(src1, src2) {
        const img1 = new Image();
        const img2 = new Image();
        let ratio1, ratio2;
        img1.onload = function() {
            ratio1 = img1.naturalWidth / img1.naturalHeight;
            if (ratio2 !== undefined && Math.abs(ratio1 - ratio2) > 0.01) {
                console.warn("Warning: The two images have different aspect ratios. For best results, use images with the same aspect ratio.");
            }
        };
        img2.onload = function() {
            ratio2 = img2.naturalWidth / img2.naturalHeight;
            if (ratio1 !== undefined && Math.abs(ratio1 - ratio2) > 0.01) {
                console.warn("Warning: The two images have different aspect ratios. For best results, use images with the same aspect ratio.");
            }
        };
        img1.src = src1;
        img2.src = src2;
    }

    /****************************************
     * Fabric.js WYSIWYG Editor (New Module) *
     ****************************************/
    // This module lets the user customize a comparison image with stickers.
    // It uses a dedicated canvas with id "editor-canvas".
    const editorCanvasEl = document.getElementById("editor-canvas");
    const editorToolbar = document.getElementById("editor-toolbar");
    let editorCanvas;

    function initEditor() {
        const baseEl = document.getElementById("juxtapose-container");
        if (!baseEl) {
            console.error("Juxtapose container not found for editor initialization.");
            return;
        }
        if (!editorCanvas) {
            editorCanvas = new fabric.Canvas("editor-canvas", { backgroundColor: "#000" });
        } else {
            editorCanvas.clear();
        }
        html2canvas(baseEl, { useCORS: true }).then(function(snapshot) {
            fabric.Image.fromURL(snapshot.toDataURL(), function(img) {
                img.set({ left: 0, top: 0, selectable: false });
                img.scaleToWidth(editorCanvas.width);
                editorCanvas.add(img);
                editorCanvas.sendToBack(img);
            });
        }).catch(err => console.error("initEditor error:", err));
    }

    function addEditorSticker(text) {
        if (!editorCanvas) return;
        // Create a rectangle with a stroke so it's clearly visible
        const rect = new fabric.Rect({
            width: 150,
            height: 50,
            fill: "rgba(0,0,0,0.7)",
            stroke: "#fff",
            strokeWidth: 2,
            rx: 10,
            ry: 10,
            originX: "center",
            originY: "center"
        });
        const stickerText = new fabric.IText(text, {
            fontSize: 28,
            fill: "#fff",
            fontWeight: "bold",
            originX: "center",
            originY: "center"
        });
        const group = new fabric.Group([rect, stickerText], {
            left: 100,
            top: 100,
            lockRotation: true
        });
        editorCanvas.add(group);
        editorCanvas.setActiveObject(group);
    }

    function exportEditorImage() {
        editorCanvas.discardActiveObject();
        editorCanvas.renderAll();
        const instaCanvas = document.createElement("canvas");
        instaCanvas.width = 1080;
        instaCanvas.height = 1080;
        const ctx = instaCanvas.getContext("2d", { willReadFrequently: true });
        ctx.drawImage(editorCanvas.lowerCanvasEl, 0, 0, 1080, 1080);
        ctx.font = "bold 36px Roboto";
        ctx.fillStyle = "rgba(255,255,255,0.8)";
        ctx.textAlign = "right";
        ctx.fillText("FitJourney Tracker", 1070, 1060);
        const link = document.createElement("a");
        link.download = "instagram_comparison.png";
        link.href = instaCanvas.toDataURL();
        link.click();
    }

    // Editor toolbar event listeners
    document.getElementById("add-before-sticker-btn").addEventListener("click", function() {
        addEditorSticker("Before");
    });
    document.getElementById("add-after-sticker-btn").addEventListener("click", function() {
        addEditorSticker("After");
    });
    document.getElementById("add-timeline-sticker-btn").addEventListener("click", function() {
        addEditorSticker("6 Months");
    });
    document.getElementById("export-editor-btn").addEventListener("click", exportEditorImage);

    // For demo purposes, initialize the editor after updating Juxtapose slider.
    document.getElementById("juxta-update").addEventListener("click", function() {
        setTimeout(initEditor, 1500);
    });
});
