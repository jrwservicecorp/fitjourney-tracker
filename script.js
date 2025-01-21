/* CSS (v2.59) */
body {
  font-family: 'Poppins', Arial, sans-serif;
  margin: 0;
  padding: 0;
  background: linear-gradient(to bottom right, #0f2027, #203a43, #2c5364);
  color: #f5f5f5;
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
}

.page.hidden {
  display: none;
}

.summary-section {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.action-buttons button {
  background: #3498db;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.action-buttons button:hover {
  background: #1a73e8;
}

.photos-section {
  margin-top: 20px;
}

.card {
  border-radius: 10px;
  background: #2c3e50;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
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
