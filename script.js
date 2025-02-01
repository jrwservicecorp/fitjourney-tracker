// FitJourney Tracker - Version v7.76 (FULL RESTORE - CHART FIXES)

console.log("FitJourney Tracker v7.76 initializing...");

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
            requiredElements.versionDisplay.innerText = "v7.76";
        }

        ChartModule.init();  // FULL RESTORE
        WeightLoggingModule.init();
        PhotoUploadModule.init();
        PhotoComparisonModule.init();
        ExportModule.init();
        StreakTrackerModule.init();
        UserProfileModule.init();
        CommunityEngagementModule.init();
        DarkModeModule.init();
        CsvExportModule.init();

        console.log("All modules initialized successfully in FitJourney Tracker v7.76.");
    } catch (error) {
        console.error("Error initializing modules:", error);
    }
};

// Chart Module - FULL RESTORE
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

        const toggleSampleData = document.getElementById('toggle-demo-data');
        if (toggleSampleData) {
            toggleSampleData.addEventListener('change', function() {
                ChartModule.sampleDataEnabled = this.checked;
                ChartModule.chartInstance.data.datasets[0].hidden = !this.checked;
                ChartModule.chartInstance.update();
            });
        }
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
            ChartModule.goalWeight = weight - 10; // Default goal is 10 lbs below first entry
        }

        ChartModule.chartInstance.data.labels = [...ChartModule.labels];
        ChartModule.chartInstance.data.datasets[1].data = [...ChartModule.userWeights];
        ChartModule.chartInstance.data.datasets[2].data = Array(ChartModule.labels.length).fill(ChartModule.goalWeight);
        ChartModule.chartInstance.update();

        ChartModule.calculateTrend();
        console.log(`Chart updated: ${weight} lbs on ${date}`);
    },

    calculateTrend: function() {
        const trendAnalysis = document.getElementById('trend-analysis');
        if (!trendAnalysis || ChartModule.userWeights.length < 2) return;

        const recentChange = ChartModule.userWeights[ChartModule.userWeights.length - 1] - ChartModule.userWeights[0];
        let trendText = `Trend: `;

        if (recentChange < 0) {
            trendText += `⬇️ ${Math.abs(recentChange).toFixed(1)} lbs lost.`;
        } else if (recentChange > 0) {
            trendText += `⬆️ ${recentChange.toFixed(1)} lbs gained.`;
        } else {
            trendText += `No change in weight.`;
        }

        trendAnalysis.innerText = trendText;
    }
};
