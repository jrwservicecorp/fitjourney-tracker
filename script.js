
const appVersion = "v7.45-beta";

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

// ... (Other modules like ChartModule, WeightLoggingModule, PhotoUploadModule, PhotoComparisonModule, ExportModule)

window.addEventListener("DOMContentLoaded", GeneralModule.init);
