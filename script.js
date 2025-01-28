
const appVersion = "v7.43-beta";

// Declare global variables
let chartInstance = null;

/* ================================
    General Functionality
================================ */
const GeneralModule = {
  init: function () {
    console.log("Document fully loaded. Initializing FitJourney Tracker...");
    document.getElementById("app-version").textContent = appVersion;

    try {
      ChartModule.init();
      console.log("Chart setup completed.");
    } catch (err) {
      console.error("Chart setup failed:", err);
    }

    try {
      WeightLoggingModule.init();
      console.log("Weight logging setup completed.");
    } catch (err) {
      console.error("Weight logging setup failed:", err);
    }

    try {
      PhotoUploadModule.init();
      console.log("Photo upload setup completed.");
    } catch (err) {
      console.error("Photo upload setup failed:", err);
    }

    try {
      PhotoComparisonModule.init();
      console.log("Photo comparison setup completed.");
    } catch (err) {
      console.error("Photo comparison setup failed:", err);
    }

    try {
      ExportModule.init();
      console.log("Export setup completed.");
    } catch (err) {
      console.error("Export setup failed:", err);
    }

    try {
      PhotoUploadModule.loadPhotos();
      console.log("Photos loaded successfully.");
    } catch (err) {
      console.error("Photo loading failed:", err);
    }

    const clearPhotosBtn = document.getElementById("clear-photos-btn");
    if (clearPhotosBtn) {
      clearPhotosBtn.addEventListener("click", PhotoUploadModule.clearPhotos);
    } else {
      console.warn("Clear photos button not found.");
    }
  },
};

/* ================================
    Chart Module
================================ */
const ChartModule = {
  init: function () {
    console.log("Initializing Chart Module...");
    const canvas = document.getElementById("weight-chart");
    if (!canvas) {
      console.error("Chart canvas not found!");
      return;
    }

    this.ensureCanvasReady(() => {
      const storedData = JSON.parse(localStorage.getItem("progressData")) || [];
      this.renderChart(demoData, storedData, true);
    });

    const toggleDemoCheckbox = document.getElementById("toggle-demo-data");
    if (toggleDemoCheckbox) {
      toggleDemoCheckbox.addEventListener("change", () => {
        const showDemo = toggleDemoCheckbox.checked;
        const progressData = JSON.parse(localStorage.getItem("progressData")) || [];
        this.renderChart(demoData, progressData, showDemo);
      });
    } else {
      console.warn("Demo data toggle checkbox not found.");
    }
  },

  ensureCanvasReady: function (callback) {
    console.log("Ensuring canvas is ready...");
    const canvas = document.getElementById("weight-chart");
    if (!canvas) return;

    const interval = setInterval(() => {
      if (canvas.getContext("2d")) {
        clearInterval(interval);
        callback();
      }
    }, 50);
  },

  renderChart: function (demoData, userData, showDemo) {
    console.log("Rendering chart...");
    const ctx = document.getElementById("weight-chart")?.getContext("2d");
    if (!ctx) {
      console.error("Chart context not found.");
      return;
    }

    if (chartInstance) chartInstance.destroy();

    const datasets = [];
    if (showDemo) {
      datasets.push({
        label: "Demo Data",
        data: demoData.map((d) => d.weight),
        borderColor: "#e91e63",
        backgroundColor: "rgba(233, 30, 99, 0.2)",
      });
    }
    datasets.push({
      label: "User Data",
      data: userData.map((u) => u.weight),
      borderColor: "#3498db",
      backgroundColor: "rgba(52, 152, 219, 0.2)",
    });

    chartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels: [...demoData.map((d) => d.date), ...userData.map((u) => u.date)],
        datasets,
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
          },
        },
      },
    });
  },
};

/* ================================
    Photo Comparison Module
================================ */
const PhotoComparisonModule = {
  init: function () {
    console.log("Initializing Photo Comparison Module...");
    const compareButton = document.getElementById("compare-photos-btn");
    if (!compareButton) {
      console.error("Photo comparison button not found!");
      return;
    }

    compareButton.addEventListener("click", () => {
      console.log("Photo comparison button clicked.");

      const photo1 = document.getElementById("photo-select-1").value;
      const photo2 = document.getElementById("photo-select-2").value;

      if (!photo1 || !photo2) {
        alert("Please select two photos for comparison.");
        console.warn("Photo comparison failed: One or both photos not selected.");
        return;
      }

      const comparisonContainer = document.getElementById("comparison-container");
      if (!comparisonContainer) {
        console.error("Comparison container not found!");
        return;
      }

      comparisonContainer.innerHTML = `
        <div class="comparison-photo">
          <img src="${photo1}" alt="Photo 1">
          <p>Photo 1</p>
        </div>
        <div class="comparison-photo">
          <img src="${photo2}" alt="Photo 2">
          <p>Photo 2</p>
        </div>
      `;
      console.log("Photo comparison rendered successfully.");
    });
  },
};

/* ================================
    Export Module
================================ */
const ExportModule = {
  init: function () {
    console.log("Initializing Export Module...");
    const prepareExportButton = document.getElementById("prepare-export-btn");
    if (!prepareExportButton) {
      console.error("Prepare export button not found!");
      return;
    }

    prepareExportButton.addEventListener("click", () => {
      console.log("Prepare export button clicked.");
      const exportType = document.querySelector('input[name="export-type"]:checked')?.value;
      if (!exportType) {
        alert("Please select an export type.");
        console.warn("Export preparation failed: No export type selected.");
        return;
      }

      switch (exportType) {
        case "single-photo":
          this.exportSinglePhoto();
          break;
        case "photo-comparison":
          this.exportPhotoComparison();
          break;
        case "data-only":
          this.exportDataOnly();
          break;
        default:
          console.error("Unknown export type:", exportType);
      }
    });
  },

  exportSinglePhoto: function () {
    console.log("Exporting single photo...");
    const selectedPhoto = PhotoUploadModule.getSelectedPhoto();
    if (!selectedPhoto) {
      alert("Please select a photo to export.");
      console.warn("Single photo export failed: No photo selected.");
      return;
    }

    const exportCanvas = document.getElementById("export-canvas");
    const ctx = exportCanvas.getContext("2d");

    const img = new Image();
    img.src = selectedPhoto.src;
    img.onload = () => {
      exportCanvas.width = img.width;
      exportCanvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      console.log("Single photo export prepared successfully.");
    };
  },

  exportPhotoComparison: function () {
    console.log("Exporting photo comparison...");
  },

  exportDataOnly: function () {
    console.log("Exporting data only...");
  },
};

// Initialize the application
window.addEventListener("DOMContentLoaded", GeneralModule.init);
