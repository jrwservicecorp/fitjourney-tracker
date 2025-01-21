/* CSS (v2.55) */
body {
  font-family: 'Poppins', Arial, sans-serif;
  margin: 0;
  padding: 0;
  background: linear-gradient(to bottom right, #0f2027, #203a43, #2c5364);
  color: #f5f5f5;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.navbar {
  display: flex;
  justify-content: center;
  padding: 10px;
  background: #2c3e50;
}

.navbar a {
  text-decoration: none;
  color: white;
  padding: 10px 15px;
  font-size: 18px;
  font-weight: bold;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.navbar a:hover {
  background-color: #3498db;
}

.page.hidden {
  display: none;
}

.card {
  border-radius: 10px;
  background: #2c3e50;
  padding: 20px;
  margin: 20px 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

#weight-chart {
  width: 100%;
  max-height: 400px;
}

.collapsible-section {
  margin-top: 20px;
}

.toggle-btn {
  display: block;
  width: 100%;
  background: #3498db;
  color: white;
  padding: 10px;
  text-align: left;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 10px;
}

.collapsible-content {
  overflow: hidden;
  max-height: 0;
  transition: max-height 0.3s ease-out;
}

.collapsible-content.open {
  max-height: 300px; /* Adjust based on content size */
}

.progress-bar {
  width: 100%;
  background: #ccc;
  border-radius: 5px;
  margin-top: 10px;
}

.progress {
  height: 10px;
  background: #ff6f61;
}

.theme-toggle {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #3498db;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
