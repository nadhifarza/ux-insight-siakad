const surveyData = [
  { aspect: "Navigasi", score: 3.7, rating: "Cukup baik", priority: "Menengah" },
  { aspect: "Tampilan", score: 3.9, rating: "Baik", priority: "Rendah" },
  { aspect: "Kemudahan KRS", score: 3.1, rating: "Perlu perbaikan", priority: "Tinggi" },
  { aspect: "Kecepatan", score: 3.4, rating: "Cukup baik", priority: "Menengah" },
  { aspect: "Informasi", score: 4.0, rating: "Baik", priority: "Rendah" }
];

const satisfactionData = [48, 52, 20];
let barChart;
let donutChart;

const barContext = document.getElementById("barChart");
const donutContext = document.getElementById("donutChart");

function makeBarChart(data) {
  if (barChart) barChart.destroy();
  barChart = new Chart(barContext, {
    type: "bar",
    data: {
      labels: data.map(item => item.aspect),
      datasets: [{
        label: "Skor UX",
        data: data.map(item => item.score),
        backgroundColor: data.map(item => item.score <= 3.2 ? "#e7a36c" : "#766ce5"),
        borderRadius: 6,
        borderSkipped: false,
        barThickness: 27
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: context => ` Skor: ${context.raw.toFixed(1)} dari 5` } }
      },
      scales: {
        y: {
          min: 0, max: 5,
          ticks: { stepSize: 1, color: "#9296a8", font: { size: 10 } },
          grid: { color: "#f0f1f7" },
          border: { display: false }
        },
        x: {
          ticks: { color: "#777c92", font: { size: 10 }, maxRotation: 25, minRotation: 0 },
          grid: { display: false },
          border: { display: false }
        }
      }
    }
  });
}

function makeDonutChart() {
  if (donutChart) donutChart.destroy();
  donutChart = new Chart(donutContext, {
    type: "doughnut",
    data: {
      labels: ["Puas", "Cukup puas", "Tidak puas"],
      datasets: [{
        data: satisfactionData,
        backgroundColor: ["#43bd91", "#f1c45c", "#ed8585"],
        borderWidth: 0,
        hoverOffset: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "70%",
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: context => `${context.label}: ${context.raw} responden simulasi` } }
      }
    }
  });
}

function renderTable(data) {
  const table = document.getElementById("analysisTable");
  table.innerHTML = data.map(item => {
    const highPriority = item.priority === "Tinggi";
    const ratingClass = item.score <= 3.2 ? "rating low" : "rating";
    return `<tr>
      <td>${item.aspect}</td>
      <td><span class="score-pill">${item.score.toFixed(1)} / 5</span></td>
      <td><span class="${ratingClass}">${item.rating}</span></td>
      <td><span class="priority-tag ${highPriority ? "high" : ""}">${item.priority}</span></td>
    </tr>`;
  }).join("");
}

function updateDashboard() {
  const selected = document.getElementById("aspectFilter").value;
  const filtered = selected === "all" ? surveyData : surveyData.filter(item => item.aspect === selected);
  const avg = filtered.reduce((sum, item) => sum + item.score, 0) / filtered.length;
  const highest = [...filtered].sort((a, b) => b.score - a.score)[0];
  const lowest = [...filtered].sort((a, b) => a.score - b.score)[0];

  document.getElementById("scoreValue").textContent = avg.toFixed(1);
  document.getElementById("highestValue").textContent = highest.aspect;
  document.getElementById("lowestValue").textContent = lowest.aspect;
  document.getElementById("respondentValue").textContent = selected === "all" ? "120" : "24";
  document.getElementById("insightText").textContent =
    `${lowest.aspect} memperoleh skor terendah, yaitu ${lowest.score.toFixed(1)} dari 5 pada data simulasi. Aspek ini dapat menjadi prioritas evaluasi lebih lanjut melalui wawancara dan usability testing dengan mahasiswa.`;

  makeBarChart(filtered);
  renderTable(filtered);
}

document.getElementById("aspectFilter").addEventListener("change", updateDashboard);
document.getElementById("resetFilter").addEventListener("click", () => {
  document.getElementById("aspectFilter").value = "all";
  updateDashboard();
});

document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", () => {
    document.querySelectorAll(".nav-link").forEach(item => item.classList.remove("active"));
    link.classList.add("active");
    document.getElementById("sidebar").classList.remove("open");
  });
});

document.getElementById("menuButton").addEventListener("click", () => {
  document.getElementById("sidebar").classList.toggle("open");
});

makeDonutChart();
updateDashboard();
