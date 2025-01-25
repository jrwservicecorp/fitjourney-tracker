<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FitJourney Tracker</title>
  <link rel="stylesheet" href="style.css">
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script src="https://cdn.scaleflex.it/plugins/filerobot-image-editor/3.15.1/filerobot-image-editor.min.js"></script>
  <script src="script.js" defer></script>
</head>
<body>
  <header>
    <h1>FitJourney Tracker</h1>
    <p>App Version: <span id="app-version">v7.5</span></p>
  </header>

  <main id="main-app">
    <!-- Chart Section -->
    <div class="card prominent">
      <canvas id="weight-chart"></canvas>
      <p id="chart-placeholder">Start logging weight to see trends!</p>
      <div class="chart-options">
        <label>
          <input type="checkbox" id="toggle-demo-data" checked>
          Show Demo Data
        </label>
      </div>
    </div>

    <!-- Streak Awards -->
    <div class="card">
      <h3>Streak Awards</h3>
      <div class="streak-options">
        <label>
          <input type="checkbox" id="toggle-streaks" checked>
          Show Streaks
        </label>
      </div>
      <div id="streaks-section">
        <p>No streaks yet! Log your weight to unlock awards.</p>
      </div>
    </div>

    <!-- Dashboard Row -->
    <div class="dashboard-row">
      <div class="card weight-summary">
        <h3>Weight Summary</h3>
        <div id="weight-summary">
          <p class="placeholder">No data available for summary.</p>
        </div>
      </div>
      <div class="card recent-weighins">
        <h3>Recent Weigh-Ins</h3>
        <div id="recent-weighins">
          <p class="placeholder">No weigh-ins recorded yet.</p>
        </div>
      </div>
      <div class="card weight-checkin">
        <h3>Log Your Weight</h3>
        <form id="weight-form">
          <label for="weight-input">Weight:</label>
          <input id="weight-input" type="number" step="0.1" placeholder="lbs" required>
          <label for="date-input">Date:</label>
          <input id="date-input" type="date" required>
          <button type="submit">Log Weight</button>
        </form>
      </div>
      <div class="card upload-photo">
        <h3>Upload Progress Photo</h3>
        <form id="photo-upload-form">
          <label for="photo-upload">Select Photo:</label>
          <input id="photo-upload" type="file" accept="image/*">
          <label for="photo-date">Photo Date:</label>
          <input id="photo-date" type="date">
          <button id="upload-photo-btn" type="button">Upload Photo</button>
        </form>
      </div>
    </div>

    <!-- Photo Comparison -->
    <div class="card">
      <h3>Photo Comparison</h3>
      <div>
        <label for="photo-select-1">Select Photo 1:</label>
        <select id="photo-select-1" class="photo-select"></select>
      </div>
      <div>
        <label for="photo-select-2">Select Photo 2:</label>
        <select id="photo-select-2" class="photo-select"></select>
      </div>
      <button id="compare-photos-btn">Compare Photos</button>
      <div id="side-by-side-comparison" class="comparison-display"></div>
    </div>

    <!-- Photo Gallery -->
    <div class="card">
      <h3>Photo Gallery</h3>
      <div id="photo-gallery" class="gallery">
        <p class="placeholder">No photos uploaded yet.</p>
      </div>
      <button id="show-more-photos-btn">Show More</button>
    </div>
  </main>
</body>
</html>
