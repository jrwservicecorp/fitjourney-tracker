
const appVersion = "v7.41-beta";

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
    Weight Logging Module
================================ */
const WeightLoggingModule = {
  init: function () {
    console.log("Initializing Weight Logging Module...");
    const weightForm = document.getElementById("weight-form");
    if (!weightForm) {
      console.error("Weight form not found!");
      return;
    }

    weightForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const weight = parseFloat(document.getElementById("weight-input")?.value);
      const date = document.getElementById("date-input")?.value;

      if (!weight || !date) {
        alert("Please enter valid weight and date.");
        return;
      }

      const progressData = JSON.parse(localStorage.getItem("progressData")) || [];
      progressData.push({ weight, date });
      localStorage.setItem("progressData", JSON.stringify(progressData));

      const showDemo = document.getElementById("toggle-demo-data")?.checked;
      ChartModule.renderChart(demoData, progressData, showDemo);
      this.updateSummary(progressData);
      this.updateRecentWeighIns(progressData);

      document.getElementById("weight-input").value = "";
      document.getElementById("date-input").value = "";
    });
  },

  updateSummary: function (progressData) {
    console.log("Updating weight summary...");
    const summaryContainer = document.getElementById("weight-summary");

    if (!progressData.length) {
      summaryContainer.innerHTML = "<p class='placeholder'>No data available for summary.</p>";
      return;
    }

    const weights = progressData.map((entry) => entry.weight);
    const averageWeight = (weights.reduce((sum, w) => sum + w, 0) / weights.length).toFixed(1);
    const maxWeight = Math.max(...weights);
    const minWeight = Math.min(...weights);

    summaryContainer.innerHTML = `
      <p><strong>Average Weight:</strong> ${averageWeight} lbs</p>
      <p><strong>Highest Weight:</strong> ${maxWeight} lbs</p>
      <p><strong>Lowest Weight:</strong> ${minWeight} lbs</p>
    `;
  },

  updateRecentWeighIns: function (progressData) {
    console.log("Updating recent weigh-ins...");
    const recentContainer = document.getElementById("recent-weighins");

    if (!progressData.length) {
      recentContainer.innerHTML = "<p class='placeholder'>No weigh-ins recorded yet.</p>";
      return;
    }

    const recentWeighIns = progressData.slice(-4).reverse();
    recentContainer.innerHTML = recentWeighIns
      .map((entry) => `<p>${entry.date}: ${entry.weight} lbs</p>`)
      .join("");
  },
};

/* ================================
    Photo Upload Module
================================ */
const PhotoUploadModule = {
  init: function () {
    console.log("Initializing Photo Upload Module...");
    const photoForm = document.getElementById("photo-upload-form");
    if (!photoForm) {
      console.error("Photo upload form not found!");
      return;
    }

    photoForm.addEventListener("submit", (e) => {
      e.preventDefault();
      console.log("Photo upload form submitted!");

      const fileInput = document.getElementById("photo-upload");
      const dateInput = document.getElementById("photo-date");

      if (!fileInput || !dateInput) {
        console.error("File input or date input not found!");
        return;
      }

      if (!fileInput.files[0] || !dateInput.value) {
        alert("Please provide a photo and a date.");
        console.log("Validation failed: missing file or date.");
        return;
      }

      this.compressImage(fileInput.files[0], (compressedDataUrl) => {
        const photos = JSON.parse(localStorage.getItem("photos")) || [];
        photos.push({ src: compressedDataUrl, date: dateInput.value });
        localStorage.setItem("photos", JSON.stringify(photos));
        console.log("Photo saved successfully!");
        this.loadPhotos();
      });
    });
  },

  compressImage: function (file, callback) {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const maxWidth = 800;
        const scale = maxWidth / img.width;
        canvas.width = maxWidth;
        canvas.height = img.height * scale;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.7);
        callback(compressedDataUrl);
      };
    };

    reader.onerror = () => {
      console.error("Error reading image file.");
      alert("Failed to upload the photo. Please try again.");
    };

    reader.readAsDataURL(file);
  },

  loadPhotos: function () {
    console.log("Loading photos...");
    const gallery = document.getElementById("photo-gallery");
    if (!gallery) {
      console.error("Photo gallery element not found!");
      return;
    }

    const photos = JSON.parse(localStorage.getItem("photos")) || [];

    if (!photos.length) {
      gallery.innerHTML = "<p class='placeholder'>No photos uploaded yet.</p>";
      return;
    }

    gallery.innerHTML = photos
      .map(
        (photo, index) => `
        <div class="photo-item">
          <img src="${photo.src}" alt="Progress Photo">
          <p>${photo.date}</p>
          <button class="delete-photo-btn" data-index="${index}">Delete</button>
        </div>
      `
      )
      .join("");

    const deleteButtons = document.querySelectorAll(".delete-photo-btn");
    deleteButtons.forEach((button) =>
      button.addEventListener("click", (e) => {
        const index = e.target.getAttribute("data-index");
        this.deletePhoto(index);
      })
    );
  },

  deletePhoto: function (index) {
    console.log(`Deleting photo at index: ${index}`);
    const photos = JSON.parse(localStorage.getItem("photos")) || [];
    photos.splice(index, 1);
    localStorage.setItem("photos", JSON.stringify(photos));
    this.loadPhotos();
  },

  clearPhotos: function () {
    console.log("Clearing all photos...");
    localStorage.removeItem("photos");
    PhotoUploadModule.loadPhotos();
  },
};

// Initialize the application
window.addEventListener("DOMContentLoaded", GeneralModule.init);
