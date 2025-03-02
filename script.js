// FitJourney Tracker - JS v1.3.0

document.addEventListener("DOMContentLoaded", function() {
    // Set App Version
    const appVersion = "v1.3.0";
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
        }
    });
    clearFilterBtn.addEventListener("click", function() {
        document.getElementById("filter-start-date").value = "";
        document.getElementById("filter-end-date").value = "";
        updateGallery();
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

    /****************************************
     * JuxtaposeJS & TwentyTwenty Comparison *
     ****************************************/
    // For JuxtaposeJS comparison:
    const juxtaBeforeSelect = document.getElementById("juxta-before");
    const juxtaAfterSelect = document.getElementById("juxta-after");
    const juxtaUpdateBtn = document.getElementById("juxta-update");
    const juxtaposeContainer = document.getElementById("juxtapose-container");

    juxtaUpdateBtn.addEventListener("click", function() {
        // For simplicity, pick first two photos if selectors are empty
        const idx1 = parseInt(juxtaBeforeSelect.value) || 0;
        const idx2 = parseInt(juxtaAfterSelect.value) || 1;
        const src1 = photos[idx1] ? photos[idx1].src : "https://placehold.co/300x400?text=Before";
        const src2 = photos[idx2] ? photos[idx2].src : "https://placehold.co/300x400?text=After";
        juxtaposeContainer.innerHTML = "";
        new juxtapose.JXSlider("#juxtapose-container", [
            { src: src1, label: "Before" },
            { src: src2, label: "After" }
        ], { showLabels: false, startingPosition: "50%" });
    });

    // For TwentyTwenty comparison:
    const ttBeforeSelect = document.getElementById("tt-before");
    const ttAfterSelect = document.getElementById("tt-after");
    const ttUpdateBtn = document.getElementById("tt-update");
    const ttContainer = document.getElementById("twentytwenty-container");

    ttUpdateBtn.addEventListener("click", function() {
        const idx1 = parseInt(ttBeforeSelect.value) || 0;
        const idx2 = parseInt(ttAfterSelect.value) || 1;
        const src1 = photos[idx1] ? photos[idx1].src : "https://placehold.co/300x400?text=Before";
        const src2 = photos[idx2] ? photos[idx2].src : "https://placehold.co/300x400?text=After";
        ttContainer.innerHTML = `<img src="${src1}" alt="Before"><img src="${src2}" alt="After">`;
        $(ttContainer).twentytwenty({ default_offset_pct: 0.5, orientation: 'horizontal' });
    });

    // Export functions for JuxtaposeJS and TwentyTwenty comparisons (using html2canvas)
    const exportJuxtaBtn = document.getElementById("export-juxtapose-btn");
    exportJuxtaBtn.addEventListener("click", function() {
        html2canvas(juxtaposeContainer).then(function(canvas) {
            const link = document.createElement("a");
            link.download = "juxtapose_comparison.png";
            link.href = canvas.toDataURL();
            link.click();
        });
    });

    const exportTTBtn = document.getElementById("export-twentytwenty-btn");
    exportTTBtn.addEventListener("click", function() {
        html2canvas(ttContainer).then(function(canvas) {
            const link = document.createElement("a");
            link.download = "twentytwenty_comparison.png";
            link.href = canvas.toDataURL();
            link.click();
        });
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
        html2canvas(container).then(function(canvas) {
            // Create a new canvas for Instagram export (1080x1080)
            const instaCanvas = document.createElement("canvas");
            instaCanvas.width = 1080;
            instaCanvas.height = 1080;
            const ctx = instaCanvas.getContext("2d");

            // Calculate centered square crop from captured canvas
            const cw = canvas.width;
            const ch = canvas.height;
            const squareSize = Math.min(cw, ch);
            const sx = (cw - squareSize) / 2;
            const sy = (ch - squareSize) / 2;
            ctx.drawImage(canvas, sx, sy, squareSize, squareSize, 0, 0, 1080, 1080);

            // Add branding overlay
            ctx.font = "bold 36px Roboto";
            ctx.fillStyle = "rgba(255,255,255,0.8)";
            ctx.textAlign = "right";
            ctx.fillText("FitJourney Tracker", 1070, 1060);

            const link = document.createElement("a");
            link.download = fileName;
            link.href = instaCanvas.toDataURL();
            link.click();
        });
    }

    /***************************************
     * Fabric.js WYSIWYG Editor (New Module) *
     ***************************************/
    // This editor is for customizing the comparison image with stickers.
    // It uses a dedicated canvas with id "editor-canvas"
    const editorCanvasEl = document.getElementById("editor-canvas");
    const editorToolbar = document.getElementById("editor-toolbar");
    let editorCanvas; // Fabric canvas instance for editor

    // Initialize editor canvas and load current comparison image from Juxtapose slider
    function initEditor() {
        // For simplicity, we use the Juxtapose slider’s image as the base.
        // In a real implementation, you might allow the user to choose which comparison image to edit.
        if (!editorCanvas) {
            editorCanvas = new fabric.Canvas("editor-canvas", {
                backgroundColor: "#000"
            });
        } else {
            editorCanvas.clear();
        }
        // Optionally, load a snapshot of the current comparison container into the editor.
        html2canvas(document.getElementById("comparison-container")).then(function(canvasSnapshot) {
            fabric.Image.fromURL(canvasSnapshot.toDataURL(), function(img) {
                // Scale the image to fill the editor canvas
                img.set({ left: 0, top: 0, selectable: false });
                img.scaleToWidth(editorCanvas.width);
                editorCanvas.add(img);
                editorCanvas.sendToBack(img);
            });
        });
    }

    // Add a sticker to the editor canvas
    function addEditorSticker(text) {
        if (!editorCanvas) return;
        const rect = new fabric.Rect({
            width: 150,
            height: 50,
            fill: "rgba(0,0,0,0.7)",
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

    // Export the editor canvas as an Instagram-ready 1080x1080 image
    function exportEditorImage() {
        // Ensure editor canvas is rendered fully
        editorCanvas.discardActiveObject();
        editorCanvas.renderAll();
        // Create an off-screen canvas for export at 1080x1080
        const instaCanvas = document.createElement("canvas");
        instaCanvas.width = 1080;
        instaCanvas.height = 1080;
        const ctx = instaCanvas.getContext("2d");
        // Draw the editor canvas (assumed to be 1080x1080 or scale accordingly)
        ctx.drawImage(editorCanvas.lowerCanvasEl, 0, 0, 1080, 1080);
        // Add branding text overlay
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

    // Initialize the editor when the user clicks to customize
    // For example, you could add a button "Customize Comparison" that calls initEditor()
    // Here, we automatically initialize the editor when the Juxtapose slider is updated.
    // (In practice, you may want this to be a separate user action.)
    document.getElementById("juxta-update").addEventListener("click", function() {
        // Delay to ensure the slider has rendered
        setTimeout(initEditor, 1000);
    });
});
