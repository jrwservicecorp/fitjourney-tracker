
const progressForm = document.getElementById('progress-form');
const photoGallery = document.getElementById('photo-gallery');
const ctx = document.getElementById('progress-chart').getContext('2d');

let progressData = [];
let chart;

function updateChart() {
  const labels = progressData.map(entry => entry.date);
  const weights = progressData.map(entry => entry.weight);

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Weight Progress',
        data: weights,
        borderColor: '#007bff',
        borderWidth: 2,
        fill: false,
      }],
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
}

progressForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const weight = document.getElementById('weight').value;
  const date = document.getElementById('date').value;
  const photo = document.getElementById('photo').files[0];

  if (weight && date) {
    progressData.push({ weight, date });
    updateChart();

    if (photo) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.src = e.target.result;
        photoGallery.appendChild(img);
      };
      reader.readAsDataURL(photo);
    }

    progressForm.reset();
  } else {
    alert('Please fill in all fields.');
  }
});
