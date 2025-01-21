<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FitJourney Tracker</title>
  <link rel="stylesheet" href="style.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
  <header>
    <h1>FitJourney Tracker</h1>
    <p>App Version: <span id="app-version">v2.59</span></p>
  </header>
  <nav class="navbar" role="navigation" aria-label="Main Navigation">
    <a href="#" data-page="home"><i class="fas fa-home"></i> Home</a>
    <a href="#" data-page="dashboard"><i class="fas fa-chart-line"></i> Dashboard</a>
    <a href="#" data-page="settings"><i class="fas fa-cog"></i> Settings</a>
    <a href="#" data-page="about"><i class="fas fa-info-circle"></i> About</a>
  </nav>
  <div id="main-app">
    <section id="dashboard" class="page hidden">
      <div class="summary-section">
        <div class="card">
          <h3>Your Weight Trends</h3>
          <canvas id="weight-chart"></canvas>
          <p class="placeholder" id="chart-placeholder">Start logging your weight to see trends here!</p>
        </div>
        <div class="card">
          <h3>Summary</h3>
          <p>Average Weight: <span id="avg-weight">--</span> lbs</p>
          <p>Current Streak: <span id="current-streak">--</span> days</p>
          <p>Goal Progress: <span id="goal-progress">--%</span></p>
          <div class="progress-bar">
            <div class="progress" id="goal-progress-bar" style="width: 0%;"></div>
          </div>
        </div>
        <div class="action-buttons">
          <button class="toggle-btn" id="log-weight-toggle">Log Your Weight</button>
          <button class="toggle-btn" id="track-progress-toggle">Track Your Progress</button>
        </div>
      </div>
      <div class="photos-section card">
        <h3>Photos</h3>
        <input type="file" id="photo-upload" accept="image/*">
        <input type="date" id="photo-date">
        <input type="text" id="photo-description" placeholder="Add a description (optional)">
        <button id="upload-photo-btn">Upload Photo</button>
        <div id="photo-gallery">
          <p class="placeholder">No photos uploaded yet. Start uploading to see your progress!</p>
        </div>
      </div>
    </section>
  </div>
  <script src="script.js" defer></script>
</body>
</html>
